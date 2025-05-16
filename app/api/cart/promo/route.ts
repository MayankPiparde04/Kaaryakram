import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Cart as CartModel } from "@/lib/models";
import { cartSchema } from "@/lib/schemas/cartSchema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

// Connect to database
connect();

// Promo code schema
const promoCodeSchema = z.object({
  promoCode: z.string().min(1),
});

// Mock promo codes (in a real app, these would come from a database)
const promoCodes = {
  "WELCOME10": 0.1, // 10% discount
  "FIRST10": 0.1,   // 10% discount
  "POOJA20": 0.2,   // 20% discount
  "DIWALI25": 0.25, // 25% discount
};

// Apply promo code
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate the promo code
    const { promoCode } = promoCodeSchema.parse(body);
    
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
    
    // Check if promo code is valid
    const discountRate = promoCodes[promoCode];
    if (!discountRate) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 400 }
      );
    }
    
    // Apply promo code and calculate discount
    cart.promoCode = promoCode;
    cart.discount = Math.round(cart.subtotal * discountRate);
    
    // Save updated cart
    await cart.save();
    
    // Validate with schema before returning
    const validatedCart = cartSchema.parse(cart.toObject());
    
    return NextResponse.json(validatedCart, { status: 200 });
  } catch (error) {
    console.error("Error applying promo code:", error);
    return NextResponse.json(
      { error: "Failed to apply promo code" },
      { status: 500 }
    );
  }
}

// Remove promo code
export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookies for user identification
    const cookieStore = cookies();
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
    
    // Remove promo code and discount
    cart.promoCode = undefined;
    cart.discount = 0;
    
    // Save updated cart
    await cart.save();
    
    // Validate with schema before returning
    const validatedCart = cartSchema.parse(cart.toObject());
    
    return NextResponse.json(validatedCart, { status: 200 });
  } catch (error) {
    console.error("Error removing promo code:", error);
    return NextResponse.json(
      { error: "Failed to remove promo code" },
      { status: 500 }
    );
  }
}
