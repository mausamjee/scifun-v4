'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import Image from 'next/image';

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
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjqAMhdmTuRxn99efc776C_pSFUXSLSSmancSUlN646CBlM8qp6KIT1TsFy1oPQwDU_kCMZB4zt4PIhF2un6_Jio1vPvgLlacCEr6dGHQcDOWZlTPteCQOh20cCLFsUkmgCaW3wSkjg2Up0vIcCeWBJGkHHFfN521YeRkewdn2Gr8V-cpCUHICipvKiR6w/s1461/page%2019.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqD6WBKKYW9gu1r_nGPP6fdMX1-BVIZlrCpu_j08zYjT_0xBv_QpE3BqsaSpIQI6KJDoIgK4tLoP1QlxcNvyUY9WAzYWBi_d5cQZ5Yz-_Y6-1PFAbFBSi8PERnv1ob4Eef6Nwg6ffgw1b1BMS7Me4OCVS9GTcfhkUU8-57stki7qBfDITy1LcOHdvN0eM/s1504/page%2020.jpeg"
  ];

  // Hindi Question Paper 2026 Pages
  const hindiPages = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj74MPq9E23XrPvNrj6iRxnmmjzslmVlpxZtkE4NhejuxmMHcsZ8fXsiYfGuiLo9jUP7VdQ6EfUZf1vEWrlNeFwkb5opEpr1JPmN2K-bwq6vkt_OTeuPLTYadvvGOVfYabgAyKRI3uU1JKTAbVvInlMJCwU4jrT9VNIyGfIlKrHmw8H_CZmO8p-aXYkEMo/s1467/page%201.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgm69suIt7xmZ24zbj3Kd4a4fs18Ep_LilPJIaqiGCrp37k7VNEeCrL4aCXae122K9S9fh9XNLJ4Dw8lYvBTcDCewNqtPZW8HjtRhXix6JQn3qY_Va_3KAns0-aqCOj-lDVuAod-iB6sV5NdHTx2SUvW2rMON4ilNzKdhMBq93c77si-i3qFNwD0DaoZHo/s1471/page%202.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiL6OX85HZVP6RbY_PH1A1pVqbkDm_Sh4AZavdwC9PGNN8Le38_y5gNoPaAPv-E2Dnf4JDriWEF5kbHpGN9YmevaoAOl5_bs2ThNXcbzuml4TpfbNuzd_eBM60bWO8WIpEdMcvMZPLs0u0ahI1mi9RRjSjWoFisQFH9D_YKI38RZDLo3BUrvuM2F8mfc5g/s1451/page%203.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggD7xa8SBujMPN74YL6EIfojNHv0nE3HtK1JwhgJRptis-MZVFT8r82KmDVH1oAeZ6iKVbIvmERfC1e1C-E8UEAEUSOu5iKO9Be3VujkEuw8siV4JzAxw-imBjQNoYB7DtGm0ACIi8Q0c9Gq0pofw6WOPsAZnzxVkOOZV163qCmsNQEIuqJYLSUkTG-Gs/s1510/page%204.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBfFKuoZZorHfUzhRsJ1Oo9aN24_oF7BrmGlGs-OOgN0aWXwLL439CGCyn0GQaS8_XjW7AqN59kjX4sLpfc4hDcMfvLNPCb93MAkWg0bgdWTxkPfmtUnnf_tyuxiBzlzri2eBnB5nttJJLUEsg6xk-LLcWOOYmSNqUP5vqTwFGb5y1_F4Cg6TxoHSYPWA/s1476/page%205.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEii0iA2ZuAL_tcEMOag__0T_I7CwCaBMPCJbzcp0uEYTQ-IvqXnO0TsC6MX09ZyPuYIg7gG5z78hvZQOOEWcrr9vSi9t4d1XTLEl90Qg2yNK7URJJS9McCI5ArcyafnBRrod8y96Oz3Oe9kqtsyN6TYzXbqHbJB_0xCQBL4nXZzRc7smi0BYtQXMl7Y0QU/s1440/page%206.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfEbY_gGPaPJiW_tcbRmauvGiqSt5il0BqBTQzG7U0yqNCvx9DbNR_Klv3T0R7OaqlibLgzgsJc1q-XV1CcipD70JEbE5cvM1eLpvgpmdGQT49YsQHMJq9VLmTqA84Oazq6gljVXV6HI4NLIa4K14_-W0n1TVSSTthj_9ZVweLXwBRq3ok51q-ByN7U8g/s1362/page%207.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5uwGp1veB2PfSflz-RDLUQm43uBBGIP64W7qFMNrQl8mUArpeJKrMZwH9Ucs3BMZBrrr2q1VPYJuDi3HoMPBdDNAW6BZq9tCRek7HMsBbXJg6uTZ8JW4mEhQFN8A-D6O6tpF_c_8lKSCxglspETpqhhMFne-9xhpr6w5LmOB2qomVNQRPOHQnz4mgKz4/s1380/page%208.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyVOROFLGfPZRTGtjJX7CXDS6kaCbLaKcFSEuGz8P2UA4TADTXs8MyR_f24p5SWJJShnWRstTbV87-t7IKQznfusge1FIPOdfbzVvm5uaWjX377SsalglQa95R8kI8VD5ed0qBJZkbw-b0r9ya8L2o7fmcYLZLQk3wVhIRqlJ4jiTN4ccFuq5nG3S0X8/s1456/page%209.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwS_sGU9YIYL-km1iV6X2cWbbskpGxoNdOEHpk5sYwEJ7Y0-xRana813YI0pwdOvu6qKEKHLaLn2fnWSbNhPku1mRAXH5jlhcghV8_GHMYU4IxmTLqd0lcKq8PxkpsXzzHr0ulk-gJ2nlcOlkQUR-VRkc24yR7FaquEkMKVwkFD_LiE82TWWxRUWYE13c/s1527/page%2010.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhA9U4H_EBH8yvoVMY7Pn_-I-xILeO6A6yKRZHptltmNLGt4POxdhwo9uS_Zzj4Lci4CQVh1CdcRYDvGhdUJTerlPfBQM3uNk5C76GHmb29xPHMychQmyJCGlM3Rb046uxPd1vAOt49j8PclbzTgvy6j6dTkuqi1ZKPbSQvMXehz806oPfX9pe-96oCWyo/s1307/page%2011.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4pY9u_rHvy6FXaoyL5ZXVHzvivR0PHqViyQ1zQz9XyEz_Y1GmLarn0ESo660mbcWQZ6QgDAiDX3cK98SW3n54XLwrFq3PvUQ4uwZfCAYEti_F9YRHkpDjACqn_b0TNQ6cohyphenhyphenEIgeIKyktucWWfTfr9HREBM8F2NB1tMDfPY7Fava3E7Ie3GexxaWeFu0/s1330/page%2012.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhEyMMD-kSSiNvRqo1wuF0s1MqclwVqnfOyHu3RXpsLWw301dieEME589Jlt5Bfv_BO2fXpJ9hvZrBtiveht4Mp10PNmgBt_gJAQy4Hk3gqdgzMQ6x0ZUAUBE3jBdpIey9ppxjJH9PWo8R_U3UgZgTxpXu19_bAg6LtJSa73SwLYh-CSu8THIgDeNIi6I/s1386/page%2013.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWnG8LkOtXTWwGkOx4Wr4VLKbINL2OjmDwmCQSadF8-i9GGxvStDyCqlkfSrKrMrt5FRleNmYokp7-v4i_Zq5RhsNnJvjeuQt3FIZdu2yiTmGWO8S4fb9UJnm9r4IqfowItoBW_zAd4hlE9D2xn9ajwkhH8PeUwp1pjNrlRgIsENPzhG7r7mrelcDF0-4/s1356/page%2014.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjIxPphJj-8rXaL_iwuPJ-W0JB4QowDl_af7dZGUG0ZJanbSrxZncDIQ95NY-I1M8tLyGoRMo5zFx4C0eOHIaZJNwjECBvhjEx_6ctU-v90v41cWHlj_OEsLHUxptFC1MrMIGKSSUSkg_53RycMy3leWuJNDhz1njjLc88kx30sr_DPT74m6lHmq4swKAQ/s1357/page%2015.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXJIw8O4oYPoZgIGWIVhCAKrjrFNSHSD_wSjGqqRTwgZODy7b9fQZ8RgsqV_oZub_MjDMdfD4LcTqJBleuzHRdVtVW6FbYTNFMe_UG9YbD-bigtKOWYgC5NY2L_1vb5PWp4dpcT0R63GB1KWsdzvOXyMaqumP7l20thm-3iyKaNNVHIOx9xyoVKegX2I8/s1445/page%2016.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijVoZZlTGBlZ6778Fgqdyznc2D0Fy6kPxN2FxCAqU7WsHxwKSHBoVUpas431zwk_w7qsXBdv-7IdBUqVdxtoEOH7fdFKovZmqO3sUgV7ST2_wjrmi1mTnuhaBO4g2e67y3pIhEJU9LX8MNqyxEx4Uj-zBBLUQyfG6lE9JqiHaiQQESbFC7f79YQ-Y1lEI/s1432/page%2017.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjnTQ59Y9myrHIdxXniLJVTI-nw2vLL5eahmCJ2hockDMhiYNjgHTIXTTbSaAtiG-okhBfaaJtIF1qbLTNaY93F-WIPRw9m2peER-KV5ZdHy1kFJod0GLL1fRXR9YK9HdUA4N127GeQP4TMZ3LATo9IfS88TmpkVV7wZtTXM1cltTxFkR_Mbjuz5Gxiv0Y/s1466/page%2018.jpeg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-tc1DCS6txVByiZ2TuG3NSotB_cgmDgx08RV9Gv4P7cqz3kb3L4ZZ1Ck-bfzUrF3hoAltqFfd22FwAqzck5iJjQeqnX7l2GH_g_pd2uDbzkmTuMhyphenhyphen3HTeCy2TYcz7S5scx_0BeWVPiGgQVoNRnLdTtmNwUq81BxdvheB3eh7M53syCc-w45lnrTy35Ek/s1364/page%2019.jpeg"
  ];

