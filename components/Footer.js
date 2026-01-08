import { MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white pt-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10 grid md:grid-cols-4 gap-8">
        <div>
           <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">SF</div>
             <span className="text-xl font-bold text-gray-900">SciFun Education</span>
           </div>
           <p className="text-gray-500 text-sm leading-relaxed">
             Empowering students with knowledge, creativity, and confidence. Join us to reshape your future.
           </p>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-blue-600">Courses</a></li>
            <li><a href="#" className="hover:text-blue-600">E-Books</a></li>
            <li><a href="#" className="hover:text-blue-600">Practice Papers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600">Faculty</a></li>
            <li><a href="#" className="hover:text-blue-600">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">Get in Touch</h4>
           <div className="space-y-3 text-sm text-gray-500">
              <p className="flex items-start gap-2">
                 <MapPin size={16} className="mt-1 flex-shrink-0" />
                 Nallasopara West, Near Station, Palghar - 401203
              </p>
              <p className="flex items-center gap-2">
                 <Phone size={16} />
                 +91 98765 43210
              </p>
           </div>
        </div>
      </div>

      {/* Bottom Bar from Image */}
      <div className="border-t border-gray-100 py-6">
         <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
               <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">🎓</span>
               Science | Commerce | Arts
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                   <MapPin size={14} />
                   Nallasopara West, Near Station
                </div>
                <div className="flex items-center gap-1">
                   <Phone size={14} />
                   +91 98765 43210
                </div>
            </div>
         </div>
      </div>
    </footer>
  )
}
