"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-600 text-xl font-semibold">Loading Profile...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Dashboard</h1>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 h-32 w-full relative"></div>

          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <img
                src={user?.photoURL || 'https://ui-avatars.com/api/?name=Student&background=random'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white object-cover"
              />

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium border border-red-200 hover:bg-red-100 transition"
              >
                Sign Out
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.displayName || 'SciFun Student'}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-bold">User ID</p>
                  <p className="text-sm text-gray-700 font-mono mt-1 break-all">{user?.uid}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-bold">Account Created</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
