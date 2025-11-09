'use client'

import { useState } from 'react';

export default function StudentRegistration() {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [fatherNumber, setFatherNumber] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherNumber, setMotherNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setStatus('Please select a photo to upload.');
      return;
    }

    setIsSubmitting(true);
    setStatus('Uploading photo and submitting... Please wait.');

    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      const fileData = {
        base64,
        mimeType: photo.type,
        fileName: photo.name,
      };

      const formData = {
        studentName,
        studentClass,
        email,
        whatsapp,
        schoolName,
        board,
        fatherName,
        fatherNumber,
        motherName,
        motherNumber,
      };

      try {
        const response = await fetch('/api/student-registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formData, fileData }),
        });

        const result = await response.json();

        if (response.ok) {
          setStatus(result.message || 'Submission successful!');
          // Reset form
          setStudentName('');
          setStudentClass('');
          setEmail('');
          setWhatsapp('');
          setSchoolName('');
          setBoard('');
          setFatherName('');
          setFatherNumber('');
          setMotherName('');
          setMotherNumber('');
          setPhoto(null);
          // Clear file input
          document.getElementById('photo').value = '';
        } else {
          setStatus(`Error: ${result.message || 'An unknown error occurred.'}`);
        }
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Student Information</h2>
          
          <form id="student-form" onSubmit={handleSubmit}>
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">🧍 Student Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-600 mb-1">Student Name</label>
                  <input type="text" id="studentName" name="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="studentClass" className="block text-sm font-medium text-gray-600 mb-1">Class</label>
                  <select id="studentClass" name="studentClass" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select Class...</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email ID</label>
                  <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-600 mb-1">WhatsApp No.</label>
                  <input type="tel" id="whatsapp" name="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-600 mb-1">School Name</label>
                  <input type="text" id="schoolName" name="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Board</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center"><input type="radio" name="board" value="Maharashtra" checked={board === "Maharashtra"} onChange={(e) => setBoard(e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" required /><span className="ml-2 text-gray-700">Maharashtra</span></label>
                    <label className="flex items-center"><input type="radio" name="board" value="CBSE" checked={board === "CBSE"} onChange={(e) => setBoard(e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" /><span className="ml-2 text-gray-700">CBSE</span></label>
                    <label className="flex items-center"><input type="radio" name="board" value="Both" checked={board === "Both"} onChange={(e) => setBoard(e.target.value)} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" /><span className="ml-2 text-gray-700">Both</span></label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">👨‍👩‍👧 Parent Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fatherName" className="block text-sm font-medium text-gray-600 mb-1">Father's Name</label>
                  <input type="text" id="fatherName" name="fatherName" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="fatherNumber" className="block text-sm font-medium text-gray-600 mb-1">Father's Number</label>
                  <input type="tel" id="fatherNumber" name="fatherNumber" value={fatherNumber} onChange={(e) => setFatherNumber(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="motherName" className="block text-sm font-medium text-gray-600 mb-1">Mother's Name</label>
                  <input type="text" id="motherName" name="motherName" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="motherNumber" className="block text-sm font-medium text-gray-600 mb-1">Mother's Number</label>
                  <input type="tel" id="motherNumber" name="motherNumber" value={motherNumber} onChange={(e) => setMotherNumber(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">📷 Photo Upload</h3>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-600 mb-1">Student Photo</label>
                <input type="file" id="photo" name="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
                <p className="text-xs text-gray-500 mt-1">This will open your camera on mobile.</p>
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" id="submit-button" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300">
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
            
            {status && (
              <div id="status" className={`mt-4 text-center p-3 rounded-md ${status.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}