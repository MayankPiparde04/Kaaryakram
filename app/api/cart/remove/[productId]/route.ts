import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Cart as CartModel } from "@/lib/models";
import { cartSchema } from "@/lib/schemas/cartSchema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Connect to database
connect();

export async function DELETE(
  request: NextRequest,
  context: { params: { productId: string } }
) {
  try {
    // Access productId from the context params
    const productId = context.params.productId;
    console.log(`Attempting to remove product: ${productId}`);
    
    // Get token from cookies for user identification
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    let userId;
    
    // If user is logged in, use their ID
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "fallback_secret"
        ) as { id: string };
        userId = decoded.id;
        console.log("User ID from token:", userId);
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
    
    // If no valid token, use guest ID from cookies
    if (!userId) {
      const guestId = cookieStore.get("guestId")?.value;
      userId = guestId || "guest-" + Math.random().toString(36).substring(2, 15);
    }
    
    console.log("Using user ID for cart:", userId);
    
    // Use MongoDB's atomic $pull operation to remove the item
    const updateResult = await CartModel.findOneAndUpdate(
      { user: userId },
      { 
        $pull: { 
          items: { product: productId } 
        },
        $set: { updatedAt: new Date() }
      },
      { new: true } // Return the updated document
    );
    
    if (!updateResult) {
      console.error("Cart not found for user", userId);
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }
    
    // Ensure items is an array
    const items = Array.isArray(updateResult.items) ? updateResult.items : [];
    console.log("Items after removal:", items.length);
    
    // Recalculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    // Update the subtotal
    await CartModel.findOneAndUpdate(
      { user: userId },
      { $set: { subtotal } }
    );
    
    // Get fresh copy of cart with all updates
    const updatedCart = await CartModel.findOne({ user: userId }).lean();
    
    // Create response object
    const cartObject = {
      user: userId,
      items: Array.isArray(updatedCart.items) ? updatedCart.items : [],
      subtotal: updatedCart.subtotal || 0,
      discount: updatedCart.discount || 0,
      promoCode: updatedCart.promoCode,
      createdAt: updatedCart.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    // Validate with schema before returning
    const validatedCart = cartSchema.parse(cartObject);
    
    return NextResponse.json(validatedCart, { status: 200 });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart", details: error.message },
      { status: 500 }
    );
  }
}
