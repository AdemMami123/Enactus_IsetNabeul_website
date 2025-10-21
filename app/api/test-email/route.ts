import { NextRequest, NextResponse } from "next/server";
import { verifyEmailConnection } from "@/lib/emailService";

export async function GET(request: NextRequest) {
  try {
    const isConnected = await verifyEmailConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "SMTP connection verified successfully ✅",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "SMTP connection failed ❌",
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Error verifying SMTP connection",
      error: error.message,
    }, { status: 500 });
  }
}
