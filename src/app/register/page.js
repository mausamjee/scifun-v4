'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '../../firebaseConfig';
import { FEE_CHART, getFee, isValidBoardClass } from '../../utils/feeConstants';

import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

function RegisterForm() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Referral Validation States
  const [referralStatus, setReferralStatus] = useState('idle'); // idle, checking, valid, invalid
  const [referralMsg, setReferralMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    board: '',
    selectedClass: 'Class 1',
    schoolName: '',
    fatherContact: '',
    motherContact: '',
    address: '',
    rollNo: '',
    referralId: '' 
  });

  // Calculate displayed fee based on board and class
  const getDisplayedFee = () => {
    if (!formData.board || !formData.selectedClass) return null;
    const classNumber = formData.selectedClass.replace('Class ', '');
    return getFee(formData.board, classNumber);
  };

  const displayedFee = getDisplayedFee();

  // --- NEW: VERIFY REFERRAL CODE FUNCTION ---
  const verifyReferralCode = async (code) => {
    if (!code || code.length < 3) {
      setReferralStatus('idle');
      setReferralMsg('');
      return;
    }

    setReferralStatus('checking');
    try {
      // Query the 'users' collection where 'personal.referralCode' matches
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("personal.referralCode", "==", code));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const referrerData = querySnapshot.docs[0].data();
        setReferralStatus('valid');
        setReferralMsg(`✅ Verified: Referred by ${referrerData.personal.name}`);
      } else {
        setReferralStatus('invalid');
        setReferralMsg("❌ Invalid Referral Code");
      }
    } catch (err) {
      console.error("Referral check error:", err);
      setReferralStatus('invalid');
      setReferralMsg("⚠️ Error checking code");
    }
  };

  // Auto-fill and Verify from URL
  useEffect(() => {
    try {
      const refCode = searchParams?.get('ref');
      if (refCode) {
        setFormData(prev => ({ ...prev, referralId: refCode }));
        verifyReferralCode(refCode); // Auto-verify if from URL
      }
    } catch (err) {
      console.error("Error reading search params:", err);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Reset status when user starts typing again
    if (e.target.name === 'referralId') {
      setReferralStatus('idle');
      setReferralMsg('');
    }
  };

  const generateReferralCode = (name) => {
    const prefix = name ? name.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase() : "STUD";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Prevent registration if referral code is invalid (but allow if empty/optional)
    if (formData.referralId && referralStatus === 'invalid') {
      setError("Please fix the Invalid Referral Code or clear it.");
      return;
    }

    // Validate board selection
    if (!formData.board) {
      setError("Please select a board (Maharashtra or CBSE).");
      return;
    }

    // Extract class number and validate fee exists
    const classNumber = formData.selectedClass.replace('Class ', '');
    if (!isValidBoardClass(formData.board, classNumber)) {
      setError(`Fee not configured for ${formData.board} Board - Class ${classNumber}. Please contact admin.`);
      return;
    }

    const selectedFee = getFee(formData.board, classNumber);
    if (!selectedFee) {
      setError("Unable to determine fee. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.fullName });

      // Get current month and year for session tracking
      const startMonth = new Date().getMonth();
      const sessionYear = new Date().getFullYear();

      const newStudentProfile = {
        personal: {
          name: formData.fullName,
          email: formData.email,
          class: formData.selectedClass,
          schoolName: formData.schoolName,
          fatherContact: formData.fatherContact,
          motherContact: formData.motherContact,
          id: user.uid.slice(0, 8).toUpperCase(),
          dob: formData.dob,
          contact: formData.phone,
          address: formData.address,
          rollNo: formData.rollNo || "Pending",
          photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          referralCode: generateReferralCode(formData.fullName),
          points: 0
        },
        referralData: {
          referredBy: (referralStatus === 'valid' ? formData.referralId : null), 
          status: (referralStatus === 'valid' ? 'pending' : 'none'), 
          joinedAt: new Date().toISOString()
        },
        referrals: [],
        feeConfig: {
          board: formData.board,
          class: classNumber,
          monthlyFee: Number(selectedFee),
          sessionStartMonth: startMonth,
          sessionYear: sessionYear,
          totalPaid: 0,
          totalDiscount: 0
        },
        transactions: [],
        adjustments: [],
        attendance: { percentage: 0, attended: 0, total: 0 },
        cards: [
          { title: "Physics", score: "0/0", percent: 0, color: "text-blue-600", ring: "border-blue-600" },
          { title: "Chemistry", score: "0/0", percent: 0, color: "text-purple-600", ring: "border-purple-600" },
          { title: "Maths", score: "0/0", percent: 0, color: "text-cyan-500", ring: "border-cyan-500" },
          { title: "English", score: "0/0", percent: 0, color: "text-indigo-600", ring: "border-indigo-600" }
        ],
        timetable: [],
        announcements: [
          { title: "Welcome to SciFun!", time: "Just now", type: "General", color: "bg-blue-100 text-blue-600" }
        ],
        teachers: []
      };

      await setDoc(doc(db, "users", user.uid), newStudentProfile);

      // If referral code is valid, update the referrer's referrals array after creating the user
      if (referralStatus === 'valid' && formData.referralId) {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("personal.referralCode", "==", formData.referralId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const referrerId = querySnapshot.docs[0].id;
            // Add this user to referrer's referrals array
            await updateDoc(doc(db, "users", referrerId), {
              referrals: arrayUnion({
                uid: user.uid,
                studentName: formData.fullName,
                status: "pending",
                joinedAt: new Date().toISOString()
              })
            });
          }
        } catch (err) {
          console.error("Error updating referrer:", err);
          // Don't fail registration if referrer update fails
        }
      }

      setSuccess(true); 
      console.log("Registration Successful! Redirecting...");
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500); 

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else {
        setError('Failed to register: ' + err.message);
      }
      setLoading(false); 
    } 
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-blue-700">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join SciFun and start your journey 🚀</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 text-sm rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 text-sm rounded">Success! Redirecting...</div>}

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input name="fullName" type="text" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="John Doe" onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date of Birth</label>
              <input name="dob" type="date" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Student Phone</label>
              <input name="phone" type="tel" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="9876543210" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">School Name</label>
            <input name="schoolName" type="text" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="St. Xavier's High School" onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Board <span className="text-red-500">*</span></label>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="board" 
                  value="Maharashtra" 
                  checked={formData.board === "Maharashtra"} 
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                  required 
                />
                <span className="ml-2 text-gray-700">Maharashtra</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="board" 
                  value="CBSE" 
                  checked={formData.board === "CBSE"} 
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                  required 
                />
                <span className="ml-2 text-gray-700">CBSE</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Class / Standard</label>
            <select name="selectedClass" className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none bg-white" onChange={handleChange} value={formData.selectedClass}>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
              ))}
            </select>
          </div>

          {formData.board && displayedFee !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Monthly Fee:</span>
                <span className="text-lg font-bold text-blue-700">₹{displayedFee}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {formData.board} Board - {formData.selectedClass}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Father's Contact</label>
              <input name="fatherContact" type="tel" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="Father's No." onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Mother's Contact</label>
              <input name="motherContact" type="tel" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="Mother's No." onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input name="address" type="text" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="City, Country" onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input name="email" type="email" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="you@example.com" onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none" placeholder="••••••••" onChange={handleChange} />
          </div>

          {/* REFERRAL ID SECTION */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-bold text-indigo-600">Referral ID (Optional)</label>
              {/* Alert / Status Message Displayed HERE above the box */}
              {referralMsg && (
                <span className={`text-xs font-bold ${referralStatus === 'valid' ? 'text-green-600' : 'text-red-600'}`}>
                  {referralMsg}
                </span>
              )}
            </div>
            
            <div className="mt-1 relative">
              <input 
                name="referralId" 
                type="text" 
                className={`w-full p-3 border rounded-lg outline-none transition-colors 
                  ${referralStatus === 'valid' ? 'bg-green-50 border-green-400 text-green-800' : ''}
                  ${referralStatus === 'invalid' ? 'bg-red-50 border-red-400 text-red-800' : ''}
                  ${referralStatus === 'idle' ? 'border-gray-300' : ''}
                `}
                placeholder="Ex: VAN123"
                value={formData.referralId}
                onChange={handleChange}
                onBlur={(e) => verifyReferralCode(e.target.value)} // Validate on Leave
              />
              {referralStatus === 'checking' && (
                <span className="absolute right-3 top-3.5 text-xs text-gray-400 animate-pulse">Checking...</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-bold transition disabled:bg-blue-300 ${success ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {success ? 'Success! Redirecting...' : (loading ? 'Creating Profile...' : 'Register Now')}
          </button>
        </form>

        <div className="text-center mt-4">
           <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}