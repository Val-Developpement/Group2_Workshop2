import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, imageUrl } = body;

    
    if (!name || !price) {
      return NextResponse.json({ error: "Le nom et le prix sont requis" }, { status: 400 });
    }

   
    if (!price || price <= 0) {
      return NextResponse.json({ error: "Le prix doit être un nombre positif" }, { status: 400 });
    }

  
    const product = await stripe.products.create({
      name,
      description: description || "",
      images: imageUrl ? [imageUrl] : [],
    });

   
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price), 
      currency: "aed",
      product: product.id,
    });

    await stripe.products.update(product.id, {
      default_price: stripePrice.id,
    });
    
    return NextResponse.json({
      productId: product.id,
      priceId: stripePrice.id,
    });
  } catch (err: any) {
    console.error("Erreur Stripe:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
