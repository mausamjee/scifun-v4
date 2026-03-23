'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Printer,
  Eye,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Settings,
  Calendar,
  Type,
  Edit,
  RefreshCw,
  X,
  Save,
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  Minus,
  Move,
  GripHorizontal,
  Maximize
} from 'lucide-react';
import { CHAPTERS } from '@/data/questions';
import { GenerationConfig, GeneratedPaper, Question } from '@/types';
import { generatePaper, getAlternativeQuestion } from '@/services/generator';
import { fetchQuestionsByChapters } from '@/services/questionService';
import { supabase, aiModel } from '@/lib/clients';

// The "DOM Stamping" Approach: hardcode 15 watermarks exactly 297mm apart
const WatermarkStamps = ({ config, contentRef }: { config: any, contentRef: React.RefObject<HTMLDivElement | null> }) => {
  const [pages, setPages] = useState(1);
  const A4_HEIGHT_MM = 297;
  const size = config.watermarkSize || 40;

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const widthPx = entry.contentRect.width; // This corresponds to 210mm
        const heightPx = entry.contentRect.height;
        if (widthPx > 0) {
          const pageHeightPx = widthPx * (297 / 210);
          const computedPages = Math.max(1, Math.ceil(heightPx / pageHeightPx));
          setPages(computedPages);
        }
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [contentRef]);

  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden print:hidden" aria-hidden="true">
        {Array.from({ length: pages }).map((_, i) => (
          <React.Fragment key={i}>
            {/* Logo 1 for Screen Preview: Positioned at 25% of the page */}
            <div
              className="absolute select-none"
              style={{
                top: `${(i * A4_HEIGHT_MM) + (A4_HEIGHT_MM * 0.25) + (config.watermarkOffsetY || 0)}mm`,
                left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
                transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
                opacity: config.watermarkOpacity
              }}
            >
              {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
                <img
                  src={config.watermarkImage}
                  alt="Watermark"
                  className="object-contain grayscale"
                  style={{
                    maxWidth: `${size * 3}mm`,
                    maxHeight: `${size * 3}mm`
                  }}
                />
              ) : config.watermark ? (
                <span
                  className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
                  style={{ fontSize: `${size * 2}pt` }}
                >
                  {config.watermark}
                </span>
              ) : null}
            </div>

            {/* Logo 2 for Screen Preview: Positioned at 75% of the page */}
            <div
              className="absolute select-none"
              style={{
                top: `${(i * A4_HEIGHT_MM) + (A4_HEIGHT_MM * 0.75) + (config.watermarkOffsetY || 0)}mm`,
                left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
                transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
                opacity: config.watermarkOpacity
              }}
            >
              {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
                <img
                  src={config.watermarkImage}
                  alt="Watermark"
                  className="object-contain grayscale"
                  style={{
                    maxWidth: `${size * 3}mm`,
                    maxHeight: `${size * 3}mm`
                  }}
                />
              ) : config.watermark ? (
                <span
                  className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
                  style={{ fontSize: `${size * 2}pt` }}
                >
                  {config.watermark}
                </span>
              ) : null}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Bulletproof Top Watermark for Print Output ONLY (repeats on every page) */}
      <div
        className="hidden print:block fixed z-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
          top: `calc(25% + ${config.watermarkOffsetY || 0}mm)`,
          left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
          transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
          opacity: config.watermarkOpacity
        }}
      >
        {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
          <img
            src={config.watermarkImage}
            alt="Watermark"
            className="object-contain grayscale"
            style={{
              maxWidth: `${size * 3}mm`,
              maxHeight: `${size * 3}mm`
            }}
          />
        ) : config.watermark ? (
          <span
            className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
            style={{ fontSize: `${size * 2}pt` }}
          >
            {config.watermark}
          </span>
        ) : null}
      </div>

      {/* Bulletproof Bottom Watermark for Print Output ONLY (repeats on every page) */}
      <div
        className="hidden print:block fixed z-0 pointer-events-none select-none"
        aria-hidden="true"
        style={{
           top: `calc(75% + ${config.watermarkOffsetY || 0}mm)`,
           left: `calc(50% + ${config.watermarkOffsetX || 0}mm)`,
           transform: `translate(-50%, -50%) rotate(${config.watermarkRotation}deg)`,
           opacity: config.watermarkOpacity
        }}
      >
        {config.watermarkImage && config.watermarkImage.trim() !== '' ? (
          <img
            src={config.watermarkImage}
            alt="Watermark"
            className="object-contain grayscale"
            style={{
              maxWidth: `${size * 3}mm`,
              maxHeight: `${size * 3}mm`
            }}
          />
        ) : config.watermark ? (
          <span
            className="font-black text-black tracking-[0.1em] uppercase whitespace-nowrap leading-none font-sans"
            style={{ fontSize: `${size * 2}pt` }}
          >
            {config.watermark}
          </span>
        ) : null}
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    mode: 'generator',
    class: '12',
    selectedChapters: [...CHAPTERS],
    totalMarks: 80,
    difficultyFocus: 'Standard',
    headerTitle: 'BOARD QUESTION PAPER : FEBRUARY 2025',
    subHeader: 'Board Model Paper 2025',
    testDate: new Date().toLocaleDateString('en-GB'),
    printTimestamp: new Date().toLocaleString(),
    watermark: 'SCIFUN',
    watermarkImage: undefined,
    watermarkRotation: -45,
    watermarkOpacity: 0.15,
    subject: 'MATHEMATICS AND STATISTICS',
    timeAllowed: '3 Hrs.',
    organizationName: 'ExamCraft - Automatic Question Paper Generator',
    showExamYear: true,
    fontSize: 10.5,
    watermarkSize: 40,
    blueprint: []
  });

  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkConnections = async () => {
      // Check Supabase
      try {
        const { error } = await supabase.from('class12').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setDbStatus('connected');
      } catch (err) {
        console.error("Supabase connection error:", err);
        setDbStatus('error');
      }

      // Check Gemini AI
      try {
        const result = await aiModel.generateContent("Say 'ready'");
        if (result && result.response.text()) {
          setAiStatus('connected');
        }
      } catch (err) {
        console.error("Gemini AI error:", err);
        setAiStatus('error');
      }
    };
    checkConnections();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState<{
    sectionIndex: number;
    questionIndex: number;
    data: Question;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch questions from Supabase based on selected chapters
      const pool = await fetchQuestionsByChapters(config.selectedChapters);
      setQuestionPool(pool);

      if (pool.length === 0) {
        throw new Error("No questions found for the selected chapters.");
      }

      // 2. Generate the paper using the fetched pool
      const newPaper = generatePaper(config, pool);
      setPaper(newPaper);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate paper. Check settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (marks: 20 | 40 | 80) => {
    setConfig({ ...config, totalMarks: marks });
    setPaper(null);
  };

  const handleExamYearToggle = (checked: boolean) => {
    setConfig({ ...config, showExamYear: checked });
    setPaper(null);
    if (paper) {
      setTimeout(() => {
        setPaper({ ...paper });
      }, 50);
    }
  };

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, watermarkImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeWatermarkImage = () => {
    setConfig(prev => ({ ...prev, watermarkImage: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (paper || editingQuestion) {
      const timer = setTimeout(() => {
        if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
          (window as any).MathJax.typesetPromise().catch((err: any) => console.error("MathJax error:", err));
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [paper, showSolutions, editingQuestion]);

  // === PRINT WATERMARK: SVG Background Tiling ===
  // Chrome does NOT repeat position:fixed elements per page. Period.
  // Instead, we use background-image with a repeating SVG tile sized to exactly
  // one A4 content area (210mm x 267mm). CSS background-repeat:repeat-y
  // automatically tiles it once per physical page. This CANNOT fail.
  useEffect(() => {
    const styleId = 'dynamic-print-watermark-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const hasWatermark = config.watermark || config.watermarkImage;
    if (!paper || !hasWatermark) {
      styleEl.textContent = '';
      return;
    }

    // SVG viewBox in mm units matching physical A4 paper size EXACTLY
    // Width: 210mm, Height: 297mm (Crucial: Not content height, but physical height
    // so background-repeat aligns perfectly with page breaks)
    const W = 210;
    const H = 297;
    const cx = W / 2;
    const cy = H / 2;
    const rotation = config.watermarkRotation;
    const opacity = config.watermarkOpacity;

    let svgContent = '';
    const size = config.watermarkSize || 40;

    if (config.watermarkImage) {
      // Image watermark embedded inside SVG
      const imgW = W * (size / 100);
      const imgH = H * (size / 150);
      svgContent = `<image href="${config.watermarkImage}" x="${cx - imgW / 2}" y="${cy - imgH / 2}" width="${imgW}" height="${imgH}" opacity="${opacity}" transform="rotate(${rotation}, ${cx}, ${cy})" preserveAspectRatio="xMidYMid meet"/>`;
    } else {
      // Text watermark
      const escapedText = config.watermark
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      const fontSize = size;
      svgContent = `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" transform="rotate(${rotation}, ${cx}, ${cy})" font-size="${fontSize}" font-weight="900" fill="rgba(0,0,0,${opacity})" font-family="Arial, Helvetica, sans-serif" letter-spacing="3" text-transform="uppercase">${escapedText}</text>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">${svgContent}</svg>`;

    // Base64 encode to safely handle all characters
    const encoded = btoa(unescape(encodeURIComponent(svg)));
    const dataURI = `data:image/svg+xml;base64,${encoded}`;

    styleEl.textContent = `
      @media print {
        .a4-paper {
          background-image: url("${dataURI}") !important;
          background-size: 210mm 297mm !important;
          background-repeat: repeat-y !important;
          background-position: center top !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.textContent = '';
    };
  }, [paper, config.watermark, config.watermarkImage, config.watermarkRotation, config.watermarkOpacity]);

  const toggleChapter = (chapter: string) => {
    setConfig(prev => ({
      ...prev,
      selectedChapters: prev.selectedChapters.includes(chapter)
        ? prev.selectedChapters.filter(c => c !== chapter)
        : [...prev.selectedChapters, chapter]
    }));
  };

  const getRoman = (num: number) => {
    const map: any = { 0: 'i', 1: 'ii', 2: 'iii', 3: 'iv', 4: 'v', 5: 'vi', 6: 'vii', 7: 'viii', 8: 'ix', 9: 'x', 10: 'xi', 11: 'xii' };
    return map[num] || (num + 1).toString();
  };

  // --- Edit Question Logic ---

  const openEditModal = (sectionIdx: number, qIdx: number, q: Question) => {
    setEditingQuestion({
      sectionIndex: sectionIdx,
      questionIndex: qIdx,
      data: { ...q }
    });
  };

  const closeEditModal = () => {
    setEditingQuestion(null);
  };

  const saveQuestion = () => {
    if (!paper || !editingQuestion) return;

    const newSections = [...paper.sections];
    newSections[editingQuestion.sectionIndex].questions[editingQuestion.questionIndex] = editingQuestion.data;

    setPaper({
      ...paper,
      sections: newSections
    });
    closeEditModal();
  };

  const swapWithRandom = () => {
    if (!paper || !editingQuestion || !questionPool.length) return;
    const usedIds: string[] = [];
    paper.sections.forEach(s => s.questions.forEach(q => usedIds.push(q.id)));

    const newQ = getAlternativeQuestion(editingQuestion.data, questionPool, usedIds);
    if (newQ) {
      setEditingQuestion({
        ...editingQuestion,
        data: { ...newQ, marks: editingQuestion.data.marks }
      });
    } else {
      alert("No other unique questions available for this chapter and type.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden print:overflow-visible bg-slate-100">
      {/* Sidebar Controls */}
      <aside className="no-print w-full md:w-96 bg-white border-r border-slate-200 overflow-y-auto h-screen p-6 shrink-0 z-10 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-slate-800 p-2 rounded-lg">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">ExamCraft Pro</h1>
        </div>

        <div className="mb-6 space-y-2">
          {/* Database Status */}
          <div className="p-3 rounded-lg border flex items-center gap-3 bg-slate-50">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-green-500 animate-pulse' :
              dbStatus === 'error' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Database</p>
              <p className="text-xs font-bold text-slate-700">
                {dbStatus === 'connected' ? 'Supabase Online' :
                  dbStatus === 'error' ? 'Connection Failed' : 'Checking...'}
              </p>
            </div>
            {dbStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>

          {/* AI Status */}
          <div className="p-3 rounded-lg border flex items-center gap-3 bg-slate-50">
            <div className={`w-2 h-2 rounded-full ${aiStatus === 'connected' ? 'bg-indigo-500 animate-pulse' :
              aiStatus === 'error' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Intelligence</p>
              <p className="text-xs font-bold text-slate-700">
                {aiStatus === 'connected' ? 'Gemini AI Ready' :
                  aiStatus === 'error' ? 'AI Offline' : 'Checking...'}
              </p>
            </div>
            {aiStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Settings className="w-3 h-3" />
              Paper Personalization
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Organization Name</label>
                <input
                  type="text"
                  value={config.organizationName}
                  onChange={(e) => setConfig({ ...config, organizationName: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded mt-1 outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Exam Title</label>
                <input
                  type="text"
                  value={config.headerTitle}
                  onChange={(e) => setConfig({ ...config, headerTitle: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded mt-1 outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Time</label>
                  <input
                    type="text"
                    value={config.timeAllowed}
                    onChange={(e) => setConfig({ ...config, timeAllowed: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-200 rounded mt-1 outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                  <input
                    type="text"
                    value={config.testDate}
                    onChange={(e) => setConfig({ ...config, testDate: e.target.value })}
                    className="w-full text-xs p-2 border border-slate-200 rounded mt-1 outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Watermark Section */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Watermark Settings</label>

                <div className="mb-3">
                  <input
                    type="text"
                    value={config.watermark}
                    onChange={(e) => setConfig({ ...config, watermark: e.target.value })}
                    placeholder="Enter Text (e.g. DRAFT)"
                    disabled={!!config.watermarkImage}
                    className="w-full text-xs p-2 border border-slate-200 rounded mb-2 disabled:bg-slate-100 disabled:text-slate-400"
                  />

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleWatermarkImageUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-1.5 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1 hover:bg-slate-50"
                    >
                      <Upload className="w-3 h-3" />
                      {config.watermarkImage ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    {config.watermarkImage && (
                      <button
                        onClick={removeWatermarkImage}
                        className="p-1.5 bg-red-50 border border-red-200 rounded text-red-500 hover:bg-red-100"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                        Rotation: <span className="text-slate-600">{config.watermarkRotation}°</span>
                      </label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={config.watermarkRotation}
                        onChange={(e) => setConfig({ ...config, watermarkRotation: parseInt(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                        Opacity: <span className="text-slate-600">{Math.round(config.watermarkOpacity * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.watermarkOpacity}
                        onChange={(e) => setConfig({ ...config, watermarkOpacity: parseFloat(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                        Size: <span className="text-slate-600">{config.watermarkSize || 40}</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="150"
                        value={config.watermarkSize || 40}
                        onChange={(e) => setConfig({ ...config, watermarkSize: parseInt(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                        H-Offset: <span className="text-slate-600">{config.watermarkOffsetX || 0}mm</span>
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={config.watermarkOffsetX || 0}
                        onChange={(e) => setConfig({ ...config, watermarkOffsetX: parseInt(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                        V-Offset: <span className="text-slate-600">{config.watermarkOffsetY || 0}mm</span>
                      </label>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={config.watermarkOffsetY || 0}
                        onChange={(e) => setConfig({ ...config, watermarkOffsetY: parseInt(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Size Control */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 mb-2">
                  <Type className="w-3 h-3" /> Paper Font Size (pt)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfig(c => ({ ...c, fontSize: Math.max(8, c.fontSize - 0.5) }))}
                    className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50"
                  >
                    <Minus className="w-3 h-3 text-slate-600" />
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    value={config.fontSize}
                    onChange={(e) => setConfig({ ...config, fontSize: parseFloat(e.target.value) || 10.5 })}
                    className="flex-1 text-center font-bold text-sm py-1 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <button
                    onClick={() => setConfig(c => ({ ...c, fontSize: Math.min(16, c.fontSize + 0.5) }))}
                    className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50"
                  >
                    <Plus className="w-3 h-3 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={config.showExamYear}
                    onChange={(e) => handleExamYearToggle(e.target.checked)}
                    className="w-4 h-4 text-slate-800 rounded border-slate-300 focus:ring-slate-500"
                  />
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900">Show Exam Year Tag [2025 M]</span>
                </label>
              </div>
            </div>
          </section>

          <div className="pt-2 space-y-3">
            <button
              onClick={handleGenerate}
              disabled={loading || config.selectedChapters.length === 0}
              className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <FileText className="w-5 h-5" />}
              Generate Continuous Paper
            </button>

            {paper && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex flex-col items-center justify-center py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold">Print Paper</span>
                </button>
                <button
                  onClick={() => setShowSolutions(!showSolutions)}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all border shadow-sm ${showSolutions ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                >
                  <Eye className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold">{showSolutions ? 'Hide Keys' : 'Show Keys'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 overflow-y-auto p-0 md:p-8 print:p-0 print:overflow-visible print:bg-white bg-slate-200">
        {!paper ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <BookOpen className="w-12 h-12 opacity-20" />
            <p className="text-sm font-bold opacity-30">Configure settings to generate paper</p>
          </div>
        ) : (
          <div className="paper-container relative">
            <div
              ref={paperRef}
              className="a4-paper shadow-2xl print:shadow-none font-serif leading-[1.3] relative overflow-hidden print:overflow-visible"
              style={{ fontSize: `${config.fontSize}pt` }}
            >



              {/* ===== DOM STAMPING WATERMARKS ===== */}
              <WatermarkStamps config={config} contentRef={paperRef} />

              <div className="relative z-10 paper-content">
                {/* Fake Browser Headers (Printed) */}
                      <div className="flex justify-between text-[9px] text-slate-400 mb-2 border-b border-slate-100 pb-1 italic">
                        <span>{config.printTimestamp}</span>
                        <span className="font-bold">{config.organizationName}</span>
                      </div>

                      {/* Header Visual Style */}
                      <div className="text-center mb-4 border-b-2 border-double border-slate-900 pb-3">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-1">{config.headerTitle}</h2>
                        <h3 className="text-lg font-black uppercase mb-2">{config.subject}</h3>
                        <div className="flex justify-between items-end text-[10pt] font-bold border-t border-slate-900 pt-1.5 px-1">
                          <div className="text-left space-y-0.5">
                            <p>Time: {config.timeAllowed}</p>
                            <p>Date: {config.testDate}</p>
                          </div>
                          <div className="text-right">
                            <p>Max. Marks: {paper.totalMarks}</p>
                          </div>
                        </div>
                      </div>

                      {/* Continuous Instructions Section */}
                      <div className="mb-4 text-[0.9em] border-b border-slate-200 pb-2">
                        <h3 className="font-bold italic mb-0.5 text-[0.95em]">General instructions:</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 ml-2">
                          <p>(1) <strong>Sec A:</strong> Q.1(MCQ 8x2m), Q.2(VSA 4x1m)</p>
                          <p>(2) <strong>Sec B:</strong> SA-I (Attempt any 8 of 12)</p>
                          <p>(3) <strong>Sec C:</strong> SA-II (Attempt any 8 of 12)</p>
                          <p>(4) <strong>Sec D:</strong> LA (Attempt any 5 of 8)</p>
                          <p>(5) Log table allowed. No calculators.</p>
                          <p>(6) Right figures indicate full marks.</p>
                        </div>
                      </div>

                      {/* Exam Content - CONTINUOUS MANNER */}
                      <div className="space-y-2">
                        {paper.sections.map((section, sectionIdx) => {
                          const isSectionA = section.name.includes('SECTION - A') || section.isSubQuestionGroup;
                          const showHeader = !section.isSubQuestionGroup || section.name === 'Q.1';

                          return (
                            <div key={section.name + sectionIdx} className="">
                              {showHeader && (
                                <div className="text-center mb-2 mt-2">
                                  <h4 className="text-[1.1em] font-black tracking-[0.15em] border-y border-slate-300 py-0.5 uppercase">
                                    {isSectionA ? 'SECTION - A' : section.name}
                                  </h4>
                                </div>
                              )}

                              <div className="flex justify-between items-baseline mb-2 bg-slate-50/50 px-1 border-b border-slate-100">
                                <div className="flex gap-2 items-baseline">
                                  <span className="font-bold text-[0.95em]">{section.isSubQuestionGroup ? section.name : ''}</span>
                                  <p className="font-bold text-[0.9em]">{section.description}</p>
                                </div>
                                <span className="font-bold text-[0.9em] shrink-0">[{section.requiredCount * section.marksPerQuestion}]</span>
                              </div>

                              <div className="space-y-1">
                                {section.questions.map((q, qIdx) => {
                                  let qLabel = "";
                                  const marksLabel = `(${q.marks})`;

                                  if (section.isSubQuestionGroup) {
                                    qLabel = getRoman(qIdx) + ".";
                                  } else {
                                    let start = 3;
                                    if (section.name.includes('SECTION - C')) start = 15;
                                    if (section.name.includes('SECTION - D')) start = 27;
                                    qLabel = `Q.${start + qIdx}.`;
                                  }

                                  return (
                                    <div key={q.id} className="page-break-avoid group relative pb-1 hover:bg-slate-50 transition-colors pr-8">
                                      {/* Edit Button - Visible on Hover (Screen Only) */}
                                      <button
                                        onClick={() => openEditModal(sectionIdx, qIdx, q)}
                                        className="absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-blue-600 bg-white shadow-sm border rounded-full no-print z-10"
                                        title="Edit or Swap Question"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>

                                      <div className="flex gap-3 items-start">
                                        <span className="font-bold w-10 shrink-0 text-center">{qLabel}</span>
                                        <div className="flex-1 min-w-0">
                                          <div className="leading-tight mb-1" dangerouslySetInnerHTML={{ __html: q.content }} />

                                          {q.imageUrl && (
                                            <div className="my-2">
                                              <img
                                                src={q.imageUrl}
                                                alt="Figure"
                                                className="max-w-[80%] md:max-w-[50%] h-auto mx-auto border border-slate-100 shadow-sm"
                                                onError={(e) => {
                                                  (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                              />
                                            </div>
                                          )}

                                          {q.options && (
                                            <div className="mt-1 ml-1">
                                              <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-[0.95em]">
                                                {q.options.map((opt, oIdx) => (
                                                  <div key={oIdx} className="flex gap-1.5 items-start">
                                                    <span className="font-bold shrink-0">({String.fromCharCode(65 + oIdx)})</span>
                                                    <span className="flex-1 break-words" dangerouslySetInnerHTML={{ __html: opt }} />
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {showSolutions && (
                                            <div className="mt-1 p-1.5 bg-amber-50 border-l border-amber-300 text-[0.9em] italic">
                                              <span className="font-bold text-amber-800 mr-2 uppercase">Ans:</span>
                                              <span dangerouslySetInnerHTML={{ __html: q.solution }} />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-baseline gap-1.5 shrink-0 ml-1 self-end mb-0.5">
                                          {config.showExamYear && q.examYear && <span className="text-[7pt] text-slate-400 font-bold whitespace-nowrap">[{q.examYear}]</span>}
                                          <span className="font-bold text-[0.9em]">{marksLabel}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 text-center text-slate-300 text-[8pt] italic border-t border-slate-100 pt-2 flex justify-between items-center">
                        <span>{config.printTimestamp}</span>
                        <span className="tracking-widest uppercase font-bold text-slate-200">--- End of Paper ---</span>
                        <span>Page 1 of 1</span>
                      </div>
              </div>
              {/* ===== END CONTENT WRAPPER ===== */}
            </div>
          </div>
        )}
      </main>

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Edit Question
              </h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Question Text */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question Content (LaTeX Supported)</label>
                <textarea
                  value={editingQuestion.data.content}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, data: { ...editingQuestion.data, content: e.target.value } })}
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm font-mono h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" />
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/image.png"
                    value={editingQuestion.data.imageUrl || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, data: { ...editingQuestion.data, imageUrl: e.target.value } })}
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                {editingQuestion.data.imageUrl && (
                  <div className="mt-2 p-2 border border-dashed rounded bg-slate-50 text-center">
                    <p className="text-xs text-slate-400 mb-2">Image Preview:</p>
                    <img
                      src={editingQuestion.data.imageUrl}
                      alt="Preview"
                      className="max-h-40 mx-auto object-contain"
                      onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+Image+URL"}
                    />
                  </div>
                )}
              </div>

              {/* Random Swap Option */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-700">Swap Question</h4>
                  <p className="text-xs text-slate-500">Replace this with a random available question from the same chapter/type.</p>
                </div>
                <button
                  onClick={swapWithRandom}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-slate-600" />
                  Swap Random
                </button>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
                className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .paper-container {
          padding: 1rem;
          display: flex;
          justify-content: center;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
