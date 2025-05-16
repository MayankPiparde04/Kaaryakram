import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Cart as CartModel } from "@/lib/models";
import { cartSchema } from "@/lib/schemas/cartSchema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

// Connect to database
connect();

// Quantity schema
const quantitySchema = z.object({
  quantity: z.number().int().positive(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    
    // Parse request body
    const body = await request.json();
    
    // Validate the quantity
    const { quantity } = quantitySchema.parse(body);
    
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
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.product === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate subtotal
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Save updated cart
    await cart.save();
    
    // Manually construct a plain object for validation
    const cartObject = {
      user: userId,
      items: Array.isArray(cart.items) ? [...cart.items] : [],
      subtotal: cart.subtotal,
      discount: cart.discount || 0,
      promoCode: cart.promoCode,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt || new Date()
    };
    
    // Validate with schema before returning
    const validatedCart = cartSchema.parse(cartObject);
    
    return NextResponse.json(validatedCart, { status: 200 });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { error: "Failed to update item quantity" },
      { status: 500 }
    );
  }
}
