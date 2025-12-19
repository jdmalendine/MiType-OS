
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
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now." }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-brand-primary text-white rounded-full p-4 shadow-lg hover:bg-indigo-500 transition-transform hover:scale-110 z-50"
                aria-label="Open Mi Assistant"
            >
                <Bot size={28} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 md:w-[400px] md:h-[600px] bg-brand-surface border border-brand-border rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in">
            <div className="p-4 border-b border-brand-border flex justify-between items-center flex-shrink-0">
                <h3 className="text-lg font-bold flex items-center gap-2"><Bot /> Mi Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="text-brand-text-muted hover:text-white" aria-label="Close chat"><X size={20} /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-brand-bg">
                            <p className="text-sm">Hello! How can I help you understand your MiType+ profile today?</p>
                        </div>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-primary text-white' : 'bg-brand-bg'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-[80%] p-3 rounded-lg bg-brand-bg">
                            <Loader className="animate-spin text-brand-text-muted" size={20} />
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-brand-border flex items-center gap-2 flex-shrink-0">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your profile..."
                    className="flex-1 bg-brand-bg border border-brand-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    disabled={isLoading}
                    aria-label="Chat input"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
                    <Send size={20} />
                </Button>
            </form>
        </div>
    );
};

export default MiChatAssistant;
