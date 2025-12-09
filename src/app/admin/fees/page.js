'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { checkAdminRole } from '../../../utils/adminAuth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  increment, 
  arrayUnion,
  runTransaction,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  Search, 
  DollarSign, 
  PlusCircle, 
  Loader2,
  ArrowLeft,
  User,
  Calendar,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function AdminFeesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('email'); // 'email' or 'uid'
  const [searching, setSearching] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Collect Fee state
  const [feeAmount, setFeeAmount] = useState('');
  const [collectingFee, setCollectingFee] = useState(false);

  // Adjustment state
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [addingAdjustment, setAddingAdjustment] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/admin');
        return;
      }

      const adminStatus = await checkAdminRole(currentUser.uid);
      if (!adminStatus) {
        router.push('/admin');
        return;
      }

      setUser(currentUser);
      setIsAdmin(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const searchStudent = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    setSearching(true);
    setSearchError('');
    setStudentData(null);

    try {
      let studentDoc = null;

      if (searchType === 'uid') {
        // Search by UID directly
        const docRef = doc(db, 'users', searchQuery.trim());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          studentDoc = { id: docSnap.id, ...docSnap.data() };
        }
      } else {
        // Search by email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('personal.email', '==', searchQuery.trim()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          studentDoc = { id: doc.id, ...doc.data() };
        }
      }

      if (studentDoc) {
        setStudentData(studentDoc);
      } else {
        setSearchError('Student not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Error searching for student: ' + error.message);
    } finally {
      setSearching(false);
    }
  };

  const handleCollectFee = async () => {
    if (!studentData) {
      setSearchError('Please search for a student first');
      return;
    }

    const amount = parseFloat(feeAmount);
    if (isNaN(amount) || amount <= 0) {
      setSearchError('Please enter a valid amount greater than 0');
      return;
    }

    setCollectingFee(true);
    setSearchError('');

    try {
      // Call receipt generation API
      const response = await fetch('/api/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: studentData.personal?.name || 'Student',
          amount: amount,
          studentUid: studentData.id,
          board: studentData.feeConfig?.board,
          class: studentData.feeConfig?.class
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate receipt');
      }

      // Update Firestore using transaction
      const userRef = doc(db, 'users', studentData.id);
      
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error('Student document not found');
        }

        // Update totalPaid
        transaction.update(userRef, {
          'feeConfig.totalPaid': increment(amount)
        });

        // Add transaction record
        transaction.update(userRef, {
          transactions: arrayUnion({
            amount: Number(amount),
            date: new Date().toISOString(),
            transactionId: result.transactionId
          })
        });
      });

      // Refresh student data
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        setStudentData({ id: updatedDoc.id, ...updatedDoc.data() });
      }

      setFeeAmount('');
      setSearchError('');
      alert('Fee collected successfully! Receipt generated.');
    } catch (error) {
      console.error('Error collecting fee:', error);
      setSearchError('Failed to collect fee: ' + error.message);
    } finally {
      setCollectingFee(false);
    }
  };

  const handleAddAdjustment = async () => {
    if (!studentData) {
      setSearchError('Please search for a student first');
      return;
    }

    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setSearchError('Please enter a valid amount greater than 0');
      return;
    }

    if (!adjustmentReason.trim()) {
      setSearchError('Please enter a reason for the adjustment');
      return;
    }

    setAddingAdjustment(true);
    setSearchError('');

    try {
      const userRef = doc(db, 'users', studentData.id);
      
      await updateDoc(userRef, {
        'feeConfig.totalDiscount': increment(amount),
        adjustments: arrayUnion({
          amount: Number(amount),
          reason: adjustmentReason.trim(),
          date: new Date().toISOString()
        })
      });

      // Refresh student data
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        setStudentData({ id: updatedDoc.id, ...updatedDoc.data() });
      }

      setAdjustmentAmount('');
      setAdjustmentReason('');
      setSearchError('');
      alert('Adjustment added successfully!');
    } catch (error) {
      console.error('Error adding adjustment:', error);
      setSearchError('Failed to add adjustment: ' + error.message);
    } finally {
      setAddingAdjustment(false);
    }
  };

  // Calculate due amount
  const calculateDue = (config) => {
    if (!config) return 0;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let monthsPassed = ((currentYear - config.sessionYear) * 12) + 
                       (currentMonth - config.sessionStartMonth) + 1;
    if (monthsPassed < 0) monthsPassed = 0;
    
    const totalExpected = monthsPassed * config.monthlyFee;
    const due = totalExpected - (config.totalPaid || 0) - (config.totalDiscount || 0);
    return due < 0 ? 0 : due;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const dueAmount = studentData?.feeConfig ? calculateDue(studentData.feeConfig) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link 
            href="/admin/dashboard"
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Fee Management</h1>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Search size={24} />
            Search Student
          </h2>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchStudent()}
                placeholder={searchType === 'email' ? 'Enter student email' : 'Enter student UID'}
                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            >
              <option value="email">Email</option>
              <option value="uid">UID</option>
            </select>
            <button
              onClick={searchStudent}
              disabled={searching}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              Search
            </button>
          </div>

          {searchError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
              {searchError}
            </div>
          )}
        </div>

        {/* Student Info */}
        {studentData && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User size={24} />
              Student Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-semibold text-slate-800">{studentData.personal?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-semibold text-slate-800">{studentData.personal?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Class</p>
                <p className="font-semibold text-slate-800">
                  {studentData.feeConfig?.board || 'N/A'} - Class {studentData.feeConfig?.class || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Monthly Fee</p>
                <p className="font-semibold text-slate-800">
                  ₹{studentData.feeConfig?.monthlyFee || 0}
                </p>
              </div>
            </div>

            {/* Fee Status */}
            <div className={`p-4 rounded-lg mb-6 ${dueAmount > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Due Amount</p>
                  <p className={`text-2xl font-bold ${dueAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{dueAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Paid</p>
                  <p className="text-xl font-semibold text-slate-800">
                    ₹{studentData.feeConfig?.totalPaid || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Discount</p>
                  <p className="text-xl font-semibold text-slate-800">
                    ₹{studentData.feeConfig?.totalDiscount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Session</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {studentData.feeConfig?.sessionYear || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Collect Fee Section */}
            <div className="border-t border-slate-200 pt-6 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Collect Fee
              </h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className="flex-1 p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleCollectFee}
                  disabled={collectingFee || !feeAmount}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {collectingFee ? <Loader2 size={20} className="animate-spin" /> : <DollarSign size={20} />}
                  Collect Fee
                </button>
              </div>
            </div>

            {/* Add Adjustment Section */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PlusCircle size={20} />
                Add Adjustment
              </h3>
              <div className="space-y-4">
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="Enter adjustment amount"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Enter reason for adjustment"
                  className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddAdjustment}
                  disabled={addingAdjustment || !adjustmentAmount || !adjustmentReason}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingAdjustment ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                  Add Adjustment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


