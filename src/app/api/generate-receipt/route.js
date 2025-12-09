import { NextResponse } from 'next/server';
// PDF generation disabled temporarily; storage not used

/**
 * Generate a receipt PDF and upload it to Google Drive
 * POST /api/generate-receipt
 * Body: { studentName, amount, studentUid, board, class }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { studentName, amount, studentUid, board, class: studentClass } = body;

    // Validate required fields
    if (!studentName || !amount || !studentUid) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, amount, studentUid' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    return NextResponse.json({
      success: true,
      transactionId: transactionId,
      message: 'Receipt generation is temporarily disabled; no PDF created.'
    });

  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}

