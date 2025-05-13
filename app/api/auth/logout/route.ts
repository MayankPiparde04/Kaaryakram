import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { connect } from "@/dbConfig/dbConfig";
import { User } from "@/lib/models";
import jwt from "jsonwebtoken";

// Connect to database
connect();

export async function POST(request: NextRequest) {
  try {
    // Get current token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    // If token exists, try to invalidate it in the database
    if (token) {
      try {
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || "fallback_secret"
        ) as { id: string };
        
        // Clear the refresh token in the database
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      } catch (error) {
        // Token verification failed, but we still want to clear cookies
        console.error("Error during token verification:", error);
      }
    }
    
    // Clear the token cookie regardless
    cookieStore.set({
      name: "token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
    
    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during logout" },
      { status: 500 }
    );
  }
}
