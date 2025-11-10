'use client'

import { useEffect, useState } from 'react';

export default function AttendanceSystem() {
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Hardcoded batches (must match Code.gs map keys)
  const batches = {
    "Scifun Main Branch": ["4pm-6pm Batch 1", "6pm-8pm Batch 2"],
    "Scifun Branch 2": ["2pm-4pm Batch 1", "4pm-6pm Batch 2", "6pm-8pm Batch 3"]
  };

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQNT_xbT3yMuZ90wfvyMH88Wks-tY7zXCfkl8eUWi5mnBRIkafAhlmUiFEod4N7ZxxBg/exec";

  useEffect(() => {
    // Set today's date as default
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
    const selectedBranch = e.target.value;
    setBranch(selectedBranch);
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
    setStudents([]);

    try {
      const url = new URL(SCRIPT_URL);
      url.searchParams.append('action', 'getStudents');
      url.searchParams.append('branch', selectedBranch);
      url.searchParams.append('batch', selectedBatch);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      showStatus(`Error fetching students: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    setStatusMessage('');

    try {
      const formData = new FormData(e.target);
      formData.append('action', 'submitAttendance');

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.text();
      showStatus(result, result.includes('Error'));
    } catch (error) {
      console.error('Submission Error:', error);
      showStatus(`An error occurred. Could not save data. Details: ${error.message}`, true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Attendance';
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Scifun Attendance System</h1>
        <p className="text-gray-600 mb-8 text-center">Select the branch and batch to record attendance.</p>

        <form id="attendance-form" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Branch Selection */}
            <div>
              <label htmlFor="branch" className="block text-gray-700 text-sm font-bold mb-2">Branch</label>
              <select
                id="branch"
                name="branch"
                value={branch}
                onChange={handleBranchChange}
                required
                className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <option value="" disabled>Select Branch</option>
                <option value="Scifun Main Branch">Scifun Main Branch</option>
                <option value="Scifun Branch 2">Scifun Branch 2</option>
              </select>
            </div>

            {/* Batch Selection */}
            <div>
              <label htmlFor="batch" className="block text-gray-700 text-sm font-bold mb-2">Batch</label>
              <select
                id="batch"
                name="batch"
                value={batch}
                onChange={handleBatchChange}
                required
                disabled={!branch}
                className={`w-full px-4 py-3 text-gray-700 ${!branch ? 'bg-gray-200' : 'bg-gray-50'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300`}
              >
                <option value="" disabled>Select Branch First</option>
                {branch && batches[branch]?.map((batchOption) => (
                  <option key={batchOption} value={batchOption}>{batchOption}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student List Table */}
          {(branch && batch) && (
            <div id="student-list-container" className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Student List</h2>
                <div className="flex items-center space-x-2">
                  <label htmlFor="attendanceDate" className="text-sm font-medium text-gray-700">Date:</label>
                  <input
                    type="date"
                    id="attendanceDate"
                    name="attendanceDate"
                    required
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-20">
                  <div className="loader"></div>
                  <p className="mt-2 text-gray-600">Loading Students...</p>
                </div>
              ) : students.length > 0 ? (
                <table className="min-w-full bg-white border rounded-lg overflow-hidden">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Student Name</th>
                      <th className="text-center py-3 px-4 uppercase font-semibold text-sm w-48">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 border-b' : 'bg-white border-b'}>
                        <td className="py-3 px-4">{student}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <input type="hidden" name={`studentName_${index}`} value={student} />
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`status_${index}`}
                                value="Present"
                                defaultChecked
                                className="form-radio h-4 w-4 text-green-600"
                              />
                              <span className="text-sm text-green-700 font-medium">Present</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`status_${index}`}
                                value="Absent"
                                className="form-radio h-4 w-4 text-red-600"
                              />
                              <span className="text-sm text-red-700 font-medium">Absent</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`status_${index}`}
                                value="Late"
                                className="form-radio h-4 w-4 text-yellow-600"
                              />
                              <span className="text-sm text-yellow-700 font-medium">Late</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-4 text-gray-500">No students found for this batch.</p>
              )}

              {students.length > 0 && (
                <div className="mt-8">
                  <button
                    type="submit"
                    id="submit-button"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                  >
                    Submit Attendance
                  </button>
                </div>
              )}
            </div>
          )}

          {statusMessage && (
            <div className={`mt-4 text-center text-md font-medium p-3 rounded-lg border ${
              isError 
                ? 'text-red-600 bg-red-100 border-red-400' 
                : 'text-green-600 bg-green-100 border-green-400'
            }`}>
              {statusMessage}
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-radius: 50%;
          border-top: 4px solid #3498db;
          width: 24px;
          height: 24px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}