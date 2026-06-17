import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentBackendPayload } from '../../../lib/types/agent';
import { Bot, Sparkles, User, Briefcase, Smile, Zap, X, Upload } from 'lucide-react';

interface Props {
  payload: AgentBackendPayload;
  updatePayload: (data: Partial<AgentBackendPayload>) => void;
}

const avatars = [
  { id: 'Bot', icon: Bot },
  { id: 'Sparkles', icon: Sparkles },
  { id: 'User', icon: User },
  { id: 'Briefcase', icon: Briefcase },
  { id: 'Smile', icon: Smile },
  { id: 'Zap', icon: Zap },
];

const categories = ['Sales', 'Support', 'HR', 'Marketing', 'Custom'];

export default function Step1Details({ payload, updatePayload }: Props) {
  const { name, description, role, avatar } = payload.agent_details;
  const [previewImage, setPreviewImage] = useState<{ url: string; file: File } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeInstructions = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const { supabase } = await import('../../../src/supabaseClient');
      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes.data.session?.access_token;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE_URL}/api/agents/analyze-instructions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ description })
      });
      const data = await res.json();
      if (data.success && data.optimized_description) {
        handleChange('description', data.optimized_description);
      }
    } catch (err) {
      console.error('Instruction analysis failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    updatePayload({
      agent_details: { ...payload.agent_details, [field]: value }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewImage({ url, file });
    }
  };

  const handleSaveAvatar = async () => {
    if (!previewImage) return;
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('files', previewImage.file);
    
    try {
      const { supabase } = await import('../../../src/supabaseClient');
      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes.data.session?.access_token;

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE_URL}/api/agents/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (data.success && data.file_paths) {
        handleChange('avatar', data.file_paths[0]);
      }
    } catch (err) {
      console.error('Avatar upload failed', err);
    } finally {
      setIsUploading(false);
      setPreviewImage(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Agent Details</h2>
        <p className="text-slate-400">Give your AI agent an identity and describe its core purpose.</p>
      </div>

      <div className="space-y-6 bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Agent Avatar</label>
          <div className="flex flex-wrap items-center gap-4">
            {avatar && !avatars.some(a => a.id === avatar) ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <img src={avatar.startsWith('http') ? avatar : `http://localhost:8000/api/agents/files/${avatar.split(/[\\\\/]/).pop()}`} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }} />
              </div>
            ) : null}

            {avatars.map((a) => (
              <button
                key={a.id}
                onClick={() => handleChange('avatar', a.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  avatar === a.id 
                    ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                    : 'bg-slate-950 border border-white/10 text-slate-400 hover:border-purple-500/50 hover:text-purple-300'
                }`}
              >
                <a.icon className="w-5 h-5" />
              </button>
            ))}

            <label className="w-12 h-12 rounded-xl bg-slate-950 border border-dashed border-white/20 text-slate-400 hover:border-purple-500 hover:text-purple-400 flex items-center justify-center transition-all cursor-pointer relative overflow-hidden group">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
              <span className="text-xl group-hover:scale-110 transition-transform">+</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Agent Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. SalesOS Assistant"
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Category/Role */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <select
              value={role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">Description / Instructions</label>
            <button 
              onClick={handleAnalyzeInstructions}
              disabled={isAnalyzing || !description.trim()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAnalyzing ? 'Optimizing...' : 'Optimize Instructions'}
            </button>
          </div>
          <textarea 
            value={description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe what this agent does and how it should behave..."
            className="w-full h-32 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
          />
        </div>

      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-bold text-white">Avatar Preview</h3>
              
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                <img src={previewImage.url} alt="Crop Preview" className="w-full h-full object-cover" />
              </div>
              
              <p className="text-xs text-slate-400 text-center px-4">
                This image will be cropped into a circle. Make sure the subject is centered.
              </p>

              <button 
                onClick={handleSaveAvatar}
                disabled={isUploading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {isUploading ? 'Uploading...' : 'Save Avatar'}
                {!isUploading && <Upload className="w-4 h-4" />}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
