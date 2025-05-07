import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import { Pooja } from "@/lib/models"; // Mongoose model for pooja
import { ObjectId } from "mongodb"; // Needed if you manually cast _ids

connect();

export async function GET(request: NextRequest) {
  try {
    const poojaData = await Pooja.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "requiredItems",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          duration: 1,
          price: 1,
          category: 1,
          images: 1,
          requiredItems: "$productDetails.name", // Array of product names
        },
      },
    ]);

    if (!poojaData || poojaData.length === 0) {
      return NextResponse.json({ error: "No pooja data found" }, { status: 404 });
    }

    return NextResponse.json(poojaData, { status: 200 });
  } catch (error) {
    console.error("Error fetching pooja data:", error);
    return NextResponse.json({ error: "Failed to fetch pooja data" }, { status: 500 });
  }
}
