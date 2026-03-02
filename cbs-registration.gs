/**
 * STANDALONE APPS SCRIPT FOR CBS REGISTRATION
 * 
 * Instructions:
 * 1. Create a NEW Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any existing code and paste this code below.
 * 4. Click 'Deploy' > 'New Deployment'.
 * 5. Type: 'Web App', Execute as: 'Me', Who has access: 'Anyone'.
 * 6. Copy the Deployment ID or Web App URL.
 */

/**
 * TEST FUNCTION: Run this in the Apps Script editor to test if the 
 * script correctly records data and sends emails to admins.
 */
function testCBSRegistration() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        studentName: "Test Student (System Test)",
        whatsappNumber: "9999999999",
        parentNumber: "8888888888",
        email: "test@example.com",
        schoolName: "Test High School"
      })
    }
  };
  
  Logger.log("🚀 Starting Registration Test...");
  const response = doPost(testData);
  Logger.log("📄 Response: " + response.getContent());
}

function doPost(e) {
  try {
    const p = e.parameter || {};
    let data = p;
    
    // Handle JSON POST requests
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    const timestamp = new Date();
    const studentName = data.studentName || data.name;
    const whatsapp = data.whatsappNumber || data.whatsapp;
    const parentMobile = data.parentNumber || data.parent;
    const email = data.email;
    const school = data.schoolName || data.school || "N/A";

    if (!studentName || !whatsapp) {
      throw new Error("Missing Student Name or WhatsApp Number");
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName("Registrations_2026");
    
    // Auto-create sheet with headers if missing
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Registrations_2026");
      sheet.appendRow(["Timestamp", "Student Name", "WhatsApp Number", "Parent Number", "Email", "School/College", "Payment Status"]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#dcfce7").setFontColor("#166534");
      sheet.setFrozenRows(1);
    }

    // Append the row
    sheet.appendRow([
      timestamp,
      studentName,
      whatsapp,
      parentMobile,
      email,
      school,
      "Pay at Office"
    ]);

    // Send Admin Notifications
    const adminEmails = ["vickymausam01@gmail.com", "ramsharma376769@gmail.com"];
    const subject = "🚀 NEW CBS Registration: " + studentName;
    const body = "New Student Registered for Come Back Series!\n\n" +
                 "Student: " + studentName + "\n" +
                 "WhatsApp: " + whatsapp + "\n" +
                 "Parent: " + parentMobile + "\n" +
                 "Email: " + email + "\n" +
                 "School: " + school + "\n\n" +
                 "Action: Contact student for office visit/payment.";
    
    adminEmails.forEach(mail => {
      try {
        GmailApp.sendEmail(mail, subject, body);
      } catch(e) {
        Logger.log("Admin Email error: " + e.message);
      }
    });

    // Send Student Confirmation Email (with WhatsApp Link)
    const waLink = "https://chat.whatsapp.com/GmXqlE7U4WBHYHJ20mwEoe";
    if (email && email.includes("@")) {
      const studentSubject = "Welcome to Come Back Series 2026 - SciFun Education";
      const studentHtmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #dcfce7; border-radius: 12px; padding: 25px; color: #1e293b;">
          <h2 style="color: #2563eb; margin-top: 0;">Registration Successful! 🎉</h2>
          <p>Hi <b>${studentName}</b>,</p>
          <p>Congratulations! You have successfully registered for the <b>60-Day Come Back Series</b> at SciFun Education.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h4 style="margin: 0 0 10px 0;">Next Steps:</h4>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Visit our <b>Valaipada Center</b> to confirm your seat.</li>
              <li>Registration Fee: <b>₹500 (Payable at Office)</b>.</li>
              <li>Join the WhatsApp Group for schedule updates.</li>
            </ol>
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${waLink}" style="background-color: #22c55e; color: white; padding: 12px 25px; border-radius: full; text-decoration: none; font-weight: bold; display: inline-block;">
              Join Our WhatsApp Group Now
            </a>
          </p>

          <p style="font-size: 13px; color: #64748b;">
            <b>Address:</b> Valaipada road santosh bhuvan, Nalasopara (E), Maharashtra 401209.<br>
            <b>Contact:</b> 9604249235 / 7057318654
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; text-align: center; color: #94a3b8;">SciFun Education - We make learning fun.</p>
        </div>
      `;
      
      try {
        GmailApp.sendEmail(email, studentSubject, "", { htmlBody: studentHtmlBody });
        Logger.log("✅ Confirmation email sent to student: " + email);
      } catch(e) {
        Logger.log("Student Email error: " + e.message);
      }
    }

    // Return success response with WhatsApp group link
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "Success", 
      message: "Registration recorded successfully.",
      whatsappGroup: "https://chat.whatsapp.com/GmXqlE7U4WBHYHJ20mwEoe"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "Error", 
      message: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
