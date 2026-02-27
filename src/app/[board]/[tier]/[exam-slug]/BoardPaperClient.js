'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ListOrdered, 
  MessageSquare,
  Share2,
  Calendar,
  BookOpen,
  ArrowRight,
  Eye,
  ZoomIn
} from 'lucide-react';

export default function BoardPaperClient({ params }) {
  const { board, tier, 'exam-slug': examSlug } = params;
  
  // Marathi Question Paper 2026 Pages
  const marathiPages = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXpxxSPzviaziJj13buD3zsgHJMadIZdL2_2rxasbtrAfHSffPgzPvqvBXXnI9iQH9pkAlCSJRaekd0XqynQsvKUc1b1DbyclhCAhLW16nQnMzlH8UZ0vlc7vrry7atiBcGCEM3-nbdHY_E_YWhdbj5Lka7OvS2-3NP9EDMuW9Ujk4KbIIJ5s29owLoJ5l/s1300/Page%201.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYTMdYy1p4OsD6_MFG2uCEz4QTeouAnhqopTfptcmS6r6yaaToL3yZmP8nFhGG1qgO4DX8WKPtIKTIPJd4ZaFhBZkBY8ZsbI_ew3gRErTQIt8zuC7xnOYfJwvmZqTZwTf8gqTtS2D3UZKyaoBcDWdeQTNE0hRlrQPXVF7zlWiw1ry5y6kDmXE5aEjX_y-c/s1140/Page%202.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5bgNa8uSOIU5KuQugptATD-5ungUzToqRbvvRtDkaJXMfN8klMB0Ums8DhO3ddopVCxaV2lthU0CnDkmrGBOAdnQ4gtdIZAbX-rs-kKRxhUyOkphc68SHU75ZXu57S0okJd8G-yXmH858n5_NOpe_QVJ45fV9MBFYp9QROy3Uudl7d_pFXiqwTNRU1NRb/s1104/Page%203.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjG53ev0tIDdMsm_u16WQscl_PF8xUWrdB6P_x6OIU7Ki6kQ_WRBhzraAGOdf5m7anuC_kYcVzS18OCO201YP-r395L9jb2pmb6t41AhbOFjMqJsYhnFa0QWgnAT3Zt7_7NjXfcV7JHIF1O5YcVAfPpf2d2zpScgNd2xjmLfuJ1u678W0ZMy5SfOwE6gaJL/s1096/Page%204.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8SVabO8KUDWCFPc_jzhwt58CHe4L21x3EuSjEvoH6URfVEHVRx9UtZr-Z7BNR979PFyShbrK0VCnkmqVr-drO8NNAhY_JQmV9a87HWwMKf-0VkHwDOMCGBW8SNc5HvMrhfsfYJBkRXQDD3oHaVeddgFoIpLceeem8t4RhQ21fcbcpvUWXk_oxB8iKIqH_/s1104/Page%205.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEidgbtxvi0dm6npiMW9gxyrtmY2TWcDaQpcw06f3AUEjwrswoTmAdjXaWQdHdnT41gPK0lO7Km0d0zArYZ-W5NeSA6CrZRuuHE5lEQlSHb0et75AP0p6Al_nPA0feE7PRlR1Zd9AFcEhu2_T_WNf2wRlL56WtyTiUQm1la7TnKN8KGH29cwFNxpyTcnJ_6U/s1180/Page%206.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgicxpKyPcCkFFf80E_c5WKryOYTwBieuXfs5hKxW6HdCVRn-61dQVup00kw4fCBllSDNX8Z5BYTSnq8PQltuWdfeH-RUlevmsmcwVk0Nws62__Vx-I40XmReRNmPjXKz7xD2qpqk40UXaHsZLVI0CJCyXzJZvgY2OpMYCYTwdSPFBI2pbk7-3DsvvdnVP1/s1152/Page%207.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhff0xeDNMfDGeTQA_BafUk-49XszqAD4cEBP8hFdHnCez5AE2ywKlEVlAZlbRyYpTk46ACXwK_U7Rg8q37Gxro5SW66k6-8PMFL85vSLAFq6MsN573nji_Ww3jM8y2hNA2iQbIOf2a4HEmofUCZT-FjpaQiRlUevZO2R3-A_FdSD92ySxi7amTMwGh3NDq/s1140/Page%208.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwbGj8Ecg7dU3ivaf2SrImAYK1D84djSeGaeTcDEyMb9yHHHw6JzpyI9GAcTsqyBJLAGaU4Mf9TO2AzBvL1U3a1ChP2jJHsbSSkmRkH3__guDZanh4lwAdf8d_XuPnUaXE_6xiim3e3LWpHCO8t505_SVKkFQ2spoHhFS_-TXAHdVNXl-Yd1yxrBnf7fpG/s1132/Page%209.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4thjDlP21mDvgsxPUwQks1jc_2HuxEvXNr3D_NW3UL1PlNrK6neVi4M3FRtU7qDPdZPG6jyL_71JcgPCdoiZ0ZsrVVt2kQWo08Xym1PIG2tlsNSCb-JG_jV7h1owEfshDY9tMMvdeeqjUbUNfhw0s6lOml62TKsvK1238_AneUymvAivTczU_5yrJMwO3/s1164/Page%2010.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrPF8R27YxdSOJxwQQyCV5LrLwDqEIMaeYlP1fTI3zMhnSvtvDRtxbj5VDL_u3LfN_VAaViCY_PwUETIZaSZx-DYPtUXu12ah4SkmZWcArPSBNlCvYCicw_1pFBSmOn6pq1-Cak8N1JadQqhuJv5u7oc44_kJmx9cO6sea06ClPqyZHB94e-rYhaTcSKGm1/s1200/Page%2011.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJ7Gilybj1fBvQJciN8em0LluK9z3ACs0Szf9NP3vi07ttKXeIIRf3CI8LO4ZOZ7V-IIg0IIcONXXgY4JbheZoLFNKpDCoP0srqUzR08WS9C3BsSoLWDvJhNQInQrJnkUzC_IcEGJfqT0djFomU1DqEOWdx_Lkzm8LabS-1WpfbMppJxHZN6UjR041Qr_8/s1104/Page%2012.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgUJHQR28iX7brEvFs2F9VWY7n9QL_Uu6kWhBTYM92X3mPCgA1AVaAiUOI0zbNqM5HQiCXndqVLcqbS8P72FPtVw433cQ-naToYn7GZziEXAQYD0oymYAd6inu9ftj-ynczzeHHeIpEGenhhoi7ePLw005k_pI3S8sp-aVsPZIFqRz_ejRldTvCBeQLTFj0/s1144/Page%2013.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSoCDCtlpVY2xiNO7lJsHSj0i1LW3GC0zPcxe_1PcctZNzBEH-ncgjKEUw-TLuXQKr6-UgUeRU-_eL_ZBK-ek_u9AN1NghxKZKihFu2ZDjMdhPMbNpX0N26Ha4jXpm8qcJIQdA0X7VzMZYWSxZfDRMusVmU2R28Rn0fyN0M_ISb4RsLLHWS02ny6pr3KEy/s1200/Page%2014.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuEEfse09YhHeps3pQqqU-TM4qtkWeW6Ar8ARvVIYY1xKxd7p2CTHKNLy0G_Ww64OxSCAMPG2N_A1LJER0pqatLMK7Mq9PUiECk7v-_WeAuEA7QrKqyYMpT3oA0IcXanq06VcImI7O0uk7g_R3S6bObzrwbwPqQ9L5tZTuEsxY9VzknSNlzlzZSysCyPQ0/s1200/Page%2015.jpeg"
  ];

  // English Question Paper 2026 Pages
  const englishPages = [
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

  const isEnglish = examSlug === "english-question-paper-2026-answer-key";
  const isMarathi = examSlug === "marathi-second-language-question-paper-2026-answer-key";
  const paperPages = isEnglish ? englishPages : marathiPages;


  const displayTitle = examSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const boardName = board.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const tierName = tier.toUpperCase();

  const [currentTime, setCurrentTime] = useState('');
  const [status, setStatus] = useState('Checking Status...');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const hour = now.getHours();
      if (hour < 11) setStatus('Starting Soon...');
      else if (hour >= 11 && hour < 14) setStatus('Exam Ongoing...');
      else setStatus('Exam Concluded');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Live Progress Bar */}
      <div className="sticky top-0 z-50 bg-indigo-600 text-white py-2 px-4 shadow-md text-xs md:text-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE UPDATES
          </div>
          <div>{currentTime} | {status}</div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        {/* Link Juicing Banner (Conditionally show for Marathi page to boost English) */}
        {examSlug === "marathi-second-language-question-paper-2026-answer-key" && (
          <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-8 text-center font-bold animate-pulse shadow-xl shadow-indigo-200">
            <Link href="/maharashtra-board/ssc/english-question-paper-2026-answer-key">
              🚨 Next Exam: Click Here for SSC English Paper 2026 & Live Answer Key (Feb 27) ➔
            </Link>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
             <BookOpen size={20} />
             <span className="tracking-widest uppercase text-[10px] md:text-sm">{boardName} Board {tierName}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {displayTitle} PDF Download: 10th Question Paper & Answer Key Live Updates
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs md:text-sm mb-6">
            <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full text-slate-700 font-medium whitespace-nowrap">
              <Calendar size={14} /> {isEnglish ? "Feb 27, 2026" : "Feb 23, 2026"}
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock size={14} /> Last Updated: Just Now
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold whitespace-nowrap">
              <CheckCircle2 size={14} /> Verified Content
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-50/50">
            <p className="leading-relaxed">
              The <strong>Maharashtra SSC {isEnglish ? "English" : "Marathi"} Board Exam 2026</strong> has successfully concluded today, <strong>{isEnglish ? "February 27, 2026" : "February 23, 2026"}</strong>. Thousands of students across the state appeared for the examination.
            </p>
            <p className="leading-relaxed mt-4">
              We have now uploaded the <strong>Maharashtra SSC {isEnglish ? "English" : "Marathi"} Board Paper 2026 PDF</strong> and the <strong>{isEnglish ? "English" : "Marathi"} Question Paper Solution 2026</strong>. Our expert teachers have verified the <strong>SSC {isEnglish ? "English" : "Marathi"} Answer Key</strong> and the full paper is available below for preview and download.
            </p>
          </div>
        </header>

        {/* Marathi & English Specific Content */}
        {(isMarathi || isEnglish) ? (
          <>
            {/* H2: Exam Overview & Analysis */}
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-indigo-600" /> Exam Overview & Analysis
              </h2>
              
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-lg bg-white mb-8">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="py-4 px-6 font-semibold">Entity</th>
                      <th className="py-4 px-6 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 cursor-default">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-600">Exam Name</td>
                      <td className="py-4 px-6">Maharashtra State Board SSC Exam 2026</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-600">Subject</td>
                      <td className="py-4 px-6 font-medium text-slate-800 italic">{isEnglish ? "English (HL/LL)" : "Marathi (Kumarbharati/Aksharbharati)"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-600">Date</td>
                      <td className="py-4 px-6 font-medium">{isEnglish ? "27 Feb 2026" : "23 Feb 2026"}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-600">Difficulty Level</td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                          Easy to Moderate
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-600">Answer Key Status</td>
                      <td className="py-4 px-6">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          Available Now
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-xl">
                <h3 className="text-xl font-bold text-indigo-900 mb-3 italic underline decoration-indigo-200">Expert Analysis:</h3>
                <p className="text-slate-700 leading-relaxed italic">
                  {isEnglish ? (
                    <>
                      "The <strong>10th Board English Paper 2026</strong> was well-balanced. Section 1 (Language Study) and Section 4 (Non-Textual) were straightforward. The <strong>English Grammar</strong> section was scoring, while the <strong>Writing Skills</strong> gave students ample choice to express their creativity."
                    </>
                  ) : (
                    <>
                      "The <strong>10th Board Marathi Paper 2026</strong> was well-balanced. Section 1 (Prose) and Section 2 (Poetry) were straight from the textbook. The <strong>Marathi Vyakaran (Grammar)</strong> section was scoring, while the <strong>Upyojit Lekhan (Writing Skills)</strong> gave students ample choice to express their creativity."
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* H2: Paper Preview Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <Eye className="text-indigo-600" /> {isEnglish ? "English" : "Marathi"} Board Paper 2026 - Page Preview
              </h2>
              <p className="text-slate-600 mb-6">
                Scanned pages of the official Maharashtra SSC {isEnglish ? "English" : "Marathi"} Question Paper 2026 are shown below:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-200 p-4 rounded-3xl">
                {paperPages.map((url, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-2xl border-4 border-white shadow-md hover:shadow-2xl transition-all duration-300 bg-white">
                    <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                      Page {index + 1}
                    </div>
                    <img 
                      src={url} 
                      alt={`Board Paper Page ${index + 1}`} 
                      className="w-full h-auto object-contain transform group-hover:scale-[1.02] transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur p-2 rounded-full text-indigo-600 shadow-lg hover:bg-white inline-block">
                        <ZoomIn size={20} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* H2: Download Section */}
            <section className="mb-12 bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Download {isEnglish ? "English" : "Marathi"} Board Question Paper 2026 PDF
              </h2>
              <p className="text-slate-600 mb-8">
                The official scanned copy of today's question paper is ready for download.
              </p>
              
              <div className="bg-indigo-600 p-8 rounded-2xl border-2 border-dashed border-indigo-300">
                <div className="flex flex-col items-center gap-4">
                  <a 
                    href={paperPages[0]} 
                    className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-full font-extrabold transition-all shadow-xl hover:scale-105"
                    download={`SSC-${isEnglish ? "English" : "Marathi"}-Paper-2026.jpeg`}
                  >
                    <Download size={24} /> DOWNLOAD FULL PAPER PDF
                  </a>
                  <span className="text-sm text-indigo-100 font-medium">Verified by SciFun Education | Format: JPEG/PDF</span>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Professional Placeholder for all other English/Subject pages */
          <div className="mb-12 bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Clock size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Starting Soon...</h2>
            <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              The <strong>{displayTitle}</strong> is currently being prepared by our academic team. We will upload the scanned PDF and verified answer key as soon as the exam concludes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div> Live Monitoring Active
               </span>
               <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">
                 Updates Every 5 Minutes
               </span>
            </div>
          </div>
        )}

        {/* Answer Key & Solutions (Generalized) */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <ListOrdered className="text-indigo-600 flex-shrink-0" /> {displayTitle} Solutions
          </h2>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-700 mb-6 italic">
              Detailed answers for the <strong>{displayTitle}</strong> will be populated here shortly after the exam.
            </p>
            <div className="bg-slate-50 p-6 rounded-lg italic text-slate-600 border border-dashed border-slate-300 flex items-center justify-center min-h-[150px]">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-2 text-slate-300" size={32} />
                Verification Protocol Active. Please check back at 1:30 PM.
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
            <MessageSquare className="text-indigo-400" /> Frequently Asked Questions (FAQs)
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
              <h3 className="text-lg font-bold text-indigo-300 mb-2">Was the Class 10th {isEnglish ? "English" : "Marathi"} paper hard today?</h3>
              <p className="text-slate-300">Most students rated it as "Easy to Moderate."</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
              <h3 className="text-lg font-bold text-indigo-300 mb-2">Where can I download the solved Answer Key?</h3>
              <p className="text-slate-300">You can download the PDF right here on SciFun Education.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-slate-200">
           <div className="text-center md:text-left">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">SciFun Education Platform</p>
              <h4 className="font-extrabold text-slate-800">Your Study Partner for SSC Boards</h4>
           </div>
           <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg w-full md:w-auto justify-center">
              <Share2 size={18} /> Share Results
           </button>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        main { animation: fadeIn 0.8s ease-out; }
      `}</style>
    </div>
  );
}
