# 📧 Email Notification System - Documentation

## Overview
This system automatically sends email notifications to Enactus ISET Nabeul members in French for important events.

## ✅ Features Implemented

### 1. **Absence Notifications**
- Members receive an email when marked as absent
- Email includes: meeting date, reason for absence, and next steps
- Works for both individual and bulk absence marking

### 2. **Agenda/Event Notifications**
- All members receive an email when a new event is added to the agenda
- Email includes: event title, description, date, and time
- Encourages members to mark the event in their calendars

## 🔧 Technical Setup

### Dependencies Installed
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Environment Variables (.env.local)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ademmami91@gmail.com
SMTP_PASSWORD=mzsg guex rzqb uzeo
```

## 📁 Files Created/Modified

### New Files
1. **`lib/emailService.ts`** - Core email service with:
   - Nodemailer SMTP configuration
   - `sendAbsenceNotification()` - French email template for absences
   - `sendAgendaNotification()` - French email template for agenda items
   - `verifyEmailConnection()` - Test SMTP connection
   - `sendBatchEmails()` - Send to multiple recipients

2. **`app/api/test-email/route.ts`** - API endpoint to test SMTP connection

### Modified Files
1. **`components/AbsenceManagement.tsx`**
   - Updated `handleMarkAbsence()` - Sends email when marking individual absence
   - Updated `handleBulkSaveAttendance()` - Sends emails when bulk marking absences

2. **`components/AgendaManager.tsx`**
   - Updated `handleAddEvent()` - Sends emails to all members when creating new event

3. **`.env.local`** - Added SMTP configuration
4. **`.env.example`** - Added SMTP configuration template

## 📧 Email Templates (French)

### Absence Notification Email
**Subject:** ⚠️ Notification d'Absence - Enactus ISET Nabeul

**Content:**
- Professional HTML template with Enactus branding
- Member's name and personalized greeting
- Meeting date (formatted in French)
- Reason for absence
- Instructions for contacting administration
- Warning about staying active in the team

### Agenda Notification Email
**Subject:** 📅 Nouvel Événement Ajouté à l'Agenda - Enactus ISET Nabeul

**Content:**
- Professional HTML template with Enactus branding
- Event title and description
- Event date and time (formatted in French)
- Call-to-action to add to personal calendar
- Links to social media (Facebook, Instagram)
- Reminder to check the dashboard

## 🚀 How It Works

### Absence Workflow
1. Admin marks a member as absent (individual or bulk)
2. Absence record is saved to Firestore
3. Email notification is automatically sent to the member
4. Console logs confirmation or error
5. Operation continues even if email fails (non-blocking)

### Agenda Workflow
1. Admin creates a new event in the agenda
2. Event is saved to Firestore
3. System fetches all members from `users` collection
4. Email notification is sent to each member
5. Console logs status for each email
6. Operation continues even if some emails fail

## 🧪 Testing

### Test SMTP Connection
Visit: `http://localhost:3000/api/test-email`

Expected response:
```json
{
  "success": true,
  "message": "SMTP connection verified successfully ✅"
}
```

### Test Absence Email
1. Go to `/dashboard/absence`
2. Mark a member as absent
3. Check console for: `✅ Email notification sent to [email]`
4. Member receives email

### Test Agenda Email
1. Go to `/dashboard/agenda`
2. Create a new event
3. Check console for: `✅ Agenda email sent to [email]`
4. All members receive email

## ⚙️ Configuration

### Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Use this password in `.env.local` (not your regular password)

### SMTP Settings Explained
- **SMTP_HOST**: Gmail's SMTP server
- **SMTP_PORT**: 587 (TLS/STARTTLS)
- **SMTP_SECURE**: false (we use STARTTLS, not SSL)
- **SMTP_USER**: Your Gmail address
- **SMTP_PASSWORD**: Gmail app password

## 🎨 Email Design Features

### Visual Elements
- Enactus yellow (#FFD600) branding
- Responsive HTML design
- Clean typography (Segoe UI font family)
- Professional gradient headers
- Color-coded information boxes
- Mobile-friendly layout

### Accessibility
- Both HTML and plain text versions
- Clear subject lines with emojis for quick identification
- Structured content with headings and sections
- High contrast colors for readability

## 🔒 Security & Error Handling

### Security Measures
- Environment variables for sensitive credentials
- No credentials exposed in code
- Secure SMTP connection (TLS)

### Error Handling
- Try-catch blocks around email sending
- Non-blocking: if email fails, the main operation continues
- Console logging for debugging
- Graceful degradation

## 📊 Monitoring

### Console Logs
- `✅ SMTP connection verified` - Connection successful
- `✅ Email sent to [email]` - Individual email sent
- `⚠️ Failed to send email to [email]` - Email failed (operation continues)
- `❌ SMTP connection failed` - Connection issue

## 🔄 Future Enhancements

### Potential Improvements
1. **Email Queue System** - Use a job queue (Bull, Agenda) for better performance
2. **Email Templates in Database** - Allow admins to customize email templates
3. **Unsubscribe Option** - Let members opt-out of certain notifications
4. **Email Analytics** - Track open rates and click rates
5. **Rich Attachments** - Add event ICS files for calendar import
6. **Batch Sending Optimization** - Use BCC for better performance
7. **Email Scheduling** - Schedule emails for specific times
8. **Multi-language Support** - Support English and Arabic emails

## 📝 Notes

- All emails are sent in **French** as per requirements
- Email sending is **asynchronous** and doesn't block UI
- Failed emails are logged but don't stop the process
- Uses **Nodemailer** (most popular Node.js email library)
- Compatible with Gmail and other SMTP providers

## 🆘 Troubleshooting

### Common Issues

**Problem:** "SMTP connection failed"
- **Solution:** Check Gmail app password, verify 2FA is enabled

**Problem:** Emails not being received
- **Solution:** Check spam folder, verify recipient email addresses

**Problem:** "Authentication failed"
- **Solution:** Regenerate Gmail app password, update .env.local

**Problem:** Slow email sending
- **Solution:** Consider implementing email queue for large batches

## 📞 Support

For issues with the email system:
1. Check console logs for error messages
2. Test SMTP connection via `/api/test-email`
3. Verify environment variables in `.env.local`
4. Ensure Gmail app password is valid
5. Check Firestore for user email addresses

---

**Implementation Date:** October 21, 2025  
**Developer:** GitHub Copilot  
**Version:** 1.0.0  
**Status:** ✅ Fully Implemented and Tested
