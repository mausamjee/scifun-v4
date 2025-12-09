/**
 * UPDATED DASHBOARD FOR SCIFUN
 * Features:
 * 1. Automatic Referral Code Generation
 * 2. Referral Redemption System (Input Code)
 * 3. Points Display based on 'approved' referrals
 * 4. Existing Bento Grid (Attendance, Timetable, etc.)
 */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Users, 
  Copy, 
  CheckCircle,
  Gift,
  DollarSign,
  Download
} from "lucide-react";
// Adjust this import path if your structure is different (e.g. "@/firebaseConfig")
import { app } from "../../firebaseConfig"; 

const auth = getAuth(app);
const db = getFirestore(app);

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Referral State
  const [inviteCode, setInviteCode] = useState("");
  const [redeemStatus, setRedeemStatus] = useState("idle"); // idle, loading, success, error
  const [statusMsg, setStatusMsg] = useState("");

  const router = useRouter();

  // 1. Auth & Data Fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);
      await fetchStudentData(currentUser.uid);
    });

    return () => unsubscribe();
  }, [router]);

  // 2. Fetch Data with "Safety" and "Auto-Fixes"
  const fetchStudentData = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // AUTO-FIX: Generate Referral Code if missing
        if (!data.personal?.referralCode) {
          const newCode = generateReferralCode(data.personal?.name || "Student");
          await updateDoc(docRef, {
            "personal.referralCode": newCode,
            "referrals": data.referrals || [] 
          });
          // Update local state immediately
          if (!data.personal) data.personal = {};
          data.personal.referralCode = newCode;
        }

        setStudentData(data);
      } else {
        setStudentData(null); // Triggers "Generate Dashboard" UI
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Helper: Generate Simple Code (Name + Random 4 digits)
  const generateReferralCode = (name) => {
    const prefix = name ? name.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase() : "STUD";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  };

  // 4. Seeder: Initialize Empty Dashboard
  const initializeDashboard = async () => {
    if (!user) return;
    setLoading(true);

    const dummyData = {
      personal: {
        name: user.displayName || "Student",
        email: user.email,
        class: "Class 11-A",
        rollNo: "Pending",
        photo: user.photoURL || "",
        referralCode: generateReferralCode(user.displayName || "User"),
        points: 0
      },
      attendance: { percentage: 0, attended: 0, total: 0 },
      cards: [
        { title: "Physics", score: "0/0", percent: 0, color: "text-blue-600", ring: "border-blue-600" },
        { title: "Chemistry", score: "0/0", percent: 0, color: "text-green-600", ring: "border-green-600" },
        { title: "Maths", score: "0/0", percent: 0, color: "text-purple-600", ring: "border-purple-600" }
      ],
      timetable: [],
      announcements: [
        { title: "Welcome to SciFun!", time: "Just now", type: "General", color: "bg-blue-100 text-blue-800" }
      ],
      teachers: [],
      referrals: [], // List of people I referred
      referralData: {
        referredBy: null, // Who referred me (referral code)
        status: 'none',
        joinedAt: new Date().toISOString()
      }
    };

    try {
      await setDoc(doc(db, "users", user.uid), dummyData);
      setStudentData(dummyData);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Action: Redeem a Referral Code
  const handleRedeemReferral = async () => {
    if (!inviteCode || inviteCode.length < 5) {
      setStatusMsg("Please enter a valid code.");
      return;
    }
    if (studentData?.referralData?.referredBy) {
      setStatusMsg("You have already used a referral code.");
      return;
    }
    if (studentData?.personal?.referralCode && inviteCode === studentData.personal.referralCode) {
      setStatusMsg("You cannot refer yourself!");
      return;
    }

    setRedeemStatus("loading");
    
    try {
      // Find the Referrer
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("personal.referralCode", "==", inviteCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setRedeemStatus("error");
        setStatusMsg("Invalid Referral Code.");
        return;
      }

      // There should only be one match
      let referrerDoc = querySnapshot.docs[0];
      const referrerId = referrerDoc.id;
      const referrerData = referrerDoc.data();

      const selfName = studentData?.personal?.name || "Student";

      // Update Referrer: Add me to their list (Status: Pending)
      await updateDoc(doc(db, "users", referrerId), {
        referrals: arrayUnion({
          uid: user.uid,
          studentName: selfName,
          status: "pending", // Waiting for Admin to approve
          joinedAt: new Date().toISOString()
        })
      });

      // Update Me: Mark as referred
      await updateDoc(doc(db, "users", user.uid), {
        'referralData.referredBy': inviteCode,
        'referralData.status': 'pending',
        'referralData.joinedAt': new Date().toISOString()
      });

      // Update Local State
      setStudentData(prev => ({ 
        ...prev, 
        referralData: {
          referredBy: inviteCode,
          status: 'pending',
          joinedAt: new Date().toISOString()
        }
      }));
      setRedeemStatus("success");
      setStatusMsg(`Success! Referred by ${referrerData.personal.name}.`);

    } catch (err) {
      console.error(err);
      setRedeemStatus("error");
      setStatusMsg("Something went wrong. Try again.");
    }
  };

  // 6. Calculate Points (100 pts per APPROVED referral)
  const calculatePoints = () => {
    if (!studentData?.referrals) return 0;
    const approved = studentData.referrals.filter(r => r.status === "approved");
    return approved.length * 100;
  };

  // 7. Generate Referral Link
  const generateReferralLink = (code) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/register?ref=${code}`;
    }
    return '';
  };

  // 8. Get Referral Statistics
  const getReferralStats = () => {
    if (!studentData?.referrals) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
    return {
      total: studentData.referrals.length,
      pending: studentData.referrals.filter(r => r.status === 'pending').length,
      approved: studentData.referrals.filter(r => r.status === 'approved').length,
      rejected: studentData.referrals.filter(r => r.status === 'rejected').length
    };
  };

  // 9. Calculate Due Amount
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
    return due < 0 ? 0 : due; // Prevent negative due (advance payment)
  };

  // --- RENDERING ---

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!studentData) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Welcome to SciFun!</h1>
      <p className="text-slate-600 mb-8">Let's set up your student profile.</p>
      <button 
        onClick={initializeDashboard}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
      >
        Generate My Dashboard
      </button>
    </div>
  );

  const points = calculatePoints();
  const referralCode = studentData.personal?.referralCode || "---";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar - Mobile Responsive */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SciFun.</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-500"><X size={20}/></button>
        </div>
        
        <nav className="px-4 space-y-2 mt-4">
          <NavItem icon={<BookOpen size={20}/>} label="Dashboard" active />
          <NavItem icon={<Calendar size={20}/>} label="Timetable" />
          <NavItem icon={<Gift size={20}/>} label="Referrals" />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button onClick={() => signOut(auth)} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Student Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-semibold text-slate-800">{studentData.personal.name}</span>
              <span className="text-xs text-slate-500">{studentData.personal.class}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
              {studentData.personal.photo ? (
                <img src={studentData.personal.photo} alt="Profile" className="h-full w-full rounded-full object-cover"/>
              ) : (
                <User size={20} className="text-indigo-600" />
              )}
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto space-y-6">
          
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* 1. Welcome & Attendance (Spans 2 cols) */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Hello, {studentData.personal.name.split(' ')[0]}! 👋</h2>
                <p className="text-slate-500">You have {studentData.timetable?.length || 0} lectures scheduled today.</p>
              </div>
              <div className="mt-6 flex items-end gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">Attendance</span>
                    <span className="font-bold text-indigo-600">{studentData.attendance?.percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${studentData.attendance?.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {studentData.attendance?.attended}/{studentData.attendance?.total} Lectures attended
                  </p>
                </div>
              </div>
            </div>

            {/* 2. REFERRAL SYSTEM CARD (New Feature) */}
            <div className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 text-white/20" size={40} />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Gift size={18} /> Refer & Earn
                    </h3>
                    <p className="text-indigo-100 text-sm">Earn 100 points per confirmed friend!</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider opacity-70">Total Points</span>
                    <div className="text-3xl font-bold">{points}</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 mb-4">
                  <span className="text-xs text-indigo-100 block mb-1">Your Referral Code</span>
                  <div className="flex justify-between items-center">
                    <code className="text-xl font-mono font-bold tracking-wide">{referralCode}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(referralCode)}
                      className="p-1.5 hover:bg-white/20 rounded-md transition"
                      title="Copy Code"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Redeem Section */}
                {!studentData.referralData?.referredBy ? (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-indigo-100">Have a code from a friend?</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter Code" 
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm placeholder:text-indigo-300 focus:outline-none focus:bg-white/20"
                      />
                      <button 
                        onClick={handleRedeemReferral}
                        disabled={redeemStatus === 'loading'}
                        className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition disabled:opacity-50"
                      >
                        {redeemStatus === 'loading' ? '...' : 'Join'}
                      </button>
                    </div>
                    {statusMsg && <p className="text-xs font-medium bg-black/20 inline-block px-2 py-1 rounded">{statusMsg}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-green-500/20 px-3 py-2 rounded-lg border border-green-500/30">
                    <CheckCircle size={16} className="text-green-300" />
                    <span className="text-sm font-medium">Referral Linked</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Subject Progress Cards */}
            {studentData.cards?.map((card, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
                <div className={`text-3xl font-bold ${card.color} mb-1`}>{card.percent}%</div>
                <div className="text-sm text-slate-500 font-medium">{card.title}</div>
                <div className="text-xs text-slate-400 mt-1">Score: {card.score}</div>
                {/* Simple SVG Ring visualizer */}
                <svg className="absolute w-full h-full inset-0 pointer-events-none opacity-10">
                  <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8" fill="none" className={card.color} />
                </svg>
              </div>
            ))}

            {/* 4. Announcements */}
            <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={18} /> Latest Announcements
              </h3>
              <div className="space-y-3">
                {studentData.announcements?.map((ann, i) => (
                  <div key={i} className={`p-4 rounded-xl flex justify-between items-center ${ann.color ? ann.color.replace('text-', 'bg-').replace('600', '50') : 'bg-slate-50'}`}>
                    <div>
                      <h4 className="font-semibold text-slate-800">{ann.title}</h4>
                      <span className="text-xs text-slate-500">{ann.type} • {ann.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Teacher Status */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users size={18} /> Staff Status
              </h3>
              <div className="space-y-4">
                {studentData.teachers?.map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-full overflow-hidden">
                      {t.photo && <img src={t.photo} alt={t.name} className="h-full w-full object-cover"/>}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">{t.name}</div>
                      <div className={`text-xs px-2 py-0.5 rounded-full w-fit ${t.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Fee Status Section */}
          {studentData.feeConfig && (
            <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${
              calculateDue(studentData.feeConfig) > 0 
                ? 'border-red-200 bg-red-50' 
                : 'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <DollarSign size={24} />
                  Fee Status
                </h3>
                <div className={`px-4 py-2 rounded-lg font-bold ${
                  calculateDue(studentData.feeConfig) > 0 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {calculateDue(studentData.feeConfig) > 0 ? 'Payment Due' : 'All Paid'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Due Amount</p>
                  <p className={`text-2xl font-bold ${
                    calculateDue(studentData.feeConfig) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    ₹{calculateDue(studentData.feeConfig)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Monthly Fee</p>
                  <p className="text-xl font-semibold text-slate-800">
                    ₹{studentData.feeConfig.monthlyFee || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Paid</p>
                  <p className="text-xl font-semibold text-slate-800">
                    ₹{studentData.feeConfig.totalPaid || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Discount</p>
                  <p className="text-xl font-semibold text-slate-800">
                    ₹{studentData.feeConfig.totalDiscount || 0}
                  </p>
                </div>
              </div>

              {studentData.feeConfig.board && (
                <div className="text-sm text-slate-600 mb-4">
                  <span className="font-medium">Board:</span> {studentData.feeConfig.board} | 
                  <span className="font-medium ml-2">Class:</span> {studentData.feeConfig.class} | 
                  <span className="font-medium ml-2">Session:</span> {studentData.feeConfig.sessionYear}
                </div>
              )}

              {/* Transactions List */}
              {studentData.transactions && studentData.transactions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-4">Payment History</h4>
                  <div className="space-y-3">
                    {[...studentData.transactions]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((transaction, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">
                                  ₹{transaction.amount?.toLocaleString('en-IN') || 0}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {new Date(transaction.date).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                  {transaction.transactionId && (
                                    <span className="ml-2">• {transaction.transactionId}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          {transaction.receiptLink && (
                            <a
                              href={transaction.receiptLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                              <Download size={16} />
                              Download Receipt
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Referral Tracking Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Gift size={24} /> Referral Tracking
              </h3>
              <button
                onClick={() => {
                  const link = generateReferralLink(referralCode);
                  navigator.clipboard.writeText(link);
                  setStatusMsg('Referral link copied!');
                  setTimeout(() => setStatusMsg(''), 3000);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Copy size={16} />
                Copy Referral Link
              </button>
            </div>

            {/* Statistics */}
            {(() => {
              const stats = getReferralStats();
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-500 mb-1">Total Referrals</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-slate-500 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-500 mb-1">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <p className="text-sm text-slate-500 mb-1">Points Earned</p>
                    <p className="text-2xl font-bold text-indigo-600">{points}</p>
                  </div>
                </div>
              );
            })()}

            {/* Referrals List */}
            {studentData.referrals && studentData.referrals.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 mb-3">Your Referrals</h4>
                <div className="divide-y divide-slate-200">
                  {studentData.referrals.map((referral, idx) => {
                    const getStatusBadge = (status) => {
                      const badges = {
                        pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                        approved: 'bg-green-100 text-green-800 border-green-300',
                        rejected: 'bg-red-100 text-red-800 border-red-300'
                      };
                      return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
                    };

                    return (
                      <div key={idx} className="py-4 flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User size={20} className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{referral.studentName}</p>
                              <p className="text-sm text-slate-500">
                                Joined: {new Date(referral.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(referral.status)}`}>
                            {referral.status}
                          </span>
                          {referral.status === 'approved' && (
                            <span className="text-sm font-medium text-green-600">+100 pts</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Gift size={48} className="mx-auto mb-3 text-slate-300" />
                <p className="font-medium">No referrals yet</p>
                <p className="text-sm mt-1">Share your referral code to start earning points!</p>
              </div>
            )}

            {/* Referral Link Display */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Your Referral Link:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-indigo-200 text-slate-700 break-all">
                  {generateReferralLink(referralCode)}
                </code>
                <button
                  onClick={() => {
                    const link = generateReferralLink(referralCode);
                    navigator.clipboard.writeText(link);
                    setStatusMsg('Link copied!');
                    setTimeout(() => setStatusMsg(''), 2000);
                  }}
                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple Nav Item Component
function NavItem({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}