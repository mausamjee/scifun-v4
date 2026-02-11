
/**
 * TEST FUNCTION: Run this to verify email sending works.
 */
function testSendEmail() {
  // Replace this with your own email to test
  const testEmail = "vickmausam01@gmail.com"; 
  
  Logger.log("Starting Email Test...");
  
  try {
    sendParentEmail(testEmail, "Test Student", "Absent", "2/5/2026", "Test Batch", "Scifun Main Branch");
    Logger.log("✅ Email sent successfully to " + testEmail);
  } catch (e) {
    Logger.log("❌ Error: " + e.message);
  }
}

// --- CONFIGURATION ---
// IMPORTANT: These names must match your React Dropdown values exactly.
// The values (e.g., "B1_Batch1_4to6") must match your Sheet Tab Names exactly.
const BATCH_SHEET_MAP = {
  "Scifun Main Branch": {
    "4pm-6pm Batch 1": "B1_Batch1_4to6",
    "6pm-8pm Batch 2": "B1_Batch2_6to8"
  },
  "Scifun Branch 2": {
    "2pm-4pm Batch 1": "B2_Batch1_2to4",
    "4pm-6pm Batch 2": "B2_Batch2_4to6",
    "6pm-8pm Batch 3": "B2_Batch3_6to8"
  }
};
// --- END OF CONFIGURATION ---

/**
 * Serves the web page or handles GET data requests.
 */
function doGet(e) {
  const params = e.parameter;
  
  if (params.action === 'getStudents') {
    return getStudents(params);
  }
  
  // Serves the HTML file if you visit the script URL directly (optional)
  return HtmlService.createTemplateFromFile('Index')
      .setTitle('Scifun Attendance System')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .evaluate();
}

/**
 * API: Fetches the list of students for a specific Branch & Batch.
 * Automatically pulls Names (Col A) and Emails (Col C) from the sheet.
 */
