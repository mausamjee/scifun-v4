'use client'

import { useEffect, useState } from 'react';

export default function MarkEntrySystem() {
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // New State for Marks
  const [testName, setTestName] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [studentMarks, setStudentMarks] = useState({}); // { studentIndex: "45" }
  const [studentTotalMarks, setStudentTotalMarks] = useState({}); // { studentIndex: "50" }

  const batches = {
    "Scifun Main Branch": ["4pm-6pm Batch 1", "6pm-8pm Batch 2"],
    "Scifun Branch 2": ["2pm-4pm Batch 1", "4pm-6pm Batch 2", "6pm-8pm Batch 3"]
  };

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFtPhYiLPYBWTSmcz3W7zc97f0ZT2p59UL21VHFpS0GljB9IuVnixYh0_p7iAdfRWeHg/exec";

  useEffect(() => {
    const dateInput = document.getElementById('testDate');
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
    setStudentMarks({});
    setStudentTotalMarks({});
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
      setStudentMarks({}); // Reset marks when batch changes
      setStudentTotalMarks({});
    } catch (error) {
      showStatus(`Error: ${error.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (index, value) => {
    // Determine the max marks: either the specific override for this student OR the global total
    const maxMarks = studentTotalMarks[index] || totalMarks;

    // Validate: Don't allow marks > Total Marks
    if (maxMarks && Number(value) > Number(maxMarks)) {
      alert(`Marks cannot be greater than Total Marks for this student (${maxMarks})`);
      return;
    }
    setStudentMarks(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleTotalMarkChange = (index, value) => {
    setStudentTotalMarks(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!testName || !totalMarks) {
      showStatus("Please enter Test Name and Total Marks", true);
      return;
    }

    const testDate = document.getElementById('testDate').value;
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Saving Marks...';

    try {
      const formData = new FormData();
      formData.append('action', 'submitMarks');
      formData.append('batch', batch);
      formData.append('date', testDate);
      formData.append('testName', testName);
      formData.append('totalMarks', totalMarks);

      // Append students who have marks
      students.forEach((student, index) => {
        const name = typeof student === 'string' ? student : student.name;
        const marks = studentMarks[index];
        const individualTotal = studentTotalMarks[index] || totalMarks;
        
        // Only verify validity if a mark is entered
        if (marks !== undefined && marks !== "") {
            formData.append(`studentName_${index}`, name);
            formData.append(`marks_${index}`, marks);
            formData.append(`totalMarks_${index}`, individualTotal);
        }
      });

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      const result = await response.text();
      showStatus(result, result.includes('Error'));
      
      // Optional: Clear marks after successful save?
      // setStudentMarks({});

    } catch (error) {
      showStatus(`Error: ${error.message}`, true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Save Marks';
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Scifun Mark Entry System</h1>
        <p className="text-gray-600 mb-8 text-center">Enter test scores for student tracking.</p>

        <form onSubmit={handleSubmit}>
          {/* Top Section: Context (Branch, Batch, Test Details) */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
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
          
          {/* Test Details Section */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-8">
            <h3 className="text-md font-bold text-blue-800 mb-3 uppercase tracking-wide">Test Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                   <label className="block text-gray-700 text-xs font-bold mb-1">Test Date</label>
                   <input type="date" id="testDate" name="testDate" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                   <label className="block text-gray-700 text-xs font-bold mb-1">Test Name / Topic</label>
                   <input 
                      type="text" 
                      placeholder="e.g. Physics: Light Unit" 
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                   />
                </div>
                <div>
                   <label className="block text-gray-700 text-xs font-bold mb-1">Total Marks</label>
                   <input 
                      type="number" 
                      placeholder="e.g. 50" 
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(e.target.value)}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                   />
                </div>
            </div>
          </div>

          {branch && batch && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Student Scores</h2>
                <div className="text-sm text-gray-500">
                    Entering marks out of <span className="font-bold text-black">{totalMarks || '?'}</span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10"><div className="loader mx-auto"></div></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-1/2">Student Name</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm w-1/2">Marks Obtained</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {students.map((student, index) => {
                        const name = typeof student === 'string' ? student : student.name;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-gray-800">{name}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                  <input 
                                    type="number" 
                                    value={studentMarks[index] || ''}
                                    onChange={(e) => handleMarkChange(index, e.target.value)}
                                    placeholder="0"
                                    className="w-24 px-3 py-2 font-mono text-lg font-bold border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-center"
                                  />
                                  <span className="ml-2 text-gray-400 font-medium">/</span>
                                  <input 
                                    type="number"
                                    value={studentTotalMarks[index] !== undefined ? studentTotalMarks[index] : totalMarks}
                                    onChange={(e) => handleTotalMarkChange(index, e.target.value)}
                                    placeholder={totalMarks}
                                    className="w-16 ml-1 px-1 py-1 text-gray-500 text-sm border-b border-gray-300 focus:border-blue-500 outline-none transition text-center bg-transparent"
                                    tabIndex={-1} // Skip tab so user flows from mark to mark
                                  />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <button type="submit" id="submit-button" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-[0.98]">
                Save Marks
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
