'use client'

import { useEffect, useState } from 'react';

export default function AttendanceSystem() {
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const batches = {
    "Scifun Main Branch": ["4pm-6pm Batch 1", "6pm-8pm Batch 2"],
    "Scifun Branch 2": ["2pm-4pm Batch 1", "4pm-6pm Batch 2", "6pm-8pm Batch 3"]
  };

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbym_0NCqUcwVyvySejm14swr5WuuO5UAxpmDtVUVopWHId1NwPoH0-1qSwDMdiNJsn1vg/exec"; // Ensure this is your current URL

  useEffect(() => {
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
      dateInput.valueAsDate = new Date();
    }
  }, []);

  const showStatus = (message, error = false) => {
    setStatusMessage(message);
    setIsError(error);
    if (!error) {
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setBatch('');
    setStudents([]);
    setStatusMessage('');
  };

  const handleBatchChange = async (e) => {
    const selectedBatch = e.target.value;
    setBatch(selectedBatch);
    if (branch && selectedBatch) {
      await fetchStudents(branch, selectedBatch);
    }
  };

  const fetchStudents = async (selectedBranch, selectedBatch) => {
    setLoading(true);
    try {
      const url = new URL(SCRIPT_URL);
      url.searchParams.append('action', 'getStudents');
      url.searchParams.append('branch', selectedBranch);
      url.searchParams.append('batch', selectedBatch);

      const response = await fetch(url);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setStudents(data.students || []);
    } catch (error) {
      showStatus(`Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';

    try {
      const formData = new FormData(e.target);
      formData.append('action', 'submitAttendance');

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      const result = await response.text();
      showStatus(result, result.includes('Error'));
    } catch (error) {
      showStatus(`Error: ${error.message}`, true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Attendance';
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Scifun Attendance & HW Tracker</h1>
        <p className="text-gray-600 mb-8 text-center">Track student presence and homework completion.</p>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Branch</label>
              <select name="branch" value={branch} onChange={handleBranchChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                <option value="" disabled>Select Branch</option>
                <option value="Scifun Main Branch">Scifun Main Branch</option>
                <option value="Scifun Branch 2">Scifun Branch 2</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Batch</label>
              <select name="batch" value={batch} onChange={handleBatchChange} required disabled={!branch} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                <option value="" disabled>Select Batch</option>
                {branch && batches[branch]?.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {branch && batch && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Student List</h2>
                <input type="date" id="attendanceDate" name="attendanceDate" required className="px-3 py-1 border border-gray-300 rounded-lg" />
              </div>

              {loading ? (
                <div className="text-center py-10"><div className="loader mx-auto"></div></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Student Name</th>
                        <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Attendance & HW Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{student}</td>
                          <td className="py-3 px-4">
                            <input type="hidden" name={`studentName_${index}`} value={student} />
                            <div className="flex flex-wrap justify-center gap-4">
                              {/* Absent Option */}
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="radio" name={`status_${index}`} value="Absent" className="text-red-600" />
                                <span className="text-xs font-bold text-red-600 uppercase">Absent</span>
                              </label>

                              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

                              {/* HW Done Option */}
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="radio" name={`status_${index}`} value="HW Done" defaultChecked className="text-green-600" />
                                <span className="text-xs font-bold text-green-700 uppercase">HW Done</span>
                              </label>

                              {/* HW Partial Option */}
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="radio" name={`status_${index}`} value="HW Partial" className="text-yellow-600" />
                                <span className="text-xs font-bold text-yellow-700 uppercase">HW Partial</span>
                              </label>

                              {/* HW Not Done Option */}
                              <label className="flex items-center space-x-1 cursor-pointer">
                                <input type="radio" name={`status_${index}`} value="HW Not Done" className="text-orange-600" />
                                <span className="text-xs font-bold text-orange-700 uppercase">HW Not Done</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button type="submit" id="submit-button" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                Submit Attendance
              </button>
            </div>
          )}

          {statusMessage && (
            <div className={`mt-4 text-center p-3 rounded-lg border ${isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {statusMessage}
            </div>
          )}
        </form>
      </div>
      <style jsx>{` .loader { border: 4px solid #f3f3f3; border-radius: 50%; border-top: 4px solid #3498db; width: 24px; height: 24px; animation: spin 2s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } `}</style>
    </div>
  );
}