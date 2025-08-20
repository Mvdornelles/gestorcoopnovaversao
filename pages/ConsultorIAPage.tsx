
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { Send, Bot, User, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';


const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <Bot size={20} />
                </div>
            )}
            <div className={`max-w-xl p-3 rounded-lg ${isUser ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-800'}`}>
                <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{typeof message.text === 'string' ? message.text : ''}</ReactMarkdown>
                </div>
            </div>
             {isUser && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-700 text-white flex items-center justify-center">
                    <User size={20} />
                </div>
            )}
        </div>
    );
};

const ConsultorIAPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'ai', text: 'Olá! Eu sou a Sofia, sua consultora de IA. Como posso ajudar a analisar seus dados hoje?', timestamp: new Date().toISOString() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = useCallback(async (messageText?: string) => {
        const textToSend = (messageText || input).trim();
        if (!textToSend || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: textToSend,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await sendChatMessage(textToSend);
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: aiResponseText,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: 'Desculpe, ocorreu um erro ao processar sua solicitação.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);
    
    const quickActions = ["Qual o risco de churn de Daniel Alves?", "Gerar e-mail de follow-up para Ana Silva", "Me dê um resumo das oportunidades em negociação"];

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <BrainCircuit size={32} className="text-primary"/>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Consultora IA "Sofia"</h1>
                    <p className="text-neutral-500 mt-1">Converse com a IA para obter insights e automações.</p>
                </div>
            </div>
            
            <Card className="flex-1 flex flex-col p-0">
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map(msg => <Message key={msg.id} message={msg} />)}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                                <Bot size={20} />
                            </div>
                            <div className="bg-neutral-200 text-neutral-800 p-3 rounded-lg flex items-center gap-2">
                                <span className="h-2 w-2 bg-neutral-500 rounded-full animate-pulse delay-75"></span>
                                <span className="h-2 w-2 bg-neutral-500 rounded-full animate-pulse delay-150"></span>
                                <span className="h-2 w-2 bg-neutral-500 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t">
                    <div className="flex gap-2 mb-3 flex-wrap">
                        {quickActions.map(action => (
                            <Button key={action} variant="ghost" size="sm" onClick={() => handleSendMessage(action)} disabled={isLoading}>
                                {action}
                            </Button>
                        ))}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunte algo à Sofia..."
                            className="flex-1 rounded-lg border-neutral-300 shadow-sm focus:border-primary focus:ring-primary p-3"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="lg" disabled={isLoading}>
                            <Send size={20} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default ConsultorIAPage;