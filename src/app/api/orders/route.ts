import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CreateOrderData } from "@/types/orders";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body: CreateOrderData = await req.json();
    const { items, shipping_address, billing_address, customer_email, customer_name, notes } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount,
        currency: "aed",
        shipping_address,
        billing_address,
        customer_email: customer_email || user.email,
        customer_name: customer_name || `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim(),
        notes,
        status: "pending"
      })
      .select()
      .single();

    if (orderError) {
      console.error("Création commande:", orderError);
      return NextResponse.json({ error: "Erreur création commande" }, { status: 500 });
    }

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id || null, 
      stripe_product_id: item.stripe_product_id,
      stripe_price_id: item.stripe_price_id || null, 
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url,
     
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      console.error("Création éléments commande:", itemsError);
      return NextResponse.json({ error: "Erreur éléments commande" }, { status: 500 });
    }

    return NextResponse.json({
      order_id: order.id,
      total_amount: order.total_amount,
      message: "Commande créée"
    });

  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Récupération commandes:", error);
      return NextResponse.json({ error: "Erreur récupération commandes" }, { status: 500 });
    }

    return NextResponse.json({ orders });

  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
