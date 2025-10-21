import nodemailer from "nodemailer";

// Verify we're running on the server
if (typeof window !== 'undefined') {
  throw new Error('emailService can only be used on the server side');
}

// SMTP Configuration from environment variables
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

console.log("📧 Email Service Configuration:", {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  user: smtpConfig.auth.user,
  passwordSet: !!smtpConfig.auth.pass,
});

const transporter = nodemailer.createTransport(smtpConfig);

// Verify SMTP connection
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified - Ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error);
    return false;
  }
};

// Email template for absence notification (French)
export const sendAbsenceNotification = async (
  memberEmail: string,
  memberName: string,
  meetingDate: Date,
  reason: string
) => {
  const formattedDate = meetingDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: `"Enactus ISET Nabeul" <${process.env.SMTP_USER}>`,
    to: memberEmail,
    subject: "⚠️ Notification d'Absence - Enactus ISET Nabeul",
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #FFD600 0%, #FFC700 100%);
            color: #000000;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .content {
            padding: 30px 20px;
          }
          .alert-box {
            background-color: #fff3cd;
            border-left: 4px solid #FFD600;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-row {
            margin: 10px 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
          }
          .info-label {
            font-weight: bold;
            color: #000;
          }
          .footer {
            background-color: #1a1a1a;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 12px;
          }
          .footer a {
            color: #FFD600;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Notification d'Absence</h1>
            <p style="margin: 5px 0 0 0;">Enactus ISET Nabeul</p>
          </div>
          <div class="content">
            <p>Bonjour <strong>${memberName}</strong>,</p>
            
            <div class="alert-box">
              <p style="margin: 0;">
                Nous vous informons que vous avez été marqué(e) comme <strong>absent(e)</strong> 
                lors de la réunion suivante :
              </p>
            </div>

            <div class="info-row">
              <span class="info-label">📅 Date de la réunion :</span><br>
              ${formattedDate}
            </div>

            <div class="info-row">
              <span class="info-label">📝 Raison :</span><br>
              ${reason}
            </div>

            <p style="margin-top: 25px;">
              Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez justifier votre absence, 
              veuillez contacter l'équipe administrative dès que possible.
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              <strong>Important :</strong> Veuillez vous assurer d'être présent(e) aux prochaines réunions 
              pour rester actif(ve) au sein de l'équipe Enactus.
            </p>
          </div>
          <div class="footer">
            <p>
              <strong>Enactus ISET Nabeul</strong><br>
              Institut Supérieur des Études Technologiques de Nabeul
            </p>
            <p>
              📧 <a href="mailto:enactusisetnabeul26@gmail.com">enactusisetnabeul26@gmail.com</a>
            </p>
            <p style="margin-top: 15px; color: #999;">
              Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Notification d'Absence - Enactus ISET Nabeul
      
      Bonjour ${memberName},
      
      Nous vous informons que vous avez été marqué(e) comme absent(e) lors de la réunion suivante :
      
      Date de la réunion : ${formattedDate}
      Raison : ${reason}
      
      Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez justifier votre absence, 
      veuillez contacter l'équipe administrative dès que possible.
      
      Important : Veuillez vous assurer d'être présent(e) aux prochaines réunions pour rester 
      actif(ve) au sein de l'équipe Enactus.
      
      ---
      Enactus ISET Nabeul
      Institut Supérieur des Études Technologiques de Nabeul
      Email: enactusisetnabeul26@gmail.com
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email d'absence envoyé à ${memberEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de l'email à ${memberEmail}:`, error);
    return { success: false, error };
  }
};

// Email template for new agenda item notification (French)
export const sendAgendaNotification = async (
  memberEmail: string,
  memberName: string,
  agendaTitle: string,
  agendaDescription: string,
  eventDate: Date
) => {
  const formattedDate = eventDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: `"Enactus ISET Nabeul" <${process.env.SMTP_USER}>`,
    to: memberEmail,
    subject: "📅 Nouvel Événement Ajouté à l'Agenda - Enactus ISET Nabeul",
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #FFD600 0%, #FFC700 100%);
            color: #000000;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .content {
            padding: 30px 20px;
          }
          .event-box {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 4px solid #FFD600;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          .event-title {
            font-size: 20px;
            font-weight: bold;
            color: #000;
            margin: 0 0 10px 0;
          }
          .info-row {
            margin: 10px 0;
            padding: 10px;
            background-color: #ffffff;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
          }
          .info-label {
            font-weight: bold;
            color: #000;
          }
          .cta-button {
            display: inline-block;
            background-color: #FFD600;
            color: #000000;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s;
          }
          .cta-button:hover {
            background-color: #FFC700;
          }
          .footer {
            background-color: #1a1a1a;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 12px;
          }
          .footer a {
            color: #FFD600;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Nouvel Événement à l'Agenda</h1>
            <p style="margin: 5px 0 0 0;">Enactus ISET Nabeul</p>
          </div>
          <div class="content">
            <p>Bonjour <strong>${memberName}</strong>,</p>
            
            <p>
              Un nouvel événement vient d'être ajouté à l'agenda d'Enactus ISET Nabeul. 
              Voici les détails :
            </p>

            <div class="event-box">
              <h2 class="event-title">📌 ${agendaTitle}</h2>
              
              <div class="info-row">
                <span class="info-label">📅 Date et heure :</span><br>
                ${formattedDate}
              </div>

              <div class="info-row">
                <span class="info-label">📝 Description :</span><br>
                ${agendaDescription}
              </div>
            </div>

            <p style="margin-top: 25px;">
              <strong>Nous comptons sur votre présence !</strong> 
              N'oubliez pas de marquer cet événement dans votre calendrier personnel.
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              💡 <strong>Conseil :</strong> Connectez-vous au tableau de bord pour voir tous les 
              événements à venir et rester informé(e) de toutes les activités d'Enactus.
            </p>
          </div>
          <div class="footer">
            <p>
              <strong>Enactus ISET Nabeul</strong><br>
              Institut Supérieur des Études Technologiques de Nabeul
            </p>
            <p>
              📧 <a href="mailto:enactusisetnabeul26@gmail.com">enactusisetnabeul26@gmail.com</a><br>
              📘 <a href="https://www.facebook.com/EnactusISETNabeul">Facebook</a> | 
              📸 <a href="https://www.instagram.com/enactusisetnabeul">Instagram</a>
            </p>
            <p style="margin-top: 15px; color: #999;">
              Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Nouvel Événement à l'Agenda - Enactus ISET Nabeul
      
      Bonjour ${memberName},
      
      Un nouvel événement vient d'être ajouté à l'agenda d'Enactus ISET Nabeul.
      
      Titre : ${agendaTitle}
      Date et heure : ${formattedDate}
      Description : ${agendaDescription}
      
      Nous comptons sur votre présence ! N'oubliez pas de marquer cet événement dans votre 
      calendrier personnel.
      
      Conseil : Connectez-vous au tableau de bord pour voir tous les événements à venir et 
      rester informé(e) de toutes les activités d'Enactus.
      
      ---
      Enactus ISET Nabeul
      Institut Supérieur des Études Technologiques de Nabeul
      Email: enactusisetnabeul26@gmail.com
      Facebook: https://www.facebook.com/EnactusISETNabeul
      Instagram: https://www.instagram.com/enactusisetnabeul
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email d'agenda envoyé à ${memberEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi de l'email à ${memberEmail}:`, error);
    return { success: false, error };
  }
};

// Batch send emails to multiple members
export const sendBatchEmails = async (
  members: Array<{ email: string; name: string }>,
  emailType: "absence" | "agenda",
  emailData: any
) => {
  const results = [];

  for (const member of members) {
    try {
      let result;
      if (emailType === "absence") {
        result = await sendAbsenceNotification(
          member.email,
          member.name,
          emailData.meetingDate,
          emailData.reason
        );
      } else if (emailType === "agenda") {
        result = await sendAgendaNotification(
          member.email,
          member.name,
          emailData.agendaTitle,
          emailData.agendaDescription,
          emailData.eventDate
        );
      }
      results.push({ member: member.email, ...result });
    } catch (error) {
      results.push({ member: member.email, success: false, error });
    }
  }

  return results;
};
