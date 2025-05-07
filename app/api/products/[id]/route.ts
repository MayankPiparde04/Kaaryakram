import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Product } from "@/lib/models";
import { productSchema } from "@/lib/schemas";
import mongoose from "mongoose";

connect();

export async function GET(request: NextRequest, { params }: { params: { _id: string } }) {
  try {
    const { _id } = params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid product _ID" }, { status: 400 });
    }

    const product = await Product.findById(_id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const validation = productSchema.safeParse(product);
    if (!validation.success) {
      console.error("Validation error:", validation.error.format());
      return NextResponse.json(
        { error: "Product data validation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(validation.data, { status: 200 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
