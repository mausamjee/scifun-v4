"use client";
import { useState } from 'react';
import { auth, db } from '../src/app/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function Seeder() {
  const [status, setStatus] = useState('Ready to inject data');

  const injectData = async () => {
    const user = auth.currentUser;
    if (!user) return setStatus('Please login first!');

    setStatus('Injecting...');

    try {
      // This overwrites the user document with the full profile
      await setDoc(doc(db, 'users', user.uid), {
        personal: {
          name: user.displayName || 'Student',
          email: user.email,
          standard: '10th A',
          rollNo: '24',
          schoolName: 'SciFun International',
          address: 'Flat 402, Galaxy Apartments, Mumbai',
          joiningDate: '15 June 2024',
          photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        },
        contact: {
          self: '+91 98765 43210',
          father: '+91 98765 00001',
          mother: '+91 98765 00002'
        },
        academic: {
          attendance: 86,
          marks: [
            { subject: 'Mathematics', score: 88, total: 100 },
            { subject: 'Science', score: 72, total: 100 },
            { subject: 'English', score: 91, total: 100 }
          ],
          homework: 'Math: Solve Ex 3.4 (Q1-Q5). Science: Draw diagram of Heart.',
          remarks: 'Talkative in class, but submits assignments on time.'
        },
        financial: {
          pendingFees: 2500
        }
      });

      setStatus('Success! Data injected. Now go to /dashboard');
    } catch (err) {
      console.error(err);
      setStatus('Error injecting data. Check console.');
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
      <p className="mb-4 text-gray-600">Click below to fill your profile with test data.</p>
      <button
        onClick={injectData}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
      >
        Inject Test Data
      </button>
      <p className="mt-4 font-mono text-blue-600">{status}</p>
    </div>
  );
}
