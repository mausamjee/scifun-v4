import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();
  
  // 1. Instructions:
  // Replace the URL below with your NEW standalone Apps Script URL 
  // after you deploy the demo-booking.gs in Apps Script.
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycby6cyJdGT2IrJyCKk7Yhhe7YWXtAOvA4meVytu3EIJeCfJgsgB40QbJf6yo_BwPKrLj/exec';

  try {
    const appsScriptResponse = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resultText = await appsScriptResponse.text();
    let resultJson;
    try {
        resultJson = JSON.parse(resultText);
        return NextResponse.json(resultJson);
    } catch (e) {
        return NextResponse.json({ status: "Error", message: resultText });
    }

  } catch (error) {
    console.error('Demo Booking Error:', error);
    return NextResponse.json({ status: "Error", message: 'Demo booking server error.' }, { status: 500 });
  }
}
