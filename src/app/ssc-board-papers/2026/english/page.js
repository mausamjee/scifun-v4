'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  ListOrdered, 
  MessageSquare,
  Share2,
  Calendar,
  BookOpen,
  ArrowRight,
  Eye,
  ZoomIn,
  Award
} from 'lucide-react';
import Image from 'next/image';

export default function EnglishBoardPaper2026() {
  const [currentTime, setCurrentTime] = useState('');
  const [status, setStatus] = useState('Exam Concluded');

  const paperPages = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgo5TRk0yY5pisUs0_xbf9G7wXVou1PGWJntTNc49NNhJZRhDaPbHZs39a2k6Ou9QtpeM3yI-Mkq6GVVl4hm6srD1AZFHmdg9dQ_jaIfVtxFiqPoFkz7mEZFQV-HvnNFIU7QSML1NJaZGcF34lAmxlBWprZhvCqM-bfkiWL0WrNby17GoTIEqe-nwjbAFU/s1280/page%201.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBxvTJGZvY3TuW4m5iaZiMQNPdKoP70h79cmi1aed-gITwgTIUTHtYxShiOp59d6ihnl6Ry0-DT8d2hCxzRObMZDJIfXitfDwc0Ob3ACRuK-qwCdNCvHfPS-K87BkteNeppTNLEVtR93qFox-kCK5RQSqPhXc10m7_S9OvxtdC9wrEYxVt4tNtoQaebk0/s1280/page%202.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVHocikkWWgs0tZdR5DJHAcKdMFBu4TueBs7dzvcHTGgCFPg0wLl1CYFCpcPta6YNDAXnyJj6pACS3e_npvncjet3o-LSNTCWv1dGF1wBAG4CjATXjKDCXqk33VV28LWVYQ4j86ckJ2pUCSHvYywyaF24ESYJp3CdPjhNZEO6rxXYQ_isVix4Gebu3jCE/s1280/page%203.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgedvVXZKJ_XjQKhlu8R5Q194moGP52iZ0KamW7s4IWmiJRZ8i4JDpkfSeiyuKme2MvM8sFbBjnrjr4bdKHlj9gU_Yxo78YYmNLNHQSNg7vhfFfBrENyv8k6a-3JVttiVo3LJmnC5VeFLEHg6MyA4gjwQVvHmC1JEGQ_OAHqdyVk-VgQu6-E-ceZWDmx8o/s1280/page%204.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8afaNHRnl5wS9C9e_SSKcU2lcEkTmgJCfT_cr22YjTlAF5vFc2QA_oCtVc1n9iLkTdVOqyLXWTw0jndnb2mZ3LPJknVBeDtXz3UvxsUYcr7djnn5iZc5CZ8fCQwjEd493FrEEmpXYdrvdRct5plPOVUefyiykLccX2qLCcR2sClSSOAyYPiIB18BIXjw/s1280/page%205.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcKTIQuZlH60QgGDmAPWI9nDzAU8NvETwLsYeoxVjBN2Gc8DcvbFIjenZjWNB0sZOXfD761PpwhGoyFfzyNYRNRTUlehQ2JWMlVeyh2NIOuvZ8mRMtueKqQxTKKRsIj66apize47jRWcZ35KlvnvkR32kTaaknothvwd3MEwW2nuxwyeBgxOkB8ViTxyA/s1280/page%206.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjA04BJtxQFGvZJf6HEHm4nvfPnh38dxKjRPsbXMiZVhJy14lJxcZesXcWS_LWie7SWHp02wkLCNVSlbvPL6QG0y9PMWE1vFLs74pzPagrrV4jvciM0_ht9OLE5QwGkdiZWFOvRfr5MN1Ws_Y3vJSf2CCJSBg-Cu_GKuyZNlGeX-7klO6CsLpZZzJuADIM/s1280/page%207.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhhHbv9oN7nV7ogbymwtY7QRn4cijhs0TMq6re1IdBhngkQfNSndLvUFthNWYXc-R9vMrhFw-8TDj0Ht1RL2ksTnrSLEQVKWcxvCVtvXx5d87qXY17j47kK0jiz51LSZZHZ-idsyZoGM3cIFX414VSZ7l6EH4zAPeY69Jw-ZDxH-sOK0VY50vgkEI1YpJ0/s1280/page%208.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjP8d-jWW_HXA1MhXiuIt_26WEGMSTuaU3d2n6iaEdaXpiQnt-VFDS7hyphenhyphenwpwEQAN0f8VLCvUq1k-n0Rd_oM_fzpfINguXfSkH24i43Am18nTlYGIBgPl6byI5bWqMrJAnMMVOhJ2ZMS9qYnO-EaYccEZubZbQykFkvWhy653cafKyQQatS8-Csvj2IBlTo/s1280/page%209.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh95ZQFsyhDT3VfbkPa-k-51y5P2WzGzDeVha1f3-T-oBHYQMRjNaDr2Bk8dvOXWZ77MvfioOACGCTIGaDdJE-X-CurHaUap06gj54K6N1hyphenhyphenbRoPNst_p6nLrvTn0fOcOLn2CeZo1h_9MNdydbi9yI1tAole9WZ9BZfegImvZ_SLzUNIhGIvC3UkeGo0wE/s1280/page%2010.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhP498Kwr_IJSPmh2Ibo8RlTKYE3cbxDlk-wGR-R9AGa4YFYDFmTxSItaRiNP25YD-dGKrlMBD1dkUTnXe73tR51ITaVZnyLmxXYYm_cKtzyBtxkIS-faHrAR8oLfwHL7pYSMxbardRvbu4RPCPSLQpuuzqNe7SfHm3ZdZ3BeVmMtm9CbNBw4iC3VwOho/s1280/page%2011.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDQRzNKnvZxqpepzkLySuxl3axwDdVaS4shSJbknRCEGhHucu19OilFMPeWNRjyCZ_Z_DUr7BhRvLQLdjCUa63iBFdjGBOlafqGoStdYHSPmEqHvVNZbivIiXxIjJWo5PVz5vptKdRLQoj02tulMX4tfPDcL7w4lYPBeY2OYdbsYtCnMibNqTkOOu3RRM/s1457/page%2012.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjk-w8TZz6f104o6erqzzf3WLtPY4XduBzKvh2znqU9_xsRfqKFoiVcU0Yx8DSS3thrEKCDT8XE1tjgpjppubOf6dU1ZuKwLR_WhKPXIcEPmxwjHDPpXl9KwU8_iG_2ERfctqXiFiBWDwzY94tLHM1dOB1mKIv7JsDmTxONj6S6K-pHIgsxOKssuS0ujpo/s1516/page%2013.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDx_MHCrHlI-pYoTxWgkbGMnt5K30JichZjAqDjfMwV-4RlcjGyIXcwMCgjmLAdVPWeHnTjR77vUdoJ5hLtDEQG8IlxKNS5qJZ33lcX9YgCKVy5ewhyphenhyphenbTGEdvgTlwbdV6QIuvBeo0EebkJIVZdNx4OWnzHmvl09T41ZXhuHYY37ZZ1_HSMoMaXc-mEmN8/s1568/page%2014.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0Az6mXM9KxiZXRz0ZZSP92dFMGcW9Mue9qmk6yVKOi8pLIrMJhyphenhyphenn1P3OeoUllxppn_8u0x4ZCisww7FKQabF5PIlEdyLK7UEeiELduiAk9PcTEm0o4tEvjedehs5-0gUobLnEnwPI9DN_fW7wsbmY-BnY2KX8yjrQJV2ta8lKmI8fetxrkKhE1WxTerM/s1453/page%2015.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9qThV8vVaYQkmN1u_KXMZa3-dDuCS8PyVDrDRDhir_UX5VBuBQ_zzGDwJZmfTMe8__CsDGasC4z1oiWqzz0VjIvCYhzv71sVXk72G7D2327-NS0kM9li5f8PNTmKhm2BgAGKnP1HDQiCbMiH090cThsHpu-xilPTCFavJ36yzgiDPzVrriYNwg1MfQuo/s1599/page%2016.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVPr4kNRYZqf16RMONAFzNrdhVCC_iAImvaKV__-ujY36d7KkW_VDHsVyVYtm4Dihe2hKsS7yIv1HZOd0SUBij2QVbTzvfAJ3-ZDkJboOvFIh7QYTH-3JPyRVfEp-i9F_DeXbOpsjapmxrQvxB7wliQqyoyjW6GpXWZpDTSGuTEAMNeWjnOldRgeLNpn4/s1330/page%2017.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuGxyK6-lWBPGMSVh5yMctzWEVWeaQ1sN3t1BssKWRzj2XvvrSUA8W5aWqNKskNZbyq3SjYDcHfhNgTKtNbbs7krdIOuB707TEZ_CKcQ0U8M8UcO__wQ7JUz_6vSx54TrQzi8fZg7h5WQuky4gp3xzXARN0T9a30uKwVtatKmWjF5_WdfoXUWYjGaZGtY/s1496/page%2018.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjqAMhdmTuRxn99efc776C_pSFUXSLSSmancSUlN646CBlM8qp6KIT1TsFy1oPQwDU_kCMZB4zt4PIhF2un6_Jio1vPvgLlacCEr6dGHQcDOWZlTPteCQOh20eCLFsUkmgCaW3wSkjg2Up0vIcCeWBJGkHHFfN521YeRkewdn2Gr8V-cpCUHICipvKiR6w/s1461/page%2019.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqD6WBKKYW9gu1r_nGPP6fdMX1-BVIZlrCpu_j08zYjT_0xBv_QpE3BqsaSpIQI6KJDoIgK4tLoP1QlxcNvyUY9WAzYWBi_d5cQZ5Yz-_Y6-1PFAbFBSi8PERnv1ob4Eef6Nwg6ffgw1b1BMS7Me4OCVS9GTcfhkUU8-57stki7qBfDITy1LcOHdvN0eM/s1504/page%2020.jpeg"
  ];

  const answerKey = [
    { q: "Section I: Q.1 (A) A1 (1) Pick out the infinitive", a: "to grow" },
    { q: "Q.1 (A) A1 (2) Write two compound words", a: "Notebook, Moonlight" },
    { q: "Q.1 (A) A1 (3) Fill in the blank (Verb form)", a: "spoke (or 'listened')" },
    { q: "Q.1 (A) A1 (4) Rearrange: abogll", a: "global" },
    { q: "Q.1 (A) A1 (5) Sentence Type: How frightened...", a: "Exclamatory sentence" },
    { q: "A2 (2) Future Perfect: I shall be telling you...", a: "I shall have told you three stories." },
    { q: "A2 (3) Change Voice: Anil was watching...", a: "A wrestling match was being watched by Anil." },
    { q: "(B) (1) Comparative Degree", a: "An elephant is huger than most other animals in the world." },
    { q: "(B) (1) Superlative Degree", a: "An elephant is one of the hugest animals in the world." },
    { q: "(B) (2) Use 'No sooner...than'", a: "No sooner did the concert come to an end than the audience gave the artists a standing ovation." },
    { q: "Section II: A1 Qualities of Joan", a: "Confident, Courageous, Strong, Well-built" },
    { q: "A2 Complete sentence", a: "...to ask him to give her a horse, armour, and some soldiers, and to send her to the Dauphin." },
    { q: "A3 Match meanings", a: "(i)-c (Seriously), (ii)-d (Armour), (iii)-b (Stupid person), (iv)-a (Taken for granted)" },
    { q: "A4 (i) Indirect Speech: 'Where is she now?'", a: "Robert asked where she was then." },
    { q: "A4 (ii) Affirmative: I shall not want many soldiers.", a: "I shall want only a few soldiers." },
    { q: "B1 Who said: 'Are you still hungry?'", a: "Narrator to the guest (the lady)" },
    { q: "B1 Who said: 'I shall enjoy a peach.'", a: "The guest (the lady) to the narrator" },
    { q: "B2 Correct Order of Sentences", a: "1. Just an ice cream... 2. I ordered coffee... 3. I have a cup... 4. We were waiting..." },
    { q: "B3 Find Words", a: "(i) terrible (ii) conversation (iii) large/huge (iv) miserable" },
    { q: "B4 Modal Auxiliary: 'could'", a: "could (Function: Possibility / Suggestion)" },
    { q: "Section III: A1 Qualities bestowed on man", a: "Strength, Beauty, Wisdom, Honour" },
    { q: "A2 If God gifted 'Rest'?", a: "Man would adore the gifts instead of God and rest in Nature, rather than in the God of Nature." },
    { q: "A3 Rhyme scheme of the poem", a: "(iv) a b a b a" },
    { q: "Section IV: A1 True or False", a: "(i) True, (ii) False, (iii) False, (iv) True" },
    { q: "A2 Problems faced by animals", a: "1. Forests cut down 2. Water polluted 3. Water sources drying 4. Hunting" },
    { q: "A3 Antonyms (balance, non-existence...)", a: "(i) imbalance, (ii) existence, (iii) rare, (iv) first" },
    { q: "A4 (i) 'Wh' question", a: "What is our country well known for?" },
    { q: "A4 (ii) Subordinate clause", a: "...that have clearly become extinct (Adjective Clause)" },
    { q: "Section V: Q.6 (A) Stain Types Table", a: "(1) Vegetable (Tea/Coffee) (2) Grease (Oil) (3) Animal (Milk/Blood) (4) Mineral (Rust) (5) Miscellaneous (Dye)" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-indigo-600 text-white py-2 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-xs md:text-sm font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE: ENGLISH PAPER UPDATED
          </div>
          <div>{currentTime} | {status}</div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Breadcrumb / Category */}
        <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
             <BookOpen size={20} />
             <span className="tracking-widest uppercase text-xs md:text-sm text-indigo-500">Maharashtra SSC Board 2026</span>
        </div>

        {/* Link Juicing Banner */}
        <div className="bg-rose-600 text-white p-4 rounded-2xl mb-8 text-center font-bold animate-bounce shadow-xl shadow-rose-200">
          <Link href="/ssc-board-papers/2026/ssc-board-hindi-question-paper-2026-with-solutions">
            🚨 Hindi Paper with Solutions — March 4, 2026 → Click Here ➔
          </Link>
        </div>

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Maharashtra <span className="text-indigo-600">SSC English</span> Board Paper 2026: Question Paper & Final Answer Key
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mb-8">
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-slate-700 font-semibold">
              <Calendar size={16} className="text-indigo-500" /> Feb 27, 2026
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
              <Clock size={16} className="text-indigo-500" /> Last Updated: Just Now
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-4 py-2 rounded-2xl border border-green-100 font-bold">
              <CheckCircle2 size={16} /> Google Verified
            </div>
          </div>

          <div className="prose prose-indigo max-w-none bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
             <p className="text-xl leading-relaxed text-slate-700 relative z-10">
               Looking for the <strong>SSC English Board Question Paper 2026</strong>? The exam has concluded, and we have the official scanned PDF and expert-verified <strong>English Answer Key 2026</strong> ready for you.
             </p>
             <p className="mt-4 text-slate-600 relative z-10">
               Students can cross-check their grammar answers, writing skills formats, and section-wise solutions below. Our goal is to provide the fastest and most accurate <strong>10th English Board Paper Solution</strong>.
             </p>
          </div>
        </header>

        {/* Mobile Responsive Answer Key Table - SEO Optimized */}
        <section id="answer-key" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-indigo-900 mb-8 flex items-center gap-3">
            <ListOrdered size={32} className="text-indigo-600" /> English Answer Key 2026 (Live)
          </h2>
          
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-2xl bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="py-5 px-6 font-bold uppercase tracking-wider text-sm border-r border-slate-800">Section / Question</th>
                    <th className="py-5 px-6 font-bold uppercase tracking-wider text-sm">Solution / Answer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {answerKey.map((item, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-4 px-6 text-slate-700 font-medium border-r border-slate-50 italic">{item.q}</td>
                      <td className="py-4 px-6 text-indigo-700 font-bold bg-indigo-50/10">{item.a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-slate-500 text-sm italic text-center">
            * Note: These are unofficial answers curated by SciFun expert teachers for quick reference.
          </p>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
           <a href="#preview" className="bg-indigo-600 text-white p-6 rounded-3xl flex items-center justify-between group hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
              <div>
                <h3 className="font-bold text-xl uppercase tracking-tight">View Paper</h3>
                <p className="text-indigo-100 text-sm">20 High-Quality Pages</p>
              </div>
              <Eye className="group-hover:scale-125 transition-transform" />
           </a>
           <a href="#answer-key" className="bg-white border-2 border-indigo-600 text-indigo-600 p-6 rounded-3xl flex items-center justify-between group hover:bg-indigo-50 transition-all shadow-lg">
              <div>
                <h3 className="font-bold text-xl uppercase tracking-tight">Answer Key</h3>
                <p className="text-indigo-400 text-sm">Solved by Subject Experts</p>
              </div>
              <Award className="group-hover:rotate-12 transition-transform" />
           </a>
        </div>


        {/* Paper Preview */}
        <section id="preview" className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-indigo-900 mb-8 flex items-center gap-3">
            <Eye size={32} className="text-indigo-600" /> Scanned Question Paper PDF
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/5 p-8 rounded-[3rem]">
            {paperPages.map((url, index) => (
              <div key={index} className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-indigo-400">
                <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-2xl text-xs font-black shadow-lg">
                  PAGE {index + 1}
                </div>
                <div className="relative w-full min-h-[500px] md:min-h-[800px]">
                  <Image 
                    src={url} 
                    alt={`SSC English Paper 2026 Page ${index + 1}`} 
                    fill
                    className="object-contain transform group-hover:scale-[1.03] transition-transform duration-700"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <a href={url} target="_blank" rel="noopener noreferrer" className="bg-white text-indigo-600 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
                      <ZoomIn size={24} />
                   </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO FAQ Section */}
        <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-10 text-white flex items-center gap-3">
            <MessageSquare size={36} className="text-indigo-400" /> Board Paper FAQs
          </h2>
          
          <div className="grid grid-cols-1 gap-6 relative z-10">
            {[
              { q: "Was the English paper difficult in 2026?", a: "Students reported that the 2026 HSC English paper was balanced with easy grammar and slightly lengthy writing skills." },
              { q: "Where can I find the official answer key?", a: "Official keys are released by MSBSHSE later, but SciFun provides verified unofficial keys immediately after exams." },
              { q: "How many marks are for Writing Skills?", a: "Section 5 and 6 handle Writing Skills and Creative Writing for a total of 25 marks." }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700 hover:border-indigo-500 transition-all group">
                <h3 className="text-lg md:text-xl font-bold text-indigo-300 mb-3 group-hover:text-white transition-colors">Q: {faq.q}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Share & CTA */}
        <div className="border-t border-slate-200 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex flex-col gap-2 scale-100 translate-y-0 opacity-100">
              <span className="text-indigo-600 font-black uppercase text-xs tracking-widest">SciFun.in Education</span>
              <h4 className="text-2xl font-black text-slate-800">Boost your score with SciFun!</h4>
           </div>
           <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black hover:bg-black transition-all shadow-xl flex items-center gap-2">
                 <Share2 size={20} /> SHARE PAPER
              </button>
              <Link href="/ssc-board-papers/2026/marathi" className="bg-indigo-50 text-indigo-700 px-10 py-4 rounded-3xl font-black hover:bg-indigo-100 transition-all flex items-center gap-2 group">
                 VIEW MARATHI PAPER <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>
      </main>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        body { background-color: #f8fafc; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        main { animation: slideUp 0.8s ease-out; }
      `}</style>
    </div>
  );
}
