import { NextResponse } from 'next/server';

// This API route is deprecated - logic moved to client side
// Keeping for backward compatibility but should not be used
export async function POST(request) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use client-side operations.' },
    { status: 410 }
  );
}

    // Use Firestore transaction to ensure atomicity
    await runTransaction(db, async (transaction) => {
      // Get referrer document
      const referrerRef = doc(db, 'users', referrerUid);
      const referrerDoc = await transaction.get(referrerRef);
      
      if (!referrerDoc.exists()) {
        throw new Error('Referrer not found');
      }

      const referrerData = referrerDoc.data();
      const referrals = referrerData.referrals || [];

      // Find and update the specific referral
      const referralIndex = referrals.findIndex(r => r.uid === referredUid);
      
      if (referralIndex === -1) {
        throw new Error('Referral not found');
      }

      if (referrals[referralIndex].status === 'approved') {
        throw new Error('Referral already approved');
      }

      // Update referral status
      referrals[referralIndex] = {
        ...referrals[referralIndex],
        status: 'approved',
        approvedAt: new Date().toISOString()
      };

      // Calculate new points (100 points per approved referral)
      const approvedCount = referrals.filter(r => r.status === 'approved').length;
      const newPoints = approvedCount * 100;

      // Update referrer document
      transaction.update(referrerRef, {
        referrals: referrals,
        'personal.points': newPoints
      });

      // Update referred student document
      const referredRef = doc(db, 'users', referredUid);
      const referredDoc = await transaction.get(referredRef);
      
      if (referredDoc.exists()) {
        transaction.update(referredRef, {
          'referralData.status': 'approved'
        });
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Referral approved successfully' 
    });

  } catch (error) {
    console.error('Error approving referral:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve referral' },
      { status: 500 }
    );
  }
}

