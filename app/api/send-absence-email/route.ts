import { NextRequest, NextResponse } from "next/server";
import { sendAbsenceNotification } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberEmail, memberName, meetingDate, reason } = body;

    // Validate required fields
    if (!memberEmail || !memberName || !meetingDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send the absence notification email
    const result = await sendAbsenceNotification(
      memberEmail,
      memberName,
      new Date(meetingDate),
      reason || "No reason provided"
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email sent successfully to ${memberEmail}`,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in send-absence-email API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while sending email",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
