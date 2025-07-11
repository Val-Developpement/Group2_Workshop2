import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { orderId, productId, items } = await req.json();

    if (productId) {
      const product = await stripe.products.retrieve(productId, { expand: ['default_price'] });
      const price = product.default_price as Stripe.Price;

      if (!price) {
        return NextResponse.json({ error: "Produit sans prix" }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/cancel`,
        metadata: {
          order_id: orderId || 'single_product',
          user_id: user.id,
        },
      });

      return NextResponse.json({ url: session.url });
    }

    
    const lineItems = [];

    for (const item of items || []) {
      if (!item.stripe_product_id) {
        return NextResponse.json({ error: `Produit "${item.name}" sans stripe_product_id` }, { status: 400 });
      }

      // Pour les services, utiliser le stripe_price_id spécifique
      if (item.stripe_price_id) {
        lineItems.push({ price: item.stripe_price_id, quantity: item.quantity });
      } else {
        // Pour les produits, utiliser le prix par défaut
        const product = await stripe.products.retrieve(item.stripe_product_id, { expand: ['default_price'] });
        const price = product.default_price as Stripe.Price;

        if (!price) {
          return NextResponse.json({ error: `Pas de prix pour ${item.name}` }, { status: 400 });
        }

        lineItems.push({ price: price.id, quantity: item.quantity });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/cancel`,
      metadata: {
        order_id: orderId,
        user_id: user.id,
      },
    });

    if (orderId) {
      await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", orderId);
    }

    return NextResponse.json({ url: session.url, session_id: session.id, order_id: orderId });
  } catch (err) {
    console.error("Erreur session Stripe:", err);
    return NextResponse.json({ error: "Erreur lors du paiement" }, { status: 500 });
  }
}
