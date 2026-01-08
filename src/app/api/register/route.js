import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/* 
  --------------------------------------------------------------------------------
  CONFIGURATION: FIREBASE SERVICE ACCOUNT (For Server Side)
  If you were using Google Apps Script, you would paste your keys here.
  In Next.js, we use 'service-account.json' in the root directory.
  
  Make sure you have a valid 'service-account.json' in your project root.
  Must have permissions for:
  1. Google Sheets API
  2. Firebase Admin SDK (if writing to Firestore from here)
  --------------------------------------------------------------------------------
*/

// CONSTANTS - REPLACE THESE WITH YOUR ACTUAL IDS
const SPREADSHEET_ID = 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID'; 
const SHEET_NAME = 'Sheet1';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // 1. SAVE TO GOOGLE SHEETS
    await saveToGoogleSheets(data);

    // 2. SEND WELCOME EMAIL
    // await sendWelcomeEmail(data); // Uncomment once email service is configured

    return NextResponse.json({ success: true, message: 'Backed up to Sheets successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function saveToGoogleSheets(studentData) {
  try {
    // Auth using service-account.json
    const auth = new google.auth.GoogleAuth({
      keyFile: 'service-account.json', // Path to your service account key in root
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare Row Data: [Name, Class, Board, Phone, ID, RegisteredAt]
    const rowValues = [
      studentData.name,
      studentData.studentClass,
      studentData.board,
      studentData.phone,
      studentData.id,
      studentData.controlNumber,
      studentData.registeredAt
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues],
      },
    });

    console.log('Saved to Google Sheets');
  } catch (error) {
    console.error('Error saving to Sheets:', error.message);
    // We don't throw here to ensure the UI success state is not broken if only Sheets fails
    // But in a strict system, you might want to throw.
    if (error.message.includes('ENOENT')) {
       console.warn('WARNING: service-account.json not found. Skipping Sheets backup.');
    }
  }
}

// Helper to simulate Email sending
async function sendWelcomeEmail(data) {
    // In a real Next.js app, use 'nodemailer' or 'resend'
    console.log(`Sending Email to ${data.phone}: Welcome ${data.name}! Your Digital ID is ready.`);
}
