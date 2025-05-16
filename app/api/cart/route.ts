import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Cart as CartModel } from "@/lib/models";
import { cartSchema } from "@/lib/schemas/cartSchema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Connect to database
connect();

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies for user identification
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    // Default cart structure for unauthenticated users
    let userId = "guest-" + Math.random().toString(36).substring(2, 15);
    
    // If user is logged in, use their ID
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "fallback_secret"
        ) as { id: string };
        userId = decoded.id;
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // Find cart for the user directly as a lean object (plain JS object)
    let cart = await CartModel.findOne({ user: userId }).lean();
    
    console.log("Retrieved cart:", userId, cart ? "Found" : "Not found");
    
    if (!cart) {
      // Create a new cart if none exists
      const newCart = new CartModel({
        user: userId,
        items: [],
        subtotal: 0,
        discount: 0
      });
      await newCart.save();
      
      // Fetch it again as a lean object
      cart = await CartModel.findOne({ user: userId }).lean();
      console.log("Created new cart:", userId);
    }
    
    // Ensure cart.items is an array
    const items = Array.isArray(cart.items) ? cart.items : [];
    console.log("Cart items count:", items.length, "items");
    
    // Recalculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Update subtotal in DB if it's different
    if (subtotal !== cart.subtotal) {
      await CartModel.findOneAndUpdate(
        { user: userId },
        { $set: { subtotal: subtotal } }
      );
    }
    
    // Create a clean response object
    const responseCart = {
      user: userId,
      items: items,
      subtotal: subtotal,
      discount: cart.discount || 0,
      promoCode: cart.promoCode,
      createdAt: cart.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    console.log("Returning cart with", items.length, "items");
    
    // Validate with schema before returning
    const validatedCart = cartSchema.parse(responseCart);
    
    return NextResponse.json(validatedCart, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart", details: error.message },
      { status: 500 }
    );
  }
}
