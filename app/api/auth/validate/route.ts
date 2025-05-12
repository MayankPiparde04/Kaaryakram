import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connect } from "@/dbConfig/dbConfig";
import { User } from "@/lib/models";

// Connect to database
connect();

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "fallback_secret"
    ) as { id: string };
    
    // Fetch the user from the database to get the most up-to-date information
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Authentication validation error:", error);
    return NextResponse.json(
      { success: false, message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}
