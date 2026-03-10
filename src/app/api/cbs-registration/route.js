import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.json();
  
  // 1. Instructions for User:
  // Replace the URL below with your NEW standalone Apps Script URL 
  // after you deploy the cbs-registration.gs in Apps Script.
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyuHJcwDgAdxl6uTBi_aoalNAa7cxZ_9ThBjo_sB-tAHuYQHUIXhDPZqXMhNzagm5nN-Q/exec';

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
    console.error('CBS Registration Error:', error);
    return NextResponse.json({ status: "Error", message: 'Registration server error.' }, { status: 500 });
  }
}
