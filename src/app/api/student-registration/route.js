import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyKtmn8cpLXKhmWjlk_6qEKR0QbCpgeQEyuI2xaqHU2lA75QnsD32JRxknR_diuPzhp/exec';

  try {
    // Forward the request to Google Apps Script
    const appsScriptResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await appsScriptResponse.text();

    if (appsScriptResponse.ok) {
      try {
        const jsonResponse = JSON.parse(responseText);
        return NextResponse.json(jsonResponse);
      } catch (e) {
        return NextResponse.json({ message: responseText });
      }
    } else {
      return NextResponse.json({ message: `Error from registration service: ${responseText}` }, { status: appsScriptResponse.status });
    }
  } catch (error) {
    console.error('Error forwarding to Google Apps Script:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}