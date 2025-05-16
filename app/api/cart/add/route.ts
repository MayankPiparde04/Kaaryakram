import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Cart as CartModel } from "@/lib/models";
import { cartItemSchema, cartSchema } from "@/lib/schemas/cartSchema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Connect to database
connect();

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate the item with zod
    const validItem = cartItemSchema.parse(body);

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

    // First, check if the user has a cart
    const existingCart = await CartModel.findOne({ user: userId }).lean();
    console.log("Existing cart found:", existingCart ? "Yes" : "No");

    if (!existingCart) {
      // Create a new cart with the item
      const newCart = new CartModel({
        user: userId,
        items: [validItem],
        subtotal: validItem.price * validItem.quantity,
        discount: 0
      });
      await newCart.save();
      console.log("Created new cart with 1 item");

      // Return the new cart
      const newCartObject = {
        user: userId,
        items: [validItem],
        subtotal: validItem.price * validItem.quantity,
        discount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return NextResponse.json(cartSchema.parse(newCartObject), { status: 200 });
    }

    // At this point, we have an existing cart
    // First, let's check the content of the current cart
    console.log("Current cart items before update:", JSON.stringify(existingCart.items));

    // Check if the item already exists in the cart
    const itemExists = existingCart.items &&
      Array.isArray(existingCart.items) &&
      existingCart.items.some(item => item && item.product === validItem.product);

    if (itemExists) {
      // Update quantity if item exists
      await CartModel.findOneAndUpdate(
        { user: userId, "items.product": validItem.product },
        {
          $inc: {
            "items.$.quantity": validItem.quantity,
            subtotal: validItem.price * validItem.quantity
          }
        }
      );
      console.log("Updated existing item quantity for:", validItem.product);
    } else {
      // Replace the entire items array with a clean version plus the new item
      const currentItems = existingCart.items && Array.isArray(existingCart.items)
        ? existingCart.items.filter(item =>
          item &&
          typeof item === 'object' &&
          item.product &&
          typeof item.quantity === 'number' &&
          typeof item.price === 'number')
        : [];

      // Add the new item to the clean array
      const newItems = [...currentItems, validItem];

      // Replace the entire items array
      await CartModel.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            items: newItems,
            updatedAt: new Date()
          }
        }
      );

      // Also update the subtotal
      const newSubtotal = newItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      await CartModel.findOneAndUpdate(
        { user: userId },
        { $set: { subtotal: newSubtotal } }
      );

      console.log("Replaced cart items with clean array including new item:", validItem.product);
    }

    // Get the latest version of the cart
    const updatedCart = await CartModel.findOne({ user: userId }).lean();

    if (!updatedCart) {
      throw new Error("Failed to retrieve updated cart");
    }

    // Ensure items is an array and all items are valid
    const cartItems = Array.isArray(updatedCart.items)
      ? updatedCart.items.filter(item =>
        item &&
        typeof item === 'object' &&
        item.product &&
        typeof item.quantity === 'number' &&
        typeof item.price === 'number')
      : [];

    console.log("Final cart has", cartItems.length, "items:",
      JSON.stringify(cartItems.map(item => item.product)));

    // Recalculate subtotal based on valid items
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Actually update the subtotal
    await CartModel.findOneAndUpdate(
      { user: userId },
      { $set: { subtotal: subtotal } }
    );

    // Format the response with clean data
    const responseCart = {
      user: userId,
      items: cartItems,
      subtotal: subtotal,
      discount: 0,
      promoCode: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate and return
    try {
      const validatedCart = cartSchema.parse(responseCart);
      return NextResponse.json(validatedCart, { status: 200 });
    } catch (validationError) {
      console.error("Validation error:", validationError);

      // Return a safe response in case of validation errors
      return NextResponse.json({
        user: userId,
        items: [],
        subtotal: 0,
        discount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { status: 200 });
    }

  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart", details: error.message },
      { status: 500 }
    );
  }
}
