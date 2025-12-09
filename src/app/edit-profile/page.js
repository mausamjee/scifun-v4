"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebaseConfig'; // Adjusted path to src/app/firebaseConfig
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    dob: '',
    contact: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. Fetch current data from Firebase
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // 2. Fill the form with existing (dummy) data
          setFormData({
            name: data.personal?.name || '',
            course: data.personal?.course || '',
            dob: data.personal?.dob || '',
            contact: data.personal?.contact || '',
            email: data.personal?.email || user.email,
            address: data.personal?.address || ''
          });
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 3. Update ONLY the "personal" section in Firestore
      // We use dot notation "personal.field" to update nested fields
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        "personal.name": formData.name,
        "personal.course": formData.course,
        "personal.dob": formData.dob,
        "personal.contact": formData.contact,
        "personal.address": formData.address
      });

      alert("Profile Updated Successfully!");
      router.push('/dashboard'); // Go back to dashboard
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <select name="course" value={formData.course} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
              <option value="B.Tech Computer Science">B.Tech Computer Science</option>
              <option value="B.Tech IT">B.Tech IT</option>
              <option value="12th Science">12th Science</option>
              <option value="10th Standard">10th Standard</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="29-Feb-2008" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mt-4">
            Save Changes
          </button>
        </form>

        <button onClick={() => router.push('/dashboard')} className="w-full text-center text-gray-500 text-sm mt-4 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
}
