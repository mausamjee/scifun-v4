'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  runTransaction,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { checkAdminRole } from '../../../utils/adminAuth';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Gift
} from 'lucide-react';
import Link from 'next/link';

export default function AdminReferrals() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

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
      await fetchAllReferrals();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAllReferrals = async () => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const allReferrals = [];
      const statsData = { total: 0, pending: 0, approved: 0, rejected: 0 };

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const referralsList = userData.referrals || [];
        
        for (const referral of referralsList) {
          // Get referred student data
          const referredStudentDoc = await getDoc(doc(db, 'users', referral.uid));
          const referredStudentData = referredStudentDoc.exists() ? referredStudentDoc.data() : null;

          allReferrals.push({
            id: `${userDoc.id}_${referral.uid}`,
            referrerUid: userDoc.id,
            referrerName: userData.personal?.name || 'Unknown',
            referrerCode: userData.personal?.referralCode || 'N/A',
            referredUid: referral.uid,
            referredName: referral.studentName || referredStudentData?.personal?.name || 'Unknown',
            status: referral.status,
            joinedAt: referral.joinedAt,
            approvedAt: referral.approvedAt,
            rejectedAt: referral.rejectedAt
          });

          statsData.total++;
          if (referral.status === 'pending') statsData.pending++;
          else if (referral.status === 'approved') statsData.approved++;
          else if (referral.status === 'rejected') statsData.rejected++;
        }
      }

      // Sort by joined date (newest first)
      allReferrals.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));

      setReferrals(allReferrals);
      setFilteredReferrals(allReferrals);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  useEffect(() => {
    let filtered = referrals;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.referredName.toLowerCase().includes(query) ||
        r.referrerName.toLowerCase().includes(query) ||
        r.referrerCode.toLowerCase().includes(query)
      );
    }

    setFilteredReferrals(filtered);
  }, [statusFilter, searchQuery, referrals]);

  const handleApprove = async (referral) => {
    setProcessing({ ...processing, [referral.id]: 'approving' });

    try {
      // Get referrer document
      const referrerRef = doc(db, 'users', referral.referrerUid);
      const referrerDoc = await getDoc(referrerRef);
      
      if (!referrerDoc.exists()) {
        throw new Error('Referrer not found');
      }

      const referrerData = referrerDoc.data();
      const referrals = [...(referrerData.referrals || [])];

      // Find and update the specific referral
      const referralIndex = referrals.findIndex(r => r.uid === referral.referredUid);
      
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
      await updateDoc(referrerRef, {
        referrals: referrals,
        'personal.points': newPoints
      });

      // Update referred student document
      const referredRef = doc(db, 'users', referral.referredUid);
      const referredDoc = await getDoc(referredRef);
      
      if (referredDoc.exists()) {
        await updateDoc(referredRef, {
          'referralData.status': 'approved'
        });
      }

      // Refresh the referrals list
      await fetchAllReferrals();
      alert('Referral approved successfully!');
    } catch (error) {
      console.error('Error approving referral:', error);
      const errorMessage = error.code === 'permission-denied' 
        ? 'Permission denied. Please check Firestore security rules allow admins to update users.'
        : error.message || 'Failed to approve referral';
      alert(errorMessage);
    } finally {
      setProcessing({ ...processing, [referral.id]: null });
    }
  };

  const handleReject = async (referral) => {
    if (!confirm('Are you sure you want to reject this referral?')) {
      return;
    }

    setProcessing({ ...processing, [referral.id]: 'rejecting' });

    try {
      // Get referrer document
      const referrerRef = doc(db, 'users', referral.referrerUid);
      const referrerDoc = await getDoc(referrerRef);
      
      if (!referrerDoc.exists()) {
        throw new Error('Referrer not found');
      }

      const referrerData = referrerDoc.data();
      const referrals = [...(referrerData.referrals || [])];

      // Find and update the specific referral
      const referralIndex = referrals.findIndex(r => r.uid === referral.referredUid);
      
      if (referralIndex === -1) {
        throw new Error('Referral not found');
      }

      if (referrals[referralIndex].status === 'rejected') {
        throw new Error('Referral already rejected');
      }

      // Update referral status
      referrals[referralIndex] = {
        ...referrals[referralIndex],
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      };

      // Recalculate points (only approved referrals count)
      const approvedCount = referrals.filter(r => r.status === 'approved').length;
      const newPoints = approvedCount * 100;

      // Update referrer document
      await updateDoc(referrerRef, {
        referrals: referrals,
        'personal.points': newPoints
      });

      // Update referred student document
      const referredRef = doc(db, 'users', referral.referredUid);
      const referredDoc = await getDoc(referredRef);
      
      if (referredDoc.exists()) {
        await updateDoc(referredRef, {
          'referralData.status': 'rejected'
        });
      }

      // Refresh the referrals list
      await fetchAllReferrals();
      alert('Referral rejected successfully!');
    } catch (error) {
      console.error('Error rejecting referral:', error);
      const errorMessage = error.code === 'permission-denied' 
        ? 'Permission denied. Please check Firestore security rules allow admins to update users.'
        : error.message || 'Failed to reject referral';
      alert(errorMessage);
    } finally {
      setProcessing({ ...processing, [referral.id]: null });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </span>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-2 text-slate-500"
          >
            <X size={20}/>
          </button>
        </div>
        
        <nav className="px-4 space-y-2 mt-4">
          <Link 
            href="/admin/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/referrals"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-indigo-50 text-indigo-600"
          >
            <Gift size={20} />
            <span className="font-medium">Referrals</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Referral Management</h1>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or referral code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === 'pending' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('approved')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === 'approved' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === 'rejected' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>

          {/* Referrals List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Referred Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Referral Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredReferrals.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                        No referrals found
                      </td>
                    </tr>
                  ) : (
                    filteredReferrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {referral.referredName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{referral.referrerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {referral.referrerCode}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(referral.status)}`}>
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(referral.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {referral.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(referral)}
                                disabled={processing[referral.id]}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50 flex items-center gap-1"
                              >
                                <CheckCircle size={18} />
                                {processing[referral.id] === 'approving' ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleReject(referral)}
                                disabled={processing[referral.id]}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50 flex items-center gap-1"
                              >
                                <XCircle size={18} />
                                {processing[referral.id] === 'rejecting' ? 'Processing...' : 'Reject'}
                              </button>
                            </div>
                          )}
                          {referral.status === 'approved' && (
                            <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle size={18} />
                              Approved
                            </span>
                          )}
                          {referral.status === 'rejected' && (
                            <span className="text-red-600 flex items-center gap-1">
                              <XCircle size={18} />
                              Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

