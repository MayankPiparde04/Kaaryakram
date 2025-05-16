import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Cart as CartModel } from "@/lib/models";
import { cartSchema } from "@/lib/schemas/cartSchema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Connect to database
connect();

export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookies for user identification
    const cookieStore =await cookies();
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
    
    // Find cart for user
    const cart = await CartModel.findOne({ user: userId });
    
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }
    
    // Clear items and reset values
    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.promoCode = undefined;
    
    // Save updated cart
    await cart.save();
    
    // Validate with schema before returning
    const validatedCart = cartSchema.parse(cart.toObject());
    
    return NextResponse.json(validatedCart, { status: 200 });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
