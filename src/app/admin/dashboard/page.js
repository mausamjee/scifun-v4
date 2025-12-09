'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';
import { checkAdminRole } from '../../../utils/adminAuth';
import { 
  Users, 
  Gift, 
  CheckCircle, 
  Clock, 
  LogOut,
  Menu,
  X,
  BarChart3,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-indigo-50 text-indigo-600"
          >
            <BarChart3 size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/referrals"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
          >
            <Gift size={20} />
            <span className="font-medium">Referrals</span>
          </Link>
          
          <Link 
            href="/admin/fees"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
          >
            <DollarSign size={20} />
            <span className="font-medium">Fee Management</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
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
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-semibold text-slate-800">{user?.email}</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Referrals</p>
                  <p className="text-3xl font-bold text-slate-800">-</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users size={24} className="text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">-</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-600">-</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/admin/referrals"
                className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Gift size={24} className="text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Manage Referrals</h3>
                    <p className="text-sm text-slate-500">Approve or reject pending referrals</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/admin/fees"
                className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <DollarSign size={24} className="text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Fee Management</h3>
                    <p className="text-sm text-slate-500">Collect fees and manage adjustments</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



