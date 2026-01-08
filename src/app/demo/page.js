'use client'
import { useState, useEffect, useRef } from 'react'
import { db } from '../../firebaseConfig' // Importing the client-side config with keys
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'
import html2canvas from 'html2canvas'
import { Search, Download, CheckCircle, AlertCircle, Clock, Smartphone, User, BookOpen, Hash } from 'lucide-react'

// --- FREJA UI COMPONENTS ---
const FrejaHeader = () => (
  <div className="bg-[#002f6c] text-white p-4 flex justify-between items-center shadow-md">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">SF</div>
      <span className="font-semibold text-lg tracking-wide">SciFun ID</span>
    </div>
    <div className="text-xs bg-blue-800 px-2 py-1 rounded">SECURE</div>
  </div>
)

const DigitalClock = () => {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return <span className="font-mono text-lg font-bold tracking-widest">{time.toLocaleTimeString()}</span>
}

// --- MAIN PAGE COMPONENT ---
export default function StudentRegistrationSystem() {
  const [view, setView] = useState('register') // 'register' | 'card' | 'loading'
  const [formData, setFormData] = useState({ name: '', phone: '', studentClass: '10', board: 'MH' })
  const [studentData, setStudentData] = useState(null)
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const cardRef = useRef(null)

  // --- ACTIONS ---

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoadingMsg('Verifying Availability...')
    setView('loading')

    try {
      // 1. Check Duplicates in Firestore
      const q = query(collection(db, 'students'), where('phone', '==', formData.phone))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        throw new Error('This phone number is already registered.')
      }

      setLoadingMsg('Registering Student...')
      
      // 2. Prepare Data
      const newStudent = {
         ...formData,
         controlNumber: Math.floor(1000 + Math.random() * 9000), // Random 4 Digits
         registeredAt: new Date().toISOString(),
         id: 'ID-' + Date.now().toString().slice(-6)
      }

      // 3. Save to Firestore (Client Side for speed)
      // Note: In a real app we might do this via API, but prompt asked for "Dual Database". 
      // We'll write here for immediate UI feedback + Call API for Sheets Backup.
      await addDoc(collection(db, 'students'), newStudent)

      // 4. Call API for Sheets Backup & Email (Background)
      // We don't await this strictly for UI, but good to know it passed.
      setLoadingMsg('Backing up to Sheets...')
      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      })

      // 5. Success
      setStudentData(newStudent)
      setView('card')

    } catch (err) {
      console.error(err)
      setError(err.message || 'Registration Failed')
      setView('register')
    }
  }

  const handleFindID = async (e) => {
    e.preventDefault()
    setError('')
    setLoadingMsg('Searching Database...')
    setView('loading')

    try {
      const phoneInput = e.target.phone.value
      const q = query(collection(db, 'students'), where('phone', '==', phoneInput))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error('No student found with this number.')
      }

      // Get the first match
      const data = querySnapshot.docs[0].data()
      setStudentData(data)
      setView('card')
      
    } catch (err) {
      setError(err.message)
      setView('register')
    }
  }

  const downloadCard = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null })
    const link = document.createElement('a')
    link.download = `SciFun-ID-${studentData.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // --- VIEWS ---

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-blue-800 font-semibold animate-pulse">{loadingMsg}</p>
      </div>
    )
  }

  if (view === 'card' && studentData) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 font-sans">
        
        {/* ACTION HEADER */}
        <div className="w-full max-w-md flex justify-between items-center mb-6">
          <button onClick={() => setView('register')} className="text-gray-600 hover:text-blue-600 font-medium text-sm flex items-center gap-1">
            ← Back to Home
          </button>
          <button onClick={downloadCard} className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 flex items-center gap-2 text-sm font-bold">
            <Download size={16} /> Download ID
          </button>
        </div>

        {/* FREJA UI CARD */}
        <div ref={cardRef} className="w-full max-w-[350px] bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100 relative">
            
            {/* Header */}
            <div className="bg-[#002f6c] p-6 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <h2 className="text-xl font-bold tracking-wider relative z-10">SciFun Education</h2>
                <p className="text-blue-200 text-xs uppercase tracking-widest mt-1 relative z-10">Student Identity</p>
            </div>

            {/* Avatar Section */}
            <div className="relative -mt-10 mb-4 flex justify-center">
               <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-md overflow-hidden relative z-20">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.name}`} alt="Avatar" className="w-full h-full object-cover" />
               </div>
               
            </div>

            {/* Content */}
            <div className="px-8 pb-8 text-center space-y-4">
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{studentData.name}</h1>
                  <p className="text-gray-500 font-medium text-sm mt-1">{studentData.studentClass}th Grade • {studentData.board} Board</p>
                </div>

                <div className="flex justify-center py-2">
                   <div className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-xs font-bold tracking-wide border border-blue-100 flex items-center gap-2">
                      <Clock size={12} /> <DigitalClock />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left border-t border-gray-100 pt-4 mt-2">
                    <div>
                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block mb-1">PHONE</span>
                        <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                          <Smartphone size={12} className="text-gray-400" /> {studentData.phone}
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block mb-1">CONTROL NO</span>
                        <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                          <Hash size={12} className="text-gray-400" /> {studentData.controlNumber}
                        </span>
                    </div>
                </div>

                {/* Animated Valid Indicator */}
                <div className="mt-6">
                    <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-center justify-center gap-2 text-green-700 font-bold text-sm animate-pulse-slow">
                        <CheckCircle size={18} />
                        VALID FOR 2025-26
                    </div>
                </div>

            </div>
            
            {/* Footer Stripe */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        </div>

        <p className="mt-8 text-gray-400 text-xs text-center max-w-xs">
          This digital ID is issued by SciFun Education. Use this for class attendance and access to library resources.
        </p>

      </div>
    )
  }

  // --- REGISTER FORM ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <FrejaHeader />
      
      <main className="max-w-md mx-auto mt-10 p-4">
        
        {/* MODE TOGGLE */}
        <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 flex mb-8">
          <button 
             onClick={() => { setView('register'); setError('') }}
             className={`flex-1 py-2 text-sm font-bold rounded-full transition ${view === 'register' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
             New Registration
          </button>
          <button 
             onClick={() => { setView('find'); setError('') }}
             className={`flex-1 py-2 text-sm font-bold rounded-full transition ${view === 'find' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
          >
             Find My ID
          </button>
        </div>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r shadow-sm flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <div>
                   <h4 className="text-sm font-bold text-red-800">Error</h4>
                   <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
        )}

        {view === 'register' ? (
          <form onSubmit={handleRegister} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-5">
             <div className="text-center mb-4">
               <h2 className="text-2xl font-bold text-gray-900">Student Registration</h2>
               <p className="text-sm text-gray-500">Join the SciFun community today.</p>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                   <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                   <input 
                     required type="text" placeholder="e.g. Rahul Sharma" 
                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Class</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium appearance-none"
                      value={formData.studentClass}
                      onChange={e => setFormData({...formData, studentClass: e.target.value})}
                    >
                      {[8,9,10,11,12].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Board</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium appearance-none"
                      value={formData.board}
                      onChange={e => setFormData({...formData, board: e.target.value})}
                    >
                      <option value="MH">State Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                    </select>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                   <Smartphone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                   <input 
                     required type="tel" placeholder="9876543210" pattern="[0-9]{10}"
                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
             </div>

             <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition flex justify-center items-center gap-2">
                Generate Digital ID <CheckCircle size={20} />
             </button>
          </form>
        ) : (
          <form onSubmit={handleFindID} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
             <div className="text-center mb-2">
               <h2 className="text-2xl font-bold text-gray-900">Find ID Card</h2>
               <p className="text-sm text-gray-500">Enter your registered mobile number.</p>
             </div>

             <div className="space-y-2">
                <div className="relative">
                   <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                   <input 
                     name="phone"
                     required type="tel" placeholder="Search by Phone Number" 
                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                   />
                </div>
             </div>

             <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition flex justify-center items-center gap-2">
                Find My ID <Search size={20} />
             </button>
          </form>
        )}

      </main>
    </div>
  )
}
