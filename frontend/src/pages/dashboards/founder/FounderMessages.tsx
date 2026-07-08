import React, { useState, useMemo, useEffect } from 'react';
import { Search, Send, ShieldAlert, ChevronDown } from 'lucide-react';
import { useChat } from '../../../context/ChatContext';
import type { Conversation } from '../../../context/ChatContext';
import { useAuth } from '../../../context/AuthContext';

const SharedMessages: React.FC = () => {
  const { user } = useAuth();
  const { conversations, messages, sendMessage, sendAdminMessage } = useChat();
  
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  
  // Admin selected target for moderation messages
  const [adminTargetUserId, setAdminTargetUserId] = useState<string>('');

  // Filter conversations for the current user (admin sees all)
  const myConversations = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return conversations;
    // In our mock context, participants have role: 'founder', 'mentor', 'investor'.
    // The current user has role user.role. We'll match on role since id might not perfectly align in mocks.
    return conversations.filter(c => c.participants.some(p => p.role === user.role));
  }, [conversations, user]);

  const [active, setActive] = useState<number>(myConversations[0]?.id || 0);

  // If the active conversation disappears (e.g. log in as someone else), reset active
  useEffect(() => {
    if (myConversations.length > 0 && !myConversations.some(c => c.id === active)) {
      setActive(myConversations[0].id);
    }
  }, [myConversations, active]);

  const filteredConvs = myConversations.filter(c => {
    // Determine the "other" participant's name to match against search
    const other = c.participants.find(p => p.role !== user?.role) || c.participants[0];
    return other?.name.toLowerCase().includes(search.toLowerCase());
  });

  const activeConv = myConversations.find(c => c.id === active);
  
  // Set default admin target when active conversation changes
  useEffect(() => {
    if (user?.role === 'admin' && activeConv) {
       // By default, target the non-founder if possible, or just the first participant
       const nonFounder = activeConv.participants.find(p => p.role !== 'founder');
       setAdminTargetUserId(nonFounder ? nonFounder.role : activeConv.participants[0].role); // using role as id fallback
    }
  }, [active, activeConv, user]);

  const activeMessages = messages[active] || [];
  
  // Filter messages based on admin moderation logic
  const visibleMessages = useMemo(() => {
    if (!user) return [];
    return activeMessages.filter(m => {
      // If it's a standard message, everyone in the chat can see it
      if (!m.targetUserId) return true;
      // If it's a targeted message, only the admin and the target user can see it
      // Using role for matching due to mock data
      return user.role === 'admin' || user.role === m.targetUserId || user.id === m.targetUserId;
    });
  }, [activeMessages, user]);

  const send = () => {
    if (!input.trim() || !user || !activeConv) return;
    
    // For mock context, using role as ID if real ID isn't mapped
    const currentId = user.id || user.role; 
    const currentName = user.name || 'User';
    
    if (user.role === 'admin') {
      sendAdminMessage(active, currentId, currentName, input, adminTargetUserId);
    } else {
      sendMessage(active, currentId, currentName, user.role, input);
    }
    
    setInput('');
  };

  if (myConversations.length === 0) {
    return (
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Support Center Inbox' : 'Messages'}
          </h1>
        </div>
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
          No conversations found.
        </div>
      </div>
    );
  }

  if (!activeConv) return null;

  // Determine the display details for the conversation list item
  const getDisplayDetails = (c: Conversation) => {
    // If admin, show both participants
    if (user?.role === 'admin') {
      return {
        name: `${c.participants[0].name} & ${c.participants[1].name}`,
        role: `${c.participants[0].role} / ${c.participants[1].role}`,
        avatar: '🤝'
      };
    }
    // Otherwise, show the other participant
    const other = c.participants.find(p => p.role !== user?.role) || c.participants[0];
    return {
      name: other.name,
      role: other.role,
      avatar: other.avatar
    };
  };

  const activeDisplay = getDisplayDetails(activeConv);

  return (
    <div className="animate-fade-in-up flex flex-col h-[calc(100vh-160px)] min-h-[500px]">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'Support Center Inbox' : 'Messages'}
        </h1>
        <p className="text-gray-500 mt-1">
          {user?.role === 'admin' 
            ? 'Monitor and moderate platform communications.' 
            : 'Chat with your connections in real time.'}
        </p>
      </div>

      <div className="flex-1 flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-0">
        {/* Left panel */}
        <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search messages..." 
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5B21B6]" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredConvs.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No messages found.</div>
            ) : filteredConvs.map(c => {
              const display = getDisplayDetails(c);
              const lastMsg = messages[c.id]?.[messages[c.id].length - 1];
              return (
                <button key={c.id} onClick={() => setActive(c.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors ${active === c.id ? 'bg-purple-50/70' : ''}`}>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}>{display.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-sm font-bold text-gray-900 truncate">{display.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {lastMsg ? (lastMsg.targetUserId ? '⚠️ Admin Message' : lastMsg.text) : 'No messages'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeConv.gradient} flex items-center justify-center text-white font-bold shadow-sm`}>{activeDisplay.avatar}</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{activeDisplay.name}</p>
              <p className="text-xs text-gray-400 capitalize">{activeDisplay.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {visibleMessages.map((m, i) => {
              // Determine if message is from 'me' based on role (for mock simplicity)
              const isMe = user?.role === m.senderRole;
              const isAdminMsg = m.targetUserId != null;

              return (
                <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender name for clarity in multi-user chats */}
                  {!isMe && <span className="text-[10px] text-gray-400 mb-1 ml-1">{m.senderName}</span>}
                  
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isAdminMsg 
                      ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-sm' // Admin message style
                      : isMe 
                        ? 'bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white rounded-tr-sm' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {isAdminMsg && (
                      <div className="flex items-center gap-1.5 mb-1 text-red-600 font-bold text-xs">
                        <ShieldAlert size={12} />
                        Admin Moderation
                      </div>
                    )}
                    {m.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1">{m.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 items-center">
            {user?.role === 'admin' && (
              <div className="relative">
                <select 
                  value={adminTargetUserId}
                  onChange={(e) => setAdminTargetUserId(e.target.value)}
                  className="appearance-none bg-red-50 border border-red-200 text-red-700 text-xs font-bold py-3 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {/* Option for exact match mock role since IDs are simplified */}
                  {activeConv.participants.map(p => (
                    <option key={p.id} value={p.role}>Direct to: {p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none" size={14} />
              </div>
            )}
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={user?.role === 'admin' ? "Send a moderation message..." : `Message...`}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5B21B6]"
            />
            <button onClick={send} className={`px-4 py-3 rounded-xl transition-colors shadow ${user?.role === 'admin' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#5B21B6] hover:bg-[#7C3AED] text-white'}`}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedMessages;
