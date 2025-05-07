import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Product } from "@/lib/models";
import { productSchema } from "@/lib/schemas";
import { z } from "zod";

connect();

const productListSchema = z.array(productSchema); // Wrap in array schema

export async function GET(request: NextRequest) {
  try {
    const products = await Product.find({});

    const validation = productListSchema.safeParse(products);

    if (!validation.success) {
      console.error("Zod validation error:", validation.error.format());
      return NextResponse.json(
        { error: "Product data validation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(validation.data, { status: 200 });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