function getStudents(params) {
  try {
    const branch = params.branch;
    const batch = params.batch;

    if (!branch || !batch || !BATCH_SHEET_MAP[branch] || !BATCH_SHEET_MAP[branch][batch]) {
      throw new Error("Invalid Branch or Batch selection.");
    }

    const sheetName = BATCH_SHEET_MAP[branch][batch];
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      throw new Error(`Sheet named "${sheetName}" not found in the spreadsheet.`);
    }

    // Students start from Row 2 (based on your layout)
    // Column A (1): Name, Column C (3): Email
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return ContentService.createTextOutput(JSON.stringify({ students: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get Names and Emails
    const range = sheet.getRange(2, 1, lastRow - 1, 3);
    const values = range.getValues();
    
    const students = values.map(row => ({
      name: row[0],
      email: row[2] || "" // Email is in the 3rd column (index 2)
    })).filter(s => s.name);

    return ContentService.createTextOutput(JSON.stringify({ students: students }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- EXTERNAL DATA CONFIGURATION ---
// 🔴 IMPORTANT: Create a NEW Google Sheet for Marks and paste its ID here.
// Example ID looks like: 1BxiMVs0XRA5nSLd-dPEAHCeXD09LLMSs6...
const TEST_MARKS_SPREADSHEET_ID = "1gxAOiz7wiO_yZqJTofrSFGWUq7CoCaD2Y6XxSd0CtnY"; 
// -----------------------------------

/**
 * API: Handles POST requests (Submitting Attendance & Sending Emails).
 */
function doPost(e) {
  try {
    const param = e.parameter || {};
    const action = param.action;
    
    if (action === 'submitAttendance') {
      return saveAttendanceAndSendMail(e);
    } else if (action === 'submitMarks') {
      return saveMarks(e);
    }
    
    return ContentService.createTextOutput("Error: Invalid POST action.").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Saves test marks to the separate Test Marks Spreadsheet.
 */
function saveMarks(e) {
  try {
    const p = e.parameter || {};

    // 1. Extract Metadata
    const dateStr = p.date; // Expecting YYYY-MM-DD from input type="date"
    const batch = p.batch;
    const testName = p.testName;
    const totalMarks = p.totalMarks;

    if (!dateStr || !batch || !testName || !totalMarks) {
      throw new Error("Missing fields. Required: date, batch, testName, totalMarks");
    }

    // 2. Open the Test Marks Spreadsheet
    if (TEST_MARKS_SPREADSHEET_ID === "PASTE_YOUR_TEST_MARKS_SHEET_ID_HERE") {
      throw new Error("Please configure the TEST_MARKS_SPREADSHEET_ID in the script code first.");
    }
    const ss = SpreadsheetApp.openById(TEST_MARKS_SPREADSHEET_ID);
    
    // 3. Find or Create the Tab for the Batch
    let sheet = ss.getSheetByName(batch);
    if (!sheet) {
      // Create new sheet if it doesn't exist
      sheet = ss.insertSheet(batch);
      // Add Headers
      sheet.appendRow(["Date", "Student Name", "Test Topic", "Obtained", "Total"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold");
    }

    // 4. Format Date (dd/mm/yyyy)
    const parts = dateStr.split('-'); 
    const dateObj = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    const formattedDate = ("0" + dateObj.getUTCDate()).slice(-2) + "/" + ("0" + (dateObj.getUTCMonth() + 1)).slice(-2) + "/" + dateObj.getUTCFullYear();

    // 5. Process Students and Save Marks
    let i = 0;
    let savedCount = 0;
    
    while (p["studentName_" + i]) {
      const name = p["studentName_" + i];
      const marks = p["marks_" + i];
      
      // Use individual total marks if provided, otherwise fallback to the global/batch total
      const individualTotal = p["totalMarks_" + i] || totalMarks;
      
      // Only save if marks are entered (not empty)
      if (marks !== "" && marks !== null && marks !== undefined) {
        sheet.appendRow([
          formattedDate,
          name,
          testName,
          marks,
          individualTotal
        ]);
        savedCount++;
      }
      i++;
    }

    return ContentService.createTextOutput(`Success! Saved marks for ${savedCount} students.`);

  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.message);
  }
}

/**
 * Saves attendance data to the sheet and triggers email notifications.
 */
function saveAttendanceAndSendMail(e) {
  try {
    const p = e.parameter || {};

    // 1. Extract and Validate Metadata
    const dateStr = p.attendanceDate;
    const branch = p.branch;
    const batch = p.batch;

    if (!dateStr || !branch || !batch || branch === 'null' || batch === 'null') {
      throw new Error(`Missing fields. Received: Date=${dateStr}, Branch=${branch}, Batch=${batch}`);
    }

    const sheetName = BATCH_SHEET_MAP[branch][batch];
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);

    // 2. Handle the Date Column (Row 1 for date, Row 2 for Day)
    const parts = dateStr.split('-'); 
    // Input date is YYYY-MM-DD
    const attendanceDate = new Date(parts[0], parts[1] - 1, parts[2]); // Local time parsing to avoid UTC shift issues
    
    // We want to force the display format to dd/mm/yyyy
    const formattedDate = ("0" + attendanceDate.getDate()).slice(-2) + "/" + ("0" + (attendanceDate.getMonth() + 1)).slice(-2) + "/" + attendanceDate.getFullYear();
    const dayOfWeek = attendanceDate.toLocaleDateString('en-US', { weekday: 'long' });

    let dateCol = -1;
    const lastCol = sheet.getLastColumn();
    
    // Check existing headers (Row 1) for a date match
    if (lastCol >= 4) { 
      const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
      for (let i = 0; i < headers.length; i++) {
        const headerIndex = i + 1;
        const cellDate = parseHeaderToDate(headers[i]);
        
        // Compare Day, Month, Year
        if (cellDate && 
            cellDate.getDate() === attendanceDate.getDate() && 
            cellDate.getMonth() === attendanceDate.getMonth() && 
            cellDate.getFullYear() === attendanceDate.getFullYear()) {
          dateCol = headerIndex;
          break;
        }
      }
    }

    // New column if date not found
    if (dateCol === -1) {
      dateCol = Math.max(lastCol + 1, 4); 
      // Force Text Format for Date to ensure dd/mm/yyyy stays exactly as written
      sheet.getRange(1, dateCol).setNumberFormat("@").setValue(formattedDate).setFontWeight("bold").setHorizontalAlignment("center");
      sheet.getRange(2, dateCol).setValue(dayOfWeek).setFontWeight("bold").setHorizontalAlignment("center");
      sheet.setColumnWidth(dateCol, 100);
    }

    // 3. Map Student Names AND Emails from Sheet (Col A = Name, Col C = Email)
    const lastRow = sheet.getLastRow();
    const studentMap = {}; // Key: Name, Value: { rowIndex, email }

    if (lastRow >= 2) {
      // Fetch Col A (Name) through Col C (Email)
      const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      data.forEach((row, idx) => {
        const name = row[0].toString().trim();
        if (name) {
          studentMap[name] = {
            rowIndex: idx + 2, // Row index in sheet (starts at 1, data starts at 2)
            email: (row[2] || "").toString().trim() // Column C is index 2
          };
        }
      });
    }

    // 4. Process Status and Send Emails
    let i = 0;
    let updatedCount = 0;
    let emailsSent = 0;
    
    while (p["studentName_" + i]) {
      const name = p["studentName_" + i].trim();
      const status = p["status_" + i];
      
      if (studentMap[name]) {
        const studentInfo = studentMap[name];
        const row = studentInfo.rowIndex;
        
        // Use the email from the web form if provided, otherwise use the one from the sheet
        let email = p["email_" + i] || studentInfo.email;
        email = email.toString().trim();
        
        // If the email in the form is different from the sheet, update the sheet (Column C = 3)
        if (email && email !== studentInfo.email) {
          sheet.getRange(row, 3).setValue(email);
        }
        
        sheet.getRange(row, dateCol).setValue(status || "Absent");
        updatedCount++;
        
        // Trigger Email only for Absent, Not Done, or Partial (don't send for "HW Done")
        if (email && email.includes("@") && (status === "Absent" || status === "HW Not Done" || status === "HW Partial")) {
          // Split by comma in case there are multiple emails
          const emailList = email.split(',').map(e => e.trim()).filter(e => e.includes("@"));
          
          emailList.forEach(recipient => {
            try {
              // Note: We use the standardized 'formattedDate' string for the email
              sendParentEmail(recipient, name, status, formattedDate, batch, branch); // Added branch
              emailsSent++;
            } catch (mailErr) {
              Logger.log("Mail Error for " + name + " (to: " + recipient + "): " + mailErr);
            }
          });
        }
      }
      i++;
    }

    return ContentService.createTextOutput(`Success! Updated ${updatedCount} students. Emails sent: ${emailsSent}`);

  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput("Error: " + error.message);
  }
}

/**
 * Helper: robustly parses a spreadsheet header into a Date object.
 * Handles: Date Objects, "dd/mm/yyyy", "d/m/yy", etc.
 */
function parseHeaderToDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  
  const str = val.toString().trim();
  // Try dd/mm/yyyy or d/m/yy
  // Matches 1/2/26, 01/02/2026, etc.
  // Assumption: The sheet uses Day-First format (common in IN/UK)
  const parts = str.split('/');
  if (parts.length === 3) {
    let y = parseInt(parts[2]);
    // Handle 2-digit year (e.g., 26 -> 2026)
    if (y < 100) y += 2000; 
    const m = parseInt(parts[1]) - 1;
    const d = parseInt(parts[0]);
    return new Date(y, m, d);
  }
  return null;
}

/**
 * Sends a stylized email to parents with highlighted student name.
 * Now safer: It won't crash if you accidentally run it without arguments.
 */
/**
 * Sends a stylized email with Monthly Stats & Test Marks.
 */
function sendParentEmail(email, studentName, status, date, batch, branch) {
  if (!email || !email.includes("@")) {
    Logger.log("⚠️ Invalid Email: " + email);
    return;
  }

  // 1. Get Monthly Stats
  const stats = getMonthlyStats(branch, batch, studentName, date);
  
  // 2. Get Test Marks for this Month
  const testResults = getMonthlyTestMarks(batch, studentName, date);

  const highlightedName = `<b style="font-size: 16px; color: #1a73e8; text-transform: uppercase;">${studentName}</b>`;
  let subject = "";
  let introHTML = "";

  // --- Determine Subject & Intro based on Status ---
  if (status === "Absent") {
    subject = `🔴 ABSENT ALERT: ${studentName} - ${date}`;
    introHTML = `
      <div style="background-color: #fce8e6; padding: 15px; border-left: 5px solid #d93025; margin-bottom: 20px;">
        <h3 style="color: #d93025; margin-top: 0;">ABSENT ALERT</h3>
        <p>Dear Parent,</p>
        <p>This is to inform you that <b>${highlightedName}</b> was <b>ABSENT</b> for the class on <b>${date}</b>.</p>
        <p><i>Please ensure they attend the next session.</i></p>
      </div>`;
  } else if (status === "HW Not Done" || status === "HW Partial") {
    const isPartial = status === "HW Partial";
    subject = `📝 HOMEWORK ALERT: ${studentName} - ${date}`;
    introHTML = `
      <div style="background-color: #fff8e1; padding: 15px; border-left: 5px solid #f29900; margin-bottom: 20px;">
        <h3 style="color: #f29900; margin-top: 0;">HOMEWORK UPDATE</h3>
        <p>Dear Parent,</p>
        <p>The homework for <b>${highlightedName}</b> was <b style="color: ${isPartial ? '#f29900' : '#d93025'}">${isPartial ? 'PARTIALLY DONE' : 'NOT DONE'}</b> for the session on <b>${date}</b>.</p>
        <p><i>Please check their progress and ensure completion.</i></p>
      </div>`;
  }

  // --- Build Stats Section ---
  const statsHTML = `
    <div style="margin-top: 20px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px;">
      <h4 style="margin-top: 0; color: #202124; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">
        📊 ${stats.monthName} PROGRESS SUMMARY
      </h4>
      <ul style="line-height: 1.6;">
        <li><b>Attendance:</b> ${stats.presentCount} / ${stats.totalDays} Sessions (${stats.attendancePct}%)</li>
        <li><b>Homework:</b> ${stats.hwDoneCount} / ${stats.totalDays} Completed (${stats.hwPct}%)</li>
      </ul>
      
      ${testResults.length > 0 ? `
        <h4 style="margin-top: 15px; color: #202124; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
          📝 TEST PERFORMANCE
        </h4>
        <ul style="line-height: 1.6;">
          ${testResults.map(t => `<li>${t.date}: <b>${t.topic}</b> - ${t.obtained}/${t.total} (${t.pct}%)</li>`).join('')}
        </ul>
      ` : ''}

      <h4 style="margin-top: 15px; color: #d93025; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">
        ⚠️ Absences & Issues (This Month)
      </h4>
      <ul style="line-height: 1.6; color: #5f6368;">
        ${stats.issues.length > 0 ? stats.issues.map(i => `<li>${i.date}: <b>${i.status}</b></li>`).join('') : '<li>No other issues this month! 🎉</li>'}
      </ul>
    </div>
  `;

  // --- Final Email Body ---
  const fullBody = `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #202124;">
      ${introHTML}
      ${statsHTML}
      <p style="margin-top: 30px; font-size: 12px; color: #5f6368;">
        Regards,<br>
        <b>Scifun Education Team</b>
      </p>
    </div>
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: fullBody,
    name: "Scifun Education"
  });
}

/**
 * Helper: Calculates Monthly Attendance Stats
 */
function getMonthlyStats(branch, batch, studentName, currentDateStr) {
  try {
    const sheetName = BATCH_SHEET_MAP[branch] ? BATCH_SHEET_MAP[branch][batch] : null;
    if (!sheetName) return { monthName: "Current", presentCount: 0, totalDays: 0, attendancePct: 0, hwDoneCount: 0, hwPct: 0, issues: [] };

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    // Determine Month from Date string (e.g. "06/02/2026")
    const dateParts = currentDateStr.split('/'); 
    const targetMonth = parseInt(dateParts[1]) - 1; // Month Index is 2nd part (0-11)
    const targetYear = parseInt(dateParts[2]);
    const monthName = new Date(targetYear, targetMonth, 1).toLocaleString('default', { month: 'long' });

    // Find Student Row
    const data = sheet.getDataRange().getValues();
    let studentRow = null;
    for (let i = 1; i < data.length; i++) {
        if (data[i][0].toString().trim() === studentName.trim()) {
            studentRow = data[i];
            break;
        }
    }
    if (!studentRow) return { monthName, presentCount: 0, totalDays: 0, attendancePct: 0, hwDoneCount: 0, hwPct: 0, issues: [] };

    let totalDays = 0;
    let absentCount = 0;
    let hwIssueCount = 0;
    let issues = [];

    // Loop through columns to find dates in this month
    for (let c = 3; c < headers.length; c++) { 
       let headerVal = headers[c];
       let headerDate = null;

       // CRITICAL FIX: Handle Date Objects by converting to consistent String first
       if (headerVal instanceof Date) {
          const dateString = Utilities.formatDate(headerVal, Session.getScriptTimeZone(), "dd/MM/yyyy");
          headerDate = parseHeaderToDate(dateString);
       } else {
          headerDate = parseHeaderToDate(headerVal);
       }
       
       if (headerDate) {
          if (headerDate.getMonth() === targetMonth && headerDate.getFullYear() === targetYear) {
             const cellValue = studentRow[c] ? studentRow[c].toString() : "";
             
             // Skip Holidays OR Empty Cells (No Class)
             if (cellValue === "" || cellValue.toLowerCase().includes("holiday")) continue;
             
             totalDays++;
             
             // Format date for display (dd/MM)
             const displayDate = ("0" + headerDate.getDate()).slice(-2) + "/" + ("0" + (headerDate.getMonth()+1)).slice(-2);

             if (cellValue === "Absent") {
                 absentCount++;
                 issues.push({ date: displayDate, status: "Absent" });
             } else if (cellValue === "HW Not Done" || cellValue === "HW Partial") {
                 hwIssueCount++; 
                 issues.push({ date: displayDate, status: cellValue });
             }
          }
       }
    }
    
    // Add TODAY's issue if not already in list (depending on when sheet updates)
    // Actually, saveAttendance updates sheet BEFORE sending email, so it should be there.

    const presentCount = totalDays - absentCount;
    const attendancePct = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 100;
    
    const hwDoneCount = totalDays - absentCount - hwIssueCount; // Assuming Absent doesn't count as "HW Done"
    // Adjust HW denominator: Usually only count HW for days present? 
    // For simplicity: HW Score = (Total Days - Absent - HW Issues) / (Total Days - Absent)
    const daysPresent = totalDays - absentCount;
    const hwPct = daysPresent > 0 ? Math.round(((daysPresent - hwIssueCount) / daysPresent) * 100) : 100;

    return { monthName, presentCount, totalDays, attendancePct, hwDoneCount: (daysPresent - hwIssueCount), hwPct, issues };

  } catch (e) {
    Logger.log("Stats Error: " + e.message);
    return { monthName: "Error", presentCount: 0, totalDays: 0, attendancePct: 0, hwDoneCount: 0, hwPct: 0, issues: [] };
  }
}

/**
 * Helper: Fetches Test Marks for the Month
 */
function getMonthlyTestMarks(batch, studentName, currentDateStr) {
  try {
    if (TEST_MARKS_SPREADSHEET_ID.includes("PASTE")) return [];
    
    const ss = SpreadsheetApp.openById(TEST_MARKS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(batch);
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues(); // [Date, Name, Topic, Obt, Total]
    
    // Parse target month (dd/mm/yyyy)
    const dateParts = currentDateStr.split('/'); 
    const targetMonth = parseInt(dateParts[1]); // Month is now 2nd part
    const targetYear = parseInt(dateParts[2]);

    let results = [];
    
    // Skip Header (Row 0)
    for (let i = 1; i < data.length; i++) {
        const rowDateStr = data[i][0].toString(); // "dd/mm/yyyy"
        const rowName = data[i][1].toString();
        
        if (rowName === studentName) {
            // Check Month
            const parts = rowDateStr.split('/'); // dd, mm, yyyy
            if (parts.length === 3) {
                const m = parseInt(parts[1]);
                const y = parseInt(parts[2]);
                
                if (m === targetMonth && y === targetYear) {
                   const obt = data[i][3];
                   const tot = data[i][4];
                   const pct = tot > 0 ? Math.round((obt/tot)*100) : 0;
                   results.push({
                       date: rowDateStr,
                       topic: data[i][2],
                       obtained: obt,
                       total: tot,
                       pct: pct
                   });
                }
            }
        }
    }
    return results;

  } catch (e) {
    Logger.log("Tests Error: " + e.message);
    return [];
  }
}