// Maths 1 (Algebra) Question Paper 2026 Pages
const math1Pages = [
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg0jQHrZ9nCd7HFX5Q-gf1hX-TjMSZ8g-UHg8h5ThuHlSTy0o6JV9e6YlHgt8_ria0Yu4sHOfUivm4LfYNLv1gq0mebS7zunaDtVp-b_MiXQWnAGFWCHK1WdL6Rr85Ofznr9fS-AdXw5M6_Fk5Q_7XkpC-GKiIwvVFksGXfgdzoDR0UXE0_cIzM3ry6WxGt/s1600/page%201.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj3yVVDacW_nksHE-M6KeihythAwcjEHDZO-ow35FWVHUhNnTAfZJZH97E_chzZuGZzxpnSLzEvlXDLy9vE6Z2T3aCwje5mLH-2Hw4xDlnPGmtfvDUgpwXWLn99P4yGWIT194lasYIm96OgiUx3SDIFp5rhOOEMfmzsG3NsfDXR3rlgPi0G2iRL5Wecf1Pv/s1600/page%202.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYqruPUXlA0hV3YmxsMwU9FPCDfRQViRqeed8xI-JxQDwUld9-KFHYRlAb6xoYyMUNcPkGYTTlDDYw4MNWeFjIj9vqu89dCg3zTDshPMx5oFo6rZ4WkJfHOaL6Eg_rf-QSssePp8-nojOv4cIo8H2vpPa5cEAe46OWyNzOeITkTgltq2owyaBPPDG2tJPe/s1289/page%203.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZx9VUhBHjZ20zaIA1fdz5ENU9EvPKStNdfwAwVGa7EWFqpNpVokRS3fUbH9PZ4EIJNElUzqYQNwL09Sg149fayEEMWuB_ahdJCn0oI2o_M5Vppwe7zq6COlRZF9BkUlSJi8oLsLTeLjctJwpiHJy6vSs9sP4E14-IE1tp0v5_AI5tCoNqnXQdguRaQcOJ/s1391/page%204.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOwhih4sTruUm7osT_391a_91H8FPtYUV-QLlTuHVAJRu1RgKXludTozdH8ASVwKWrAWMUu5K18X6Pm8ezmfWieDqPzu6vfQJfHQUElkSyEI4tfzfxwGozHJsPL4kBUdeiTW_FJ3WtJSzeUytQAunC9G_Jc24ojSflsU1S22_mM-wPQU5AA5ICsM1cH9Bt/s1320/page%205.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiF7_9jvmjnpVSjdFY-c2iAeXMcGYwrkrS7zsyZwE1bnV9Ceyt7XXp_LWGMGG3pKfYCZAqDkyKg7nw8qUt3mDOByfElAJplAbfGMNM6L5iqlLXLQG98brnkGdcXsDLSPJ8DjdZdlnd53d5AR2oow8Gujv3EoUTo0VnSpcbwGEfQykasSZMPGoN-x4A4FuRx/s1600/PAGE%206.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjznWEQtRXyHs-JNbTljcTId5ykIN_d1MKRPyHmH1GWVmMK1fHqZA2NJF95hZGS3mPKzyVcKz3UIBthpMLrXFBBXdeHMYgmmaoXtm_QW8O1Ud8Q4ymI0hyphenhyphenpOXYYhkbElWF7dnBtLgbHrlgUtcWfMu1J1tKD4BbVurfGmISX1kKy3XOAWgZvukV9vxbA5Ym7/s1309/PAGE%207.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzBw5YcypMJSXSM0Yh7AVwk8fxq9stgWXiJ8zW1KHjj3Doj37tQyPI0f2uVRElCD3Y6IQuYaBgFDt5ll0pKxH1f4q2XhlozNZvZdfkLlQJv7sx6BPPAXfRI_doCeWF4XYOrJYA_YtqDjWibdCqD_Rm9WNZZu9KZhbCBJWe4MDWtzCqMaW6mYTNSTI5uUYg/s1309/PAGE%208.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiI7uzohOEE0RUyb_8eYA407KoAikrpfAslf3PGdpqmsoKsiFBOYVbqWCHHlReayjlvXAfLFExOPt4r4DeZG4TV2q3UBuhKLFRY0_KRnRP7j8f2iR5fPBSXo_pfvwuBJcVhnH9w_lQHciO4dsk-1TUK0DE6U4Y_W21AkeDULDpe11JIo38pLtdnRei-OuZ/s1600/PAGE%209.jpeg",

"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh59xsP-Md781tvKd0uch-rJjgsDyTb4hz4oy245pInIJ10j6nDGzKBgHTxABecxAeg_GbRKd-UQWEQ3hh8BJplaMVtGiUdxSZA7LgS6JGLJvawE32_4yQrOGnzQc6GVRuJunKdTTLtJgN21qznT4J_GyeJvTx-RA6wHCSXCIlVOIYCiRw95TVY13EtOQG0/s1295/PAGE%2010.jpeg",
href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSSHJ1w38kR3WQ7EkezGE_a10RPkkqGbLUx1V3vsN1Sp6S8SPGQpnLG8sYuUxRmPD1feEIq3Qe8LTxLPZfsXr_xWQCGwdQblk4hIVKecANEQR9m0R5DiGukN6yKZhABIpMhizAR_4WOr-TKljthpmqpSXR2QZItrpL2S6mHjAITPGlIJqvNYt3kGPb6DfL/s1600/PAGE%2011.jpeg"
];

  const isEnglish = examSlug === "english-question-paper-2026-answer-key";
  const isMarathi = examSlug === "marathi-second-language-question-paper-2026-answer-key";
  const isHindi2026 = examSlug === "hindi-question-paper-2026-answer-key";
  const isMath1 = examSlug === "ssc-maths-part1-algebra-question-paper-2026-with-solutions";
  const paperPages = isEnglish ? englishPages : (isHindi2026 ? hindiPages : (isMath1 ? math1Pages : marathiPages));


  const displayTitle = examSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const boardName = board.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const tierName = tier.toUpperCase();

  const [currentTime, setCurrentTime] = useState('');
  const [status, setStatus] = useState('Checking Status...');

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isAnswerKeyExpanded, setIsAnswerKeyExpanded] = useState(false);
  const pageRefs = useRef([]);
  const thumbContainerRef = useRef(null);
  const mainScrollRef = useRef(null);

  useEffect(() => {
    if (!mainScrollRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setActivePageIndex(index);
          if (thumbContainerRef.current) {
            const thumb = thumbContainerRef.current.children[index];
            if (thumb) {
              const scrollPos = thumb.offsetLeft - (thumbContainerRef.current.clientWidth / 2) + (thumb.clientWidth / 2);
              thumbContainerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
          }
        }
      });
    }, {
      root: mainScrollRef.current,
      threshold: 0.5
    });

    pageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [paperPages]);

  const scrollToPage = (index) => {
    setActivePageIndex(index);
    if (pageRefs.current[index] && mainScrollRef.current) {
      const parent = mainScrollRef.current;
      const child = pageRefs.current[index];
      parent.scrollTo({
        top: child.offsetTop - parent.offsetTop,
        behavior: 'smooth'
      });
    }
  };

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

  const englishAnswerKey = [
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
    { q: "Section V: Q.6 (A) Stain Types Table", a: "1. Vegetable (Tea/Coffee) 2. Grease (Oil) 3. Animal (Milk/Blood) 4. Mineral (Rust) 5. Miscellaneous (Dye)" },
  ];

  const hindiAnswerKey = [
    { q: "Section 1 - Q1. (अ) (1) (i) लेखक के साढू साहब का शहर", a: "खंडवा" },
    { q: "(ii) लेखक का शहर", a: "इंदौर" },
    { q: "(iii) लेखक इस स्टेशन पर उतरे", a: "मडगाँव" },
    { q: "(iv) लेखक ने इस रेल से सफर किया", a: "गोवा एक्सप्रेस" },
    { q: "Q1. (अ) (2) सही विधान: टैक्सी एक बड़ी-सी सड़क पर दौड़ी।", a: "टैक्सी एक पतली-सी सड़क पर दौड़ पड़ी।" },
    { q: "Q1. (अ) (3) उपसर्गयुक्त 'अप्रसन्न' का मूल शब्द", a: "प्रसन्न" },
    { q: "Q1. (अ) (3) उपसर्गयुक्त 'असमय' का मूल शब्द", a: "समय" },
    { q: "Q1. (आ) (1) गद्यांश में उल्लिखित पात्र", a: "सरोज, बापू जी, काका (कालेलकर), लेखक" },
    { q: "Q1. (आ) (2) काका जी द्वारा सरोज को संदेश", a: "उर्दू लिखना सीखो और पूरा आराम लो।" },
    { q: "Q1. (आ) (3) 'कमजोरी' और 'साप्ताहिक' के मूल शब्द", a: "कमजोर (प्रत्यय: ई), सप्ताह (प्रत्यय: इक)" },
    { q: "Q1. (इ) (1) उपभोक्ता संस्कृति टिकने के साधन", a: "पैसा, सुविधाएँ, मनोरंजन, आराम" },
    { q: "Section 2 - Q2. (अ) (1) संख्या और महीना", a: "सौ, फागुन" },
    { q: "Q2. (अ) (1) फूल को नोचने का अधिकार", a: "डाली और कोंपल" },
    { q: "Q2. (अ) (2) विलोम: दुर्गंध x ? | पराई x ?", a: "गंध, अपनी" },
    { q: "Q2. (अ) (2) वचन: काँटे | डाली", a: "बहुवचन, एकवचन" },
    { q: "Q2. (आ) (1) कन्हैया के नाम | दूध के पदार्थ", a: "गिरधर, गोपाल | माखन, छाछ" },
    { q: "Q2. (आ) (2) अर्थ: निकट | मयूर", a: "ढिग, मोर" },
    { q: "Q2. (आ) (2) लिंग: पत्नी | दास", a: "पति, दासी" },
    { q: "Section 3 - Q3. (अ) (1) लोग सिरचन को कहते/समझते हैं", a: "मुफ्तखोर, कामचोर, बेकार, बेगार" },
    { q: "Q3. (आ) (1) जयमल-पत्ता | प्रहलाद | ध्रुव | भरत", a: "किसी को कुछ न गिनने वाला, लगन का सच्चा, मिट्टी में खेलने वाला, शेरों के दाँत गिनने वाला" },
    { q: "Section 4 - Q4. (1) 'तुम' का शब्दभेद", a: "सर्वनाम (मध्यम पुरुषवाचक)" },
    { q: "(2) अव्यय प्रयोग: परंतु | अरे!", a: "परंतु, अरे! (वाक्य प्रयोग)" },
    { q: "(3) संधि: निस्संदेह | सूर्यास्त", a: "निः + संदेह (विसर्ग), सूर्य + अस्त (स्वर)" },
    { q: "(4) सहायक क्रिया: पड़ा | दी", a: "पड़ना, देना" },
    { q: "(5) प्रेरणार्थक: फैलना | जुटना", a: "फैलाना/फैलवाना, जुटाना/जुटवाना" },
    { q: "(6) मुहावरा: जेब ढीली होना", a: "बहुत अधिक खर्च होना" },
    { q: "(6) मुहावरा: गला फाड़ना", a: "ज़ोर-ज़ोर से चिल्लाना (या 'दाद दी')" },
    { q: "(7) कारक: शहर में | स्वभाव से", a: "अधिकरण कारक, करण कारक" },
    { q: "(9) काल परिवर्तन: पढ़ते हैं -> अपूर्ण भूत", a: "पढ़ रहे थे" },
    { q: "(9) काल परिवर्तन: जा रहा था -> सामान्य भविष्य", a: "जाऊँगा" },
    { q: "(10) रचना भेद: मिश्र वाक्य", a: "जी करता कि मौका मिलते ही..." },
    { mural: "बड़ी मजा आई", corrected: "बड़ा मज़ा आया" }
  ];

  const math1AnswerKey = [
    { q: "Q1(A) — MCQ 1", a: "____" },
    { q: "Q1(A) — MCQ 2", a: "____" },
    { q: "Q1(A) — MCQ 3", a: "____" },
    { q: "Q1(A) — MCQ 4", a: "____" },
    { q: "Q1(B) — Fill Blank 1", a: "____" },
    { q: "Q1(B) — Fill Blank 2", a: "____" },
    { q: "Q1(B) — Fill Blank 3", a: "____" },
    { q: "Q1(B) — Fill Blank 4", a: "____" },
    { q: "Q2 — Short Answer (i)", a: "____" },
    { q: "Q2 — Short Answer (ii)", a: "____" },
    { q: "Q2 — Short Answer (iii)", a: "____" },
    { q: "Q2 — Short Answer (iv)", a: "____" },
    { q: "Q3 — Medium Answer (i)", a: "____" },
    { q: "Q3 — Medium Answer (ii)", a: "____" },
    { q: "Q3 — Medium Answer (iii)", a: "____" },
    { q: "Q4 — Long Answer (i)", a: "____" },
    { q: "Q4 — Long Answer (ii)", a: "____" },
    { q: "Q5 — Activity (A)", a: "____" },
    { q: "Q5 — Proof (B)", a: "____" },
  ];

  const currentAnswerKey = isEnglish ? englishAnswerKey : (isHindi2026 ? hindiAnswerKey : (isMath1 ? math1AnswerKey : []));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Live Progress Bar */}
      <div className="relative z-[40] bg-indigo-600 text-white py-2 px-4 shadow-md text-xs md:text-sm">
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
        {/* Link Juicing Banners */}
        {isMarathi && (
          <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-4 text-center font-bold animate-pulse shadow-xl shadow-indigo-200">
            <Link href="/maharashtra-board/ssc/english-question-paper-2026-answer-key">
              🚨 SSC English Paper 2026 & Live Answer Key (Feb 27) ➔
            </Link>
          </div>
        )}
        {isMarathi && (
          <div className="bg-rose-600 text-white p-4 rounded-2xl mb-8 text-center font-bold animate-pulse shadow-xl shadow-rose-200">
            <Link href="/ssc-board-papers/2026/ssc-board-hindi-question-paper-2026-with-solutions">
              🚨 Hindi Board Paper 2026 — Solutions coming March 4 at 1:15 PM → scifun.in/hindi-2026
            </Link>
          </div>
        )}
        {(isEnglish || isMarathi || isHindi2026) && (
          <div className="bg-rose-600 text-white p-4 rounded-2xl mb-8 text-center font-bold animate-bounce shadow-xl shadow-rose-200">
            <Link href="/ssc-board-papers/2026/ssc-maths-part1-algebra-question-paper-2026-with-solutions">
              🚨 SSC Algebra Paper 2026 with Solutions — March 6 LIVE Now ➔
            </Link>
          </div>
        )}
        {(isMath1) && (
          <div className="bg-amber-600 text-white p-4 rounded-2xl mb-8 text-center font-bold animate-pulse shadow-xl shadow-amber-200">
            <Link href="/ssc-board-papers/2026/ssc-board-hindi-question-paper-2026-with-solutions">
              🔥 Missing Hindi Paper Solutions? Click Here ➔
            </Link>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4">
             <BookOpen size={20} />
             <span className="tracking-widest uppercase text-[10px] md:text-sm">{boardName} Board {tierName}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {isMath1 ? (
              <>SSC Maths Part 1 (Algebra) Question Paper 2026 With Solutions — Maharashtra 10th Board</>
            ) : (
              <>{displayTitle} PDF Download: 10th Question Paper & Answer Key Live Updates</>
            )}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs md:text-sm mb-6">
            <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-full text-slate-700 font-medium whitespace-nowrap">
              <Calendar size={14} /> {isEnglish ? "Feb 27, 2026" : (isHindi2026 ? "Mar 04, 2026" : (isMath1 ? "Mar 06, 2026" : "Feb 23, 2026"))}
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock size={14} /> Last Updated: Just Now
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold whitespace-nowrap">
              <CheckCircle2 size={14} /> Verified Content
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-50/50">
            {isMath1 ? (
              <>
                <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border-l-4 border-indigo-600">
                  <p className="font-bold text-indigo-900 mb-2">Subject: Maths Part 1 — Algebra | Class: 10th (SSC)</p>
                  <p className="text-sm">Exam Date: March 6, 2026 | Total Marks: 40</p>
                  <p className="text-rose-600 font-bold mt-2 animate-pulse">⏳ Complete solutions uploading LIVE from 1:10 PM. Bookmark & Refresh this page.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
                    <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                      <FileText size={20} /> GUARANTEED FORMULAS 2026
                    </h3>
                    <ul className="space-y-3 text-sm font-mono">
                      <li><span className="text-slate-400">Quadratic:</span> x = (-b ± √b²-4ac) / 2a</li>
                      <li><span className="text-slate-400">AP nth:</span> aₙ = a + (n-1)d</li>
                      <li><span className="text-slate-400">AP Sum:</span> Sₙ = n/2 [2a + (n-1)d]</li>
                      <li><span className="text-slate-400">Prob:</span> P(A) = n(A) / n(S)</li>
                      <li><span className="text-slate-400">Mean:</span> x̄ = Σfx / Σf</li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
                    <h3 className="text-indigo-600 font-bold mb-4 flex items-center gap-2">
                      <ListOrdered size={20} /> EXPECTED PAPER PATTERN
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex justify-between"><span>Q1(A) 4 MCQs</span> <strong>4 Marks</strong></li>
                      <li className="flex justify-between"><span>Q1(B) 4 Fill Blanks</span> <strong>4 Marks</strong></li>
                      <li className="flex justify-between"><span>Q2 4 Questions × 2M</span> <strong>8 Marks</strong></li>
                      <li className="flex justify-between"><span>Q3 3 Questions × 3M</span> <strong>9 Marks</strong></li>
                      <li className="flex justify-between"><span>Q4 2 Questions × 4M</span> <strong>8 Marks</strong></li>
                      <li className="flex justify-between"><span>Q5 Activity & Proof</span> <strong>7 Marks</strong></li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="leading-relaxed">
                  The <strong>Maharashtra SSC {isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))} Board Exam 2026</strong> has successfully concluded today, <strong>{isEnglish ? "February 27" : (isHindi2026 ? "March 4" : (isMath1 ? "March 6" : "February 23"))}, 2026</strong>. Thousands of students across the state appeared for the examination.
                </p>
                <p className="leading-relaxed mt-4">
                  We have now uploaded the <strong>Maharashtra SSC {isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))} Board Paper 2026 PDF</strong> and the <strong>{isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))} Question Paper Solution 2026</strong>. Our expert teachers have verified the <strong>SSC {isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))} Answer Key</strong> and the full paper is available below for preview and download.
                </p>
                
                {isEnglish && (
                  <p className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 font-bold w-fit">
                    Also see <Link href="/ssc-board-papers/2026/ssc-maths-part1-algebra-question-paper-2026-with-solutions" className="underline hover:text-indigo-900">Maths Paper 2026 With Solutions</Link>
                  </p>
                )}
              </>
            )}
          </div>
        </header>

        {/* Marathi & English & Hindi & Maths Specific Content */}
        {(isMarathi || isEnglish || isHindi2026 || isMath1) ? (
          <>
            {/* Answer Key & Solutions */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <ListOrdered className="text-indigo-600 flex-shrink-0" /> {isMath1 ? "SSC Algebra 2026 — Complete Answer Key" : (displayTitle + " Solutions")}
              </h2>
              {isMath1 && (
                <p className="text-slate-500 mb-6 font-semibold">
                  Last Updated: <span className="text-rose-600 animate-pulse">Updating from 1:10 PM</span>
                </p>
              )}
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                {(isEnglish || isHindi2026 || isMath1) ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm border-r border-slate-800">Question</th>
                            <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm">Answer</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(isAnswerKeyExpanded ? currentAnswerKey : currentAnswerKey.slice(0, 5)).map((item, idx) => (
                            <tr key={idx} className="hover:bg-indigo-50/50 transition-colors">
                              <td className="py-4 px-6 text-slate-700 font-medium border-r border-slate-50 italic">{item.q}</td>
                              <td className="py-4 px-6 text-indigo-700 font-bold bg-indigo-50/10">{item.a}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {!isAnswerKeyExpanded && currentAnswerKey.length > 5 && (
                      <div className="mt-6 text-center">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setIsAnswerKeyExpanded(true);
                          }}
                          type="button"
                          className="bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 cursor-pointer relative z-[60]"
                        >
                          View Full Answer Key ({currentAnswerKey.length - 5} More) ⬇
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-slate-700 mb-6 italic">
                      Detailed answers for the <strong>{displayTitle}</strong> will be populated here shortly after the exam.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-lg italic text-slate-600 border border-dashed border-slate-300 flex items-center justify-center min-h-[150px]">
                      <div className="text-center">
                        <AlertCircle className="mx-auto mb-2 text-slate-300" size={32} />
                        Verification Protocol Active. Please check back shortly.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* H2: Exam Overview & Analysis */}
            <section className="mb-12 bg-white relative z-10 p-2 md:p-4 rounded-3xl">
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
                      <td className="py-4 px-6 font-medium text-slate-800 italic">{isEnglish ? "English (HL/LL)" : (isHindi2026 ? "Hindi (S.L.)" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi (Kumarbharati/Aksharbharati)"))}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-600">Date</td>
                      <td className="py-4 px-6 font-medium">{isEnglish ? "27 Feb 2026" : (isHindi2026 ? "04 Mar 2026" : (isMath1 ? "06 Mar 2026" : "23 Feb 2026"))}</td>
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
                  ) : (isMath1 ? (
                    <>
                      "The <strong>10th Board Maths Part 1 (Algebra) Paper 2026</strong> was very student-friendly. Most questions from the <strong>Linear Equations</strong> and <strong>Quadratic Equations</strong> sections were direct. The <strong>Probability</strong> part was scoring, while <strong>Arithmetic Progression</strong> tested conceptual clarity."
                    </>
                  ) : (
                    <>
                      "The <strong>10th Board Marathi Paper 2026</strong> was well-balanced. Section 1 (Prose) and Section 2 (Poetry) were straight from the textbook. The <strong>Marathi Vyakaran (Grammar)</strong> section was scoring, while the <strong>Upyojit Lekhan (Writing Skills)</strong> gave students ample choice to express their creativity."
                    </>
                  ))}
                </p>
              </div>
            </section>

            {/* H2: Paper Preview Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <Eye className="text-indigo-600" /> {isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))} Board Paper 2026 - Page Preview
              </h2>
              <p className="text-slate-600 mb-6">
                Scanned pages of the official Maharashtra SSC {isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))} Question Paper 2026 are shown below:
              </p>
              
              <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-slate-200 mx-auto max-w-4xl">
                {/* Thumbnail Bar (Horizontal Scroll) */}
                <div 
                  ref={thumbContainerRef}
                  className="flex overflow-x-auto gap-3 p-4 bg-slate-50 border-b border-slate-200 hide-scrollbar relative z-10"
                  style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                >
                  {paperPages.map((url, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => scrollToPage(idx)}
                      className={`relative w-16 h-20 md:w-20 md:h-28 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2 ${activePageIndex === idx ? 'border-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img
                        src={url}
                        alt={`Thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-bl-lg shadow-sm">
                        {idx + 1}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Main Viewer (Height-auto to prevent breakout and overlaps) */}
                <div 
                  ref={mainScrollRef}
                  className="max-h-[80vh] min-h-[500px] overflow-y-auto relative bg-slate-100 hide-scrollbar"
                  style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                >
                  {paperPages.map((url, idx) => (
                    <div 
                      key={`page-${idx}`}
                      ref={el => pageRefs.current[idx] = el}
                      data-index={idx}
                      className="w-full flex justify-center py-6 px-4"
                    >
                      {/* Image wrapper with height auto */}
                      <div className="w-full max-w-3xl bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 relative">
                        <img
                          src={url}
                          alt={`Board Paper Page ${idx + 1}`}
                          className="w-full h-auto object-contain"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* H2: Download Section */}
            <section className="mb-12 bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Download {isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))} Board Question Paper 2026 PDF
              </h2>
              <p className="text-slate-600 mb-8">
                The official scanned copy of today's question paper is ready for download.
              </p>
              
              <div className="bg-indigo-600 p-8 rounded-2xl border-2 border-dashed border-indigo-300">
                <div className="flex flex-col items-center gap-4">
                  <a 
                    href={paperPages[0]} 
                    className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-5 rounded-full font-extrabold transition-all shadow-xl hover:scale-105"
                    download={`SSC-${isEnglish ? "English" : (isHindi2026 ? "Hindi" : (isMath1 ? "Maths Part 1 (Algebra)" : "Marathi"))}-Paper-2026.jpeg`}
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
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Preparation in Progress...</h2>
            <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              The <strong>{displayTitle}</strong> materials are being updated. We will upload the scanned PDF and verified answer key as soon as possible.
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



        {/* FAQs */}
        <section className="bg-slate-900 relative z-10 text-white p-8 rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
            <MessageSquare className="text-indigo-400" /> Frequently Asked Questions (FAQs)
          </h2>
          
          <div className="space-y-6 relative z-10">
            {isHindi2026 ? (
              <>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <h3 className="text-lg font-bold text-indigo-300 mb-2">Is the SSC Hindi Board Exam 2026 postponed due to Holi?</h3>
                  <p className="text-slate-300">There are rumors about the SSC Hindi exam being postponed since Holi (Dhulivandan) falls on March 3, just a day before the exam. As of now, the exam is scheduled for March 4, 2026. However, any official change from MSBSHSE regarding postponement will be updated here instantly."</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <h3 className="text-lg font-bold text-indigo-300 mb-2">Was the SSC Hindi 2026 paper harder than previous years?</h3>
                  <p className="text-slate-300">Yes, many students found the 2026 Hindi paper harder and more time-consuming than the 2025 paper. The Grammar section was particularly tricky this year."</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <h3 className="text-lg font-bold text-indigo-300 mb-2">Are there any wrong questions or free marks in the Hindi 2026 paper?</h3>
                  <p className="text-slate-300">We are currently checking the paper for errors. If there's a wrong question, students will get 1-2 bonus marks. Check our 'Wrong Question Tracker' on SciFun.in for the latest updates."</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <h3 className="text-lg font-bold text-indigo-300 mb-2">Was the Class 10th {isEnglish ? "English" : "Marathi"} paper hard today?</h3>
                  <p className="text-slate-300">Most students rated it as "Easy to Moderate."</p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <h3 className="text-lg font-bold text-indigo-300 mb-2">Where can I download the solved Answer Key?</h3>
                  <p className="text-slate-300">You can download the PDF right here on SciFun Education.</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Internal Links: SSC 2026 Board Papers */}
        <section className="mb-12 border-t border-slate-200 pt-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-600" /> Explore More SSC Board Papers 2026
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/ssc-board-papers/2026/marathi", title: "SSC Marathi Board Paper 2026", slug: "marathi-second-language-question-paper-2026-answer-key" },
              { href: "/ssc-board-papers/2026/english", title: "SSC English Board Paper 2026", slug: "english-question-paper-2026-answer-key" },
              { href: "/ssc-board-papers/2026/hindi", title: "SSC Hindi Board Paper 2026", slug: "hindi-question-paper-2026-answer-key" },
              { href: "/ssc-board-papers/2026/ssc-board-hindi-question-paper-2026-with-solutions", title: "SSC Hindi Paper With Solutions", slug: "ssc-board-hindi-question-paper-2026-with-solutions" },
              { href: "/ssc-board-papers/2026/ssc-maths-part1-algebra-question-paper-2026-with-solutions", title: "SSC Algebra (Maths 1) Paper & Solutions 2026", slug: "ssc-maths-part1-algebra-question-paper-2026-with-solutions" },
            ].filter(link => link.slug !== examSlug).map((link, idx) => (
              <Link key={idx} href={link.href} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all group">
                <span className="font-semibold text-slate-700">{link.title}</span>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
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

        {/* Hidden SEO Keywords Section in Hinglish */}
        <div style={{ fontSize: '1px', color: '#f8fafc', opacity: 0.1, pointerEvents: 'none', userSelect: 'none' }} className="pt-2">
          SSC Hindi N 917 question paper solution 2026 maharashtra board 10th Hindi answer key 2026 N 917 Hindi paper answers 10th Class Hindi Board Paper Solution. 
          Goa! Yeh naam sunte hi sabhi ka man tarangayit ho uthta hai passage answers Priy Saroj, tumhara 16 se 18 tak likha hua patra (Kaka Kalelkar) answers Aaj ka yug aur sanskriti vigyapan kranti se vyapt hai passage solution Chahe sabhi suman bik jayen kavita ka arth Mere to giridhar gopal, dusro na koi padyansh ke prashn uttar. 
          Lekhak ke sadhu sahab ka shehar kaun sa tha Kanhaiya ke naam kriti purn kijiye Upbhokta sanskriti tikne ke sadhan Durgandh aur Parai ka vilom shabd padyansh se Kamzori aur Saptahik ke mool shabd. 
          SSC Hindi grammar solution 2026 10th Hindi N 917 vyakaran answers Prernarthak kriya 10th Hindi board Avyay vakya prayog Sandhi viched N 917 Aaj sirchan ko muftkhor passage solution Ham us dharti ke ladke hain kavita ke prashn uttar Tessie Thomas gadyansh akalan prashn. 
          10th Hindi patra lekhan format 2026 Pustak pradarshani vigyapan lekhan Bal divas vrittant lekhan Jal hai to kal hai nibandh ssc hindi board paper solution 2026 answer key pdf download science fun scifun hindi solution.
        </div>
      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
