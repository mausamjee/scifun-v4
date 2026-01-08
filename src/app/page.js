import Head from 'next/head'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, FlaskConical, Atom, Sigma, User, Star, Code, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <Head>
        <title>SciFun Education - Master Class 1 to 12</title>
        <meta name="description" content="Best Science & Math Coaching. Interactive Learning." />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 max-w-xl">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Admissions Open 2024-25
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Master Class 1 to 12 <span className="text-blue-600">(SSC & HSC)</span> with <span className="text-cyan-500">Fun &</span> <span className="text-teal-500">Focus.</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                The Best Science & Math Coaching in Nallasopara. Join our expert-led classes for Boards, MHT-CET, JEE, & NEET preparation.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  <Calendar size={18} />
                  Book Free Demo
                </button>
                <button className="flex items-center gap-2 bg-white text-gray-800 border border-gray-200 px-6 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition shadow-sm">
                  <MapPin size={18} className="text-red-500" />
                  Visit Center
                </button>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="student" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    +2k
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Students Mentored</p>
                  <div className="flex text-yellow-500 text-xs">
                    {'★'.repeat(5)} <span className="text-gray-400 ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visuals */}
            <div className="relative h-[500px] hidden md:block">
              <div className="absolute right-0 top-0 w-[45%] h-[90%] bg-gradient-to-br from-gray-800 to-gray-600 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
                 <div className="absolute inset-0 flex flex-col justify-end p-6 bg-black/20">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">JEE & NEET</span>
                    <h3 className="text-white font-bold text-xl">Advanced Prep</h3>
                 </div>
                 <img src="https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Advanced Prep" className="absolute inset-0 w-full h-full object-cover -z-10" />
              </div>
              <div className="absolute right-[40%] top-[10%] w-[45%] h-[90%] bg-white rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition duration-500">
                 <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded w-fit mb-2">Class 1-10</span>
                    <h3 className="text-white font-bold text-xl">Interactive Learning</h3>
                 </div>
                 <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Interactive" className="absolute inset-0 w-full h-full object-cover -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What do you want to learn today?</h2>
              <p className="text-gray-500 mt-2">Browse our most popular categories and kickstart your journey.</p>
            </div>
            <Link href="/courses" className="hidden md:flex items-center text-blue-600 font-semibold hover:underline">
              View all courses <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <CourseCard 
              icon={<FlaskConical size={24} className="text-blue-500" />}
              title="Chemistry 101"
              desc="Master the elements and learn about reactions through safe, hands-on home experiments."
              tag="4 Weeks"
              bg="bg-blue-50"
              students="1.2k"
            />
            <CourseCard 
              icon={<Atom size={24} className="text-purple-500" />}
              title="Physics for Kids"
              desc="Understand the invisible forces around us like gravity, magnetism, and motion."
              tag="12 Modules"
              bg="bg-purple-50"
              students="850"
            />
            <CourseCard 
              icon={<Sigma size={24} className="text-orange-500" />}
              title="Calculus Prep"
              desc="Get ready for higher math with visual guides to derivatives and integrals."
              tag="Advanced"
              bg="bg-orange-50"
              students="500"
            />
            <CourseCard 
               icon={<User size={24} className="text-green-500" />}
               title="Biology Basics"
               desc="Explore the wonders of life, from microscopic cells to complex ecosystems."
               tag="8 Weeks"
               bg="bg-green-50"
               students="2.1k"
            />
            <CourseCard 
               icon={<Star size={24} className="text-indigo-500" />}
               title="Stargazing"
               desc="Map the constellations and understand the lifecycle of stars."
               tag="Beginner"
               bg="bg-indigo-50"
               students="3.4k"
            />
            <CourseCard 
               icon={<Code size={24} className="text-red-500" />}
               title="Coding Logic"
               desc="Develop problem-solving skills with fun block-based programming puzzles."
               tag="Interactive"
               bg="bg-red-50"
               students="1k"
            />
          </div>
          
          <div className="md:hidden mt-8 text-center">
             <Link href="/courses" className="text-blue-600 font-semibold flex items-center justify-center">
              View all courses <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Toppers Section */}
      <section className="py-20 bg-[#FFFBEB] relative">
         <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Toppers & Results</h2>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
               <ResultCard 
                 name="Consistent Toppers"
                 location="In Nallasopara"
                 imgUrl="https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                 score="93%"
                 sub="SSC Score"
                 stats={[
                   { label: "32%", val: "Students" },
                   { label: "533", val: "CET Score" }
                 ]}
                 bg="bg-lime-200"
               />
               <ResultCard 
                 name="Average CET"
                 location="Score: 148"
                 imgUrl="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                 score="148"
                 sub="CET Score"
                 stats={[
                   { label: "148", val: "Students" },
                   { label: "143", val: "CET Score" }
                 ]}
                 bg="bg-lime-200"
               />
               <ResultCard 
                 name="Average CET"
                 location="Score: 148"
                 imgUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                 score="148"
                 sub="Students"
                 stats={[
                   { label: "148", val: "Students" },
                   { label: "148", val: "CET Score" }
                 ]}
                 bg="bg-lime-200"
               />
            </div>
         </div>
      </section>
    </div>
  );
}

function CourseCard({ icon, title, desc, tag, bg, students }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${bg} uppercase`}>{tag}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 line-clamp-2">{desc}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <div className="flex items-center text-xs text-gray-500">
           <User size={14} className="mr-1" /> {students} Students
        </div>
        <button className="text-blue-600 font-bold text-sm hover:underline">View Details</button>
      </div>
    </div>
  )
}

function ResultCard({ name, location, imgUrl, score, sub, stats, bg }) {
  return (
    <div className={`${bg} rounded-3xl p-6 w-full md:w-80 shadow-lg text-center`}>
       <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
       <p className="text-gray-700 font-medium mb-6">{location}</p>
       
       <div className="w-24 h-24 mx-auto rounded-full border-4 border-white overflow-hidden mb-6 shadow-md">
         <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
       </div>
       
       <div className="mt-8 flex justify-between px-4">
          <div className="text-center">
             <div className="text-2xl font-bold text-gray-900">{score}</div>
             <div className="text-xs text-gray-600">{sub}</div>
          </div>
          {stats.map((stat, i) => (
             <div key={i} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.val}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
             </div>
          ))}
       </div>
    </div>
  )
}
