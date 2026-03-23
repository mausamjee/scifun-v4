import React, { useState, useRef } from 'react';
import { Printer, ArrowLeft, Eye, Trash2 } from 'lucide-react';
import { GeneratedPaper, GenerationConfig, Question } from '@/types';
import { PaperPreview } from './PaperPreview';

interface Step3PrintStudioProps {
 paper: GeneratedPaper;
 config: GenerationConfig;
 setConfig: (config: GenerationConfig) => void;
 onBack: () => void;
 onEditQuestion: (sectionIndex: number, questionIndex: number, data: Question) => void;
}

export const Step3PrintStudio: React.FC<Step3PrintStudioProps> = ({
 paper,
 config,
 setConfig,
 onBack,
 onEditQuestion
}) => {
 const [showSolutions, setShowSolutions] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   const reader = new FileReader();
   reader.onloadend = () => {
    setConfig({ ...config, watermarkImage: reader.result as string });
   };
   reader.readAsDataURL(file);
  }
 };

 return (
  <div className="flex flex-col lg:flex-row h-screen no-scrollbar relative print:block print:h-auto print:overflow-visible">

   {/* Sidebar Controls */}
   <aside className="no-print w-full lg:w-[400px] h-[300px] lg:h-full bg-slate-900 text-white overflow-y-auto lg:shrink-0 flex flex-col custom-scrollbar border-l border-white/5">
    <div className="p-8 border-b border-white/5 bg-slate-950 flex items-center justify-between">
     <div className="flex items-center gap-3">
      <Printer className="text-blue-400 w-6 h-6" />
      <h3 className="text-xl font-black uppercase tracking-tighter">Print Studio</h3>
     </div>
     <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 transition-colors">
      <ArrowLeft className="w-6 h-6" />
     </button>
    </div>

    <div className="p-8 space-y-10 flex-1">
     <div className="grid grid-cols-2 gap-4">
      <button onClick={() => window.print()} className="flex flex-col items-center justify-center py-6 bg-blue-600 hover:bg-blue-700 rounded-3xl transition-all shadow-xl group">
       <Printer className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
       <span className="text-[10px] font-black uppercase tracking-widest">Print</span>
      </button>
      <button onClick={() => setShowSolutions(!showSolutions)} className={`flex flex-col items-center justify-center py-6 rounded-3xl transition-all border-2 border-white/10 group ${showSolutions ? 'bg-amber-500 border-amber-500' : 'hover:bg-white/5'}`}>
       <Eye className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
       <span className="text-[10px] font-black uppercase tracking-widest">{showSolutions ? 'Hide Key' : 'Show Key'}</span>
      </button>
     </div>

     <div className="bg-slate-800 border border-white/5 rounded-[2rem] p-6 space-y-6">
      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Paper Settings</h4>

      <div>
       <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Font Size</span>
        <span className="text-xs font-black text-white">{config.fontSize}pt</span>
       </div>
       <input
        type="range"
        min="8"
        max="16"
        step="0.5"
        value={config.fontSize}
        onChange={e => setConfig({ ...config, fontSize: parseFloat(e.target.value) })}
        className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer"
       />
      </div>
     </div>

     <div className="bg-slate-800 border border-white/5 rounded-[2rem] p-6 space-y-6">
      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Watermark</h4>
      <input type="text" value={config.watermark} onChange={e => setConfig({ ...config, watermark: e.target.value })} placeholder="Text" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 text-white" />

      <div className="flex gap-3">
       <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Upload Logo</button>
       <input type="file" className="hidden" ref={fileInputRef} onChange={handleWatermarkImageUpload} />
       {config.watermarkImage && <button onClick={() => setConfig({ ...config, watermarkImage: undefined })} className="p-3 bg-red-500/10 text-red-400 rounded-xl"><Trash2 className="w-4 h-4" /></button>}
      </div>

      <div className="space-y-4">
       <div>
         <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] font-bold text-slate-400 uppercase">Rotation</span>
           <span className="text-xs font-black text-white">{config.watermarkRotation}°</span>
         </div>
         <input type="range" min="-180" max="180" value={config.watermarkRotation} onChange={e => setConfig({ ...config, watermarkRotation: parseInt(e.target.value) })} className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer" />
       </div>
       <div>
         <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] font-bold text-slate-400 uppercase">Opacity</span>
           <span className="text-xs font-black text-white">{Math.round(config.watermarkOpacity * 100)}%</span>
         </div>
         <input type="range" min="0" max="1" step="0.05" value={config.watermarkOpacity} onChange={e => setConfig({ ...config, watermarkOpacity: parseFloat(e.target.value) })} className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer" />
       </div>
       <div>
         <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] font-bold text-slate-400 uppercase">Size</span>
           <span className="text-xs font-black text-white">{config.watermarkSize || 40}</span>
         </div>
         <input type="range" min="10" max="150" value={config.watermarkSize || 40} onChange={e => setConfig({ ...config, watermarkSize: parseInt(e.target.value) })} className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer" />
       </div>
       <div>
         <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] font-bold text-slate-400 uppercase">H-Offset (Horizontal)</span>
           <span className="text-xs font-black text-white">{config.watermarkOffsetX || 0}mm</span>
         </div>
         <input type="range" min="-100" max="100" value={config.watermarkOffsetX || 0} onChange={e => setConfig({ ...config, watermarkOffsetX: parseInt(e.target.value) })} className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer" />
       </div>
       <div>
         <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] font-bold text-slate-400 uppercase">V-Offset (Vertical)</span>
           <span className="text-xs font-black text-white">{config.watermarkOffsetY || 0}mm</span>
         </div>
         <input type="range" min="-150" max="150" value={config.watermarkOffsetY || 0} onChange={e => setConfig({ ...config, watermarkOffsetY: parseInt(e.target.value) })} className="w-full accent-blue-500 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer" />
       </div>
      </div>
     </div>
    </div>
   </aside>

   {/* Paper Preview */}
   <div className="flex-1 bg-slate-200 overflow-y-auto no-scrollbar print:overflow-visible print:h-auto print:block print:w-full print:m-0 print:p-0 print:bg-white">
    <div className="flex justify-center p-8 print:p-0">
     <PaperPreview
      paper={paper}
      config={config}
      showSolutions={showSolutions}
      onEditQuestion={onEditQuestion}
     />
    </div>
   </div>
  </div>
 );
};
