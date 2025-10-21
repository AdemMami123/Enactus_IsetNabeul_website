import { NextRequest, NextResponse } from "next/server";
import { sendAgendaNotification } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agendaTitle, agendaDescription, eventDate, members } = body;

    // Validate required fields
    if (!agendaTitle || !agendaDescription || !eventDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate members array
    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { success: false, message: "No members provided to notify" },
        { status: 400 }
      );
    }

    // Send emails to all members
    const results = [];
    for (const member of members) {
      try {
        const result = await sendAgendaNotification(
          member.email,
          member.name,
          agendaTitle,
          agendaDescription,
          new Date(eventDate)
        );
        results.push({
          email: member.email,
          success: result.success,
          messageId: result.messageId,
        });
        console.log(`✅ Agenda email sent to ${member.email}`);
      } catch (emailError) {
        console.error(`⚠️ Failed to send email to ${member.email}:`, emailError);
        results.push({
          email: member.email,
          success: false,
          error: emailError,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} emails successfully, ${failCount} failed`,
      totalMembers: members.length,
      successCount,
      failCount,
      results,
    });
  } catch (error: any) {
    console.error("Error in send-agenda-email API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while sending emails",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
