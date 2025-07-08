import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'],
    });

    if (!product.default_price) {
      return NextResponse.json({ error: "Product has no default price" }, { status: 400 });
    }

    const price = product.default_price as Stripe.Price;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la session" }, { status: 500 });
  }
}
