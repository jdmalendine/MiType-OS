
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import * as geminiService from '../services/geminiService';
import { Bot, Send, X, Loader } from 'lucide-react';
import Button from './Button';

const MiChatAssistant: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await geminiService.getChatResponse(newMessages, userProfile);
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Neural link interrupted. Please recalibrate and try again." }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-brand-primary text-brand-text rounded-full p-5 shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.8)] transition-all duration-300 hover:scale-110 z-50 group border border-white/20"
                aria-label="Open Mi Assistant"
            >
                <Bot size={32} className="group-hover:animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-hbdi-green rounded-full border-2 border-brand-bg shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 md:w-[450px] md:h-[700px] glass-panel border border-brand-border/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] flex flex-col z-50 animate-fade-in overflow-hidden">
            <div className="p-6 border-b border-brand-border/20 flex justify-between items-center flex-shrink-0 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 glass-panel rounded-lg text-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black font-header tracking-tight uppercase italic">Mi Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-hbdi-green rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                            <span className="text-[10px] font-data text-brand-text-muted uppercase tracking-widest">Neural Link Active</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-brand-text-muted hover:text-brand-text transition-colors hover:bg-white/10 rounded-full" aria-label="Close chat"><X size={20} /></button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-black/20">
                {messages.length === 0 && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] p-5 rounded-2xl glass-panel border border-white/5 shadow-lg">
                            <p className="text-sm font-medium leading-relaxed text-brand-text/90 italic">"Greetings. I am Mi, your cognitive interface. How can I assist in decoding your neural architecture today?"</p>
                        </div>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-2xl shadow-lg transition-all duration-300 ${msg.role === 'user' ? 'bg-brand-primary/20 border border-brand-primary/30 text-brand-text shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'glass-panel border border-white/5 text-brand-text/90'}`}>
                            <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</p>
                            <div className={`mt-2 text-[8px] font-data uppercase tracking-widest opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                {msg.role === 'user' ? 'User Input' : 'Mi Output'}
                            </div>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-[85%] p-5 rounded-2xl glass-panel border border-white/5 shadow-lg flex items-center gap-3">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
                            </div>
                            <span className="text-[10px] font-data text-brand-text-muted uppercase tracking-widest">Processing Neural Vectors...</span>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-6 border-t border-brand-border/20 flex items-center gap-3 flex-shrink-0 bg-white/5">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Query neural profile..."
                    className="flex-1 bg-white/5 border border-brand-border/30 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all duration-300 placeholder:text-brand-text-muted/50"
                    disabled={isLoading}
                    aria-label="Chat input"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message" className="p-4 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Send size={20} />
                </Button>
            </form>
        </div>
    );
};

export default MiChatAssistant;
