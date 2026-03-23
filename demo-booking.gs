/**
 * STANDALONE APPS SCRIPT FOR FREE DEMO BOOKING
 * 
 * Instructions:
 * 1. Create a NEW Google Sheet for Free Demos.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any existing code and paste this code below.
 * 4. Click 'Deploy' > 'New Deployment' (Web App, Me, Anyone).
 * 5. Copy the Deployment URL for the /api/demo-booking/route.js.
 */

function doPost(e) {
  try {
    const p = e.parameter || {};
    let data = p;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    const timestamp = new Date();
    const studentName = data.studentName || data.name;
    const whatsapp = data.whatsappNumber || data.whatsapp;
    const grade = data.grade || "Not Specified";
    const board = data.board || "N/A";
    const stream = data.stream || "General";
    const email = data.email || "N/A";

    if (!studentName || !whatsapp) {
      throw new Error("Missing Student Name or WhatsApp Number");
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName("Demo_Bookings_2026");
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Demo_Bookings_2026");
      sheet.appendRow(["Timestamp", "Student Name", "WhatsApp Number", "Grade/Class", "Board", "Stream (11/12th)", "Email", "Status"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#eff6ff").setFontColor("#1e40af");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      timestamp,
      studentName,
      whatsapp,
      grade,
      board,
      stream,
      email,
      "New Demo Request"
    ]);

    // Admin Notifications
    const adminEmails = ["vickymausam01@gmail.com", "ramsharma376769@gmail.com"];
    const subject = "🎁 NEW Demo Booking: " + studentName + " (" + grade + ")";
    const body = "New Demo Session Request!\n\n" +
                 "Student: " + studentName + "\n" +
                 "WhatsApp: " + whatsapp + "\n" +
                 "Grade/Class: " + grade + "\n" +
                 "Board: " + board + "\n" +
                 "Stream: " + stream + "\n" +
                 "Email: " + email + "\n\n" +
                 "Action: Call student to schedule their FREE Demo session.";
    
    adminEmails.forEach(mail => {
      try {
        GmailApp.sendEmail(mail, subject, body);
      } catch(e) {
        Logger.log("Admin Email error: " + e.message);
      }
    });

    // Student Confirmation Email
    if (email && email.includes("@")) {
      const studentSubject = "Your FREE Demo Session is Booked! - SciFun Education";
      const studentHtmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eff6ff; border-radius: 12px; padding: 25px; color: #1e293b;">
          <h2 style="color: #2563eb; margin-top: 0;">Demo Request Received! </h2>
          <p>Hi <b>${studentName}</b>,</p>
          <p>Thank you for expressing interest in <b>SciFun Education</b>. We have received your request for a Free Demo Session.</p>
          
          <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h4 style="margin: 0 0 10px 0;">Booking Details:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Grade: <b>${grade}</b></li>
              <li>Board: <b>${board}</b></li>
              <li>Stream/Subject: <b>${stream}</b></li>
            </ul>
          </div>

          <p>Our team will call you within 24 hours to schedule your preferred time slot at our center.</p>

          <p style="font-size: 13px; color: #64748b;">
            <b>Office Address:</b> Valaipada road santosh bhuvan, Nalasopara (E), Maharashtra 401209.<br>
            <b>Contact:</b> 9604249235 / 7057318654
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; text-align: center; color: #94a3b8;">SciFun Education - Shaping Bright Futures.</p>
        </div>
      `;
      
      try {
        GmailApp.sendEmail(email, studentSubject, "", { htmlBody: studentHtmlBody });
        Logger.log("✅ Confirmation email sent to demo student: " + email);
      } catch(e) {
        Logger.log("Student Email error: " + e.message);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      status: "Success", 
      message: "Demo booked successfully." 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "Error", 
      message: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testDemoBooking() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        studentName: "Demo Test student",
        whatsappNumber: "0000000000",
        grade: "11th Science",
        stream: "Science",
        email: "demo@test.com"
      })
    }
  };
  Logger.log(doPost(testData).getContent());
}
