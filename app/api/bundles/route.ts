import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Bundle } from "@/lib/models"; // Mongoose model for bundle
import { ObjectId } from "mongodb";

connect();

export async function GET(request: NextRequest) {
  try {
    const bundleData = await Bundle.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          discount: 1,
          imageUrl: 1,
          createdAt: 1,
          category: { $literal: "bundle" },
          products: "$productDetails.name", // Array of product names
          productIds: "$products", // Keep original product IDs
        },
      },
    ]);

    if (!bundleData || bundleData.length === 0) {
      return NextResponse.json({ error: "No bundle data found" }, { status: 404 });
    }

    return NextResponse.json(bundleData, { status: 200 });
  } catch (error) {
    console.error("Error fetching bundle data:", error);
    return NextResponse.json({ error: "Failed to fetch bundle data" }, { status: 500 });
  }
}
