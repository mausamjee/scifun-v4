'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Link as LinkIcon, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check, 
  Edit3, 
  PlusCircle, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Download,
  Trash2,
  Type
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function LinkConvertPage() {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [linkName, setLinkName] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [deletingSlug, setDeletingSlug] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setInitialLoading(true);
    try {
      const res = await fetch('/api/links/list');
      const data = await res.json();
      if (data.links) setLinks(data.links);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/links/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl, customSlug, linkName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');

      setLinks([data.link, ...links]);
      setDestinationUrl('');
      setCustomSlug('');
      setLinkName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingLink) return;

    try {
      const res = await fetch('/api/links/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shortSlug: editingLink.shortSlug, 
          newDestinationUrl: editingLink.destinationUrl,
          newLinkName: editingLink.linkName 
        }),
      });

      if (!res.ok) throw new Error('Failed to update');

      setLinks(links.map(l => l.shortSlug === editingLink.shortSlug ? editingLink : l));
      setEditingLink(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    
    setDeletingSlug(slug);
    try {
      const res = await fetch('/api/links/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortSlug: slug }),
      });

      if (!res.ok) throw new Error('Failed to delete');

      setLinks(links.filter(l => l.shortSlug !== slug));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingSlug(null);
    }
  };

  const copyToClipboard = (slug) => {
    const url = `${window.location.origin}/l/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const downloadQR = (qrData, slug, name) => {
    const link = document.createElement('a');
    link.href = qrData;
    link.download = `qr_${name || slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150 brightness-150" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">DynamicLink</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <span className="hidden sm:inline">SciFun Pro Tool</span>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-blue-400">Admin Only</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6 pt-4">
            <h1 className="text-5xl font-black leading-tight">
              Shorten links,<br />
              <span className="text-blue-500">Redirect instantly.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Create permanent short links with live-editable destinations and auto-generated high-quality QR codes. 
            </p>
          </div>

          <section className="lg:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <form onSubmit={handleGenerate} className="space-y-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group/input md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Type className="w-3 h-3" /> Link Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 10th Math Chapter 1 Solution"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all text-lg placeholder:text-slate-700"
                  />
                </div>
                
                <div className="space-y-2 group/input md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <ExternalLink className="w-3 h-3" /> Target Destination URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://my-long-content.com/path"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all text-lg placeholder:text-slate-700"
                  />
                </div>
                
                <div className="space-y-2 group/input md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Edit3 className="w-3 h-3" /> Custom Slug (Optional)
                  </label>
                  <div className="flex items-center bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all font-mono">
                    <span className="text-slate-600 pr-1 select-none whitespace-nowrap">scifun.in/l/</span>
                    <input
                      type="text"
                      placeholder="vicky-link"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none text-lg placeholder:text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Create Dynamic Link <ArrowRight className="w-5 h-5" /></>}
              </button>
              
              {error && (
                <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
            </form>
          </section>
        </div>

        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-3xl font-black flex items-center gap-3">
              Dynamic Library
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">{links.length} Active</span>
            </h2>
          </div>

          {initialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
              {[1, 2].map(i => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              {links.map((link) => (
                <div 
                  key={link.shortSlug} 
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-6 hover:bg-white/10 transition-all duration-500"
                >
                  <div className="flex items-start gap-8">
                    <div className="relative flex-shrink-0 group/qr">
                      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover/qr:opacity-40 transition duration-500" />
                      <div className="relative bg-white p-3 rounded-[1.5rem] shadow-xl transition duration-500 group-hover/qr:scale-105 group-hover/qr:-rotate-2">
                        <Image 
                          src={link.qrData} 
                          alt="QR Code" 
                          width={120} 
                          height={120} 
                          className="rounded-lg"
                        />
                        <button 
                          onClick={() => downloadQR(link.qrData, link.shortSlug, link.linkName)}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[1.5rem] opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300"
                          title="Download QR Code"
                        >
                          <Download className="w-8 h-8 text-white drop-shadow-lg" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-grow space-y-4 pt-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/70">Link Mapping</span>
                          <span className="text-[10px] font-bold text-slate-600">{new Date(link.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 group/slug">
                          <h3 className="text-2xl font-mono font-bold text-white tracking-tighter">/{link.shortSlug}</h3>
                          <button 
                            onClick={() => copyToClipboard(link.shortSlug)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"
                            title="Copy link"
                          >
                            {copiedSlug === link.shortSlug ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70">Live Destination</span>
                        <p className="text-slate-400 text-sm truncate max-w-[180px] font-medium leading-relaxed">
                          {link.destinationUrl}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer group/name" onClick={() => setEditingLink({...link})}>
                       <span className="text-lg font-bold truncate max-w-[250px]">{link.linkName || 'Untitled Link'}</span>
                       <Edit3 className="w-4 h-4 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                    <button 
                      onClick={() => setEditingLink({...link})}
                      className="flex-[4] flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-blue-600 hover:text-white border border-white/5 hover:border-blue-500 rounded-2xl text-xs font-bold transition-all group/btn"
                    >
                      <PlusCircle className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" /> 
                      Manage Destination
                    </button>
                    <a 
                      href={link.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                    <button 
                      onClick={() => handleDelete(link.shortSlug)}
                      disabled={deletingSlug === link.shortSlug}
                      className="flex-1 flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-rose-600 border border-white/5 hover:border-rose-500 rounded-2xl transition-all group/trash"
                    >
                      {deletingSlug === link.shortSlug ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-slate-500 group-hover/trash:text-white" />}
                    </button>
                  </div>
                </div>
              ))}

              {links.length === 0 && (
                <div className="md:col-span-2 text-center py-24 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10">
                    <QrCode className="w-8 h-8 text-slate-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold">No active links in your workspace</p>
                    <p className="text-slate-600 text-sm">Enter a URL above to generate your first dynamic QR code</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {editingLink && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-w-xl w-full space-y-8 shadow-3xl shadow-black relative overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -z-10 rounded-full" />
              
              <div className="space-y-2">
                <h3 className="text-3xl font-black">Link Settings</h3>
                <p className="text-slate-400 leading-relaxed">
                  Update mapping for <span className="text-blue-500 font-mono font-bold">/{editingLink.shortSlug}</span>.
                </p>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Link Name</label>
                    <input
                      type="text"
                      required
                      value={editingLink.linkName}
                      onChange={(e) => setEditingLink({...editingLink, linkName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-lg font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Library Target</label>
                    <input
                      type="url"
                      required
                      value={editingLink.destinationUrl}
                      onChange={(e) => setEditingLink({...editingLink, destinationUrl: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all text-lg font-medium"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setEditingLink(null)}
                    className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all border border-white/5"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
                  >
                    Sync Updates
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="max-w-5xl mx-auto pt-12 pb-12 text-center text-slate-600 text-[10px] font-medium uppercase tracking-[0.3em]">
        &copy; 2026 DynamicLink System • Optimized for SciFun Education
      </footer>
    </main>
  );
}
