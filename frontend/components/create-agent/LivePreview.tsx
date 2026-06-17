import React from 'react';
import { AgentBackendPayload } from '../../lib/types/agent';
import { Bot, Sparkles, User, Briefcase, Smile, Zap, Globe, MessageSquare, Database, CheckCircle2, AlertCircle, Phone, Terminal } from 'lucide-react';

interface Props {
  payload: AgentBackendPayload;
}

const AvatarIconMap: Record<string, React.ElementType> = {
  Bot, Sparkles, User, Briefcase, Smile, Zap
};

export default function LivePreview({ payload }: Props) {
  const { name, role, avatar } = payload.agent_details;
  const SelectedAvatar = AvatarIconMap[avatar] || Bot;

  const hasKnowledge = payload.knowledge_base.website_urls.length > 0 || payload.knowledge_base.files.length > 0;
  
  const activeChannels = Object.entries(payload.channels).filter(([_, active]) => active).map(([name]) => name);

  const getChannelIcon = (name: string) => {
    switch (name) {
      case 'website': return <Globe className="w-4 h-4 text-indigo-400" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-400" />;
      case 'telegram': return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'voice': return <Phone className="w-4 h-4 text-rose-400" />;
      case 'api': return <Terminal className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  return (
    <div className="sticky top-28 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl hidden lg:block">
      <div className="p-4 border-b border-white/5 bg-slate-950/50">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          Live Agent Preview
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </h2>
      </div>

      <div className="p-6">
        {/* Avatar & Name */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30 text-purple-400">
            {avatar && !AvatarIconMap[avatar] ? (
              <img src={avatar.startsWith('http') ? avatar : `http://localhost:8000/api/agents/files/${avatar.split(/[\\\\/]/).pop()}`} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <SelectedAvatar className="w-8 h-8" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{name || 'Unnamed Agent'}</h3>
            <p className="text-sm text-purple-400">{role || 'Pending Role'}</p>
          </div>
        </div>

        {/* Configurations list */}
        <div className="space-y-6">
          
          {/* Status */}
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">Status</span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 w-fit">
                <AlertCircle className="w-3.5 h-3.5" /> Draft
              </span>
            </div>
          </div>

          {/* Channels */}
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">Channels</span>
            {activeChannels.length > 0 ? (
              <div className="flex gap-2 text-slate-300 flex-wrap">
                {activeChannels.map(c => (
                  <div key={c} className="p-2 rounded bg-white/5 border border-white/10" title={c}>
                    {getChannelIcon(c)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-600">No channels selected</div>
            )}
          </div>

          {/* Knowledge */}
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-2">Knowledge Sources</span>
            {hasKnowledge ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>RAG Pipeline Ready</span>
                </div>
                <span className="text-xs text-slate-500">{payload.knowledge_base.website_urls.length} URLs attached</span>
              </div>
            ) : (
              <div className="text-sm text-slate-600">Pending upload</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
