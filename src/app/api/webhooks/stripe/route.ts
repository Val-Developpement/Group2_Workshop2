import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Erreur de signature webhook:", err);
      return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
    }

    const supabase = await createClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.order_id && session.metadata.order_id !== 'single_product') {
          
          const { error } = await supabase
            .from("orders")
            .update({
              status: "paid",
              stripe_payment_intent_id: session.payment_intent as string,
              updated_at: new Date().toISOString()
            })
            .eq("id", session.metadata.order_id);

          if (error) {
            console.error("Erreur lors de la mise à jour de la commande:", error);
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const { data: order, error } = await supabase
          .from("orders")
          .update({
            status: "paid",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .select()
          .single();

        if (error) {
          console.error("Erreur lors de la mise à jour de la commande:", error);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        
        const { error } = await supabase
          .from("orders")
          .update({
            status: "failed",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (error) {
          console.error("Erreur lors de la mise à jour de la commande échouée:", error);
        } 
        
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.order_id && session.metadata.order_id !== 'single_product') {
          
          const { error } = await supabase
            .from("orders")
            .update({
              status: "cancelled",
              updated_at: new Date().toISOString()
            })
            .eq("id", session.metadata.order_id);

          if (error) {
            console.error("Erreur lors de la mise à jour de la commande expirée:", error);
          } 
          
        }
        break;
      } 
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 