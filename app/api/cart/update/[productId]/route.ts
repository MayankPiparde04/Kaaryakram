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
  context: { params: { productId: string } }
) {
  try {
    // Access productId from the awaited params object
    const productId = context.params.productId;
    
    // Parse request body
    const body = await request.json();
    
    // Validate the quantity
    const { quantity } = quantitySchema.parse(body);
    
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
    
    // Find cart for user with lean() for plain JS objects
    const cart = await CartModel.findOne({ user: userId }).lean();
    
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }
    
    // Ensure cart.items is an array and directly process items
    if (!Array.isArray(cart.items) || cart.items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }
    
    // Log the operation for debugging
    console.log(`Updating product ${productId} quantity to ${quantity}`);
    console.log("Current cart items:", JSON.stringify(cart.items.map(item => item.product)));
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item.product === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart", productId, cartItems: cart.items.map(item => item.product) },
        { status: 404 }
      );
    }
    
    // Use findOneAndUpdate with direct positional operator for atomic update
    const result = await CartModel.findOneAndUpdate(
      { 
        user: userId,
        "items.product": productId
      },
      { 
        $set: { 
          "items.$.quantity": quantity,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    
    if (!result) {
      return NextResponse.json(
        { error: "Failed to update cart" },
        { status: 500 }
      );
    }
    
    // Ensure items is an array before using reduce
    const items = Array.isArray(result.items) ? result.items : [];
    
    // Recalculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Update subtotal
    await CartModel.findOneAndUpdate(
      { user: userId },
      { $set: { subtotal } }
    );
    
    // Get fresh copy of cart with all updates
    const updatedCart = await CartModel.findOne({ user: userId }).lean();
    
    // Prepare response
    const cartObject = {
      user: userId,
      items: Array.isArray(updatedCart.items) ? updatedCart.items : [],
      subtotal: updatedCart.subtotal || 0,
      discount: updatedCart.discount || 0,
      promoCode: updatedCart.promoCode,
      createdAt: updatedCart.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    // Validate and return
    const validatedCart = cartSchema.parse(cartObject);
    
    return NextResponse.json(validatedCart, { status: 200 });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { error: "Failed to update item quantity", details: error.message },
      { status: 500 }
    );
  }
}
