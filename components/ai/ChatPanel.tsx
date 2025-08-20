import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { ChatMessage } from '../../types';
import { sendChatMessage } from '../../services/geminiService';
import { Send, Bot, User, LoaderCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Bot size={20} />
                </div>
            )}
            <div className={`max-w-lg p-3 rounded-lg ${isUser ? 'bg-primary text-primary-foreground' : 'bg-neutral-100'}`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
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

const ChatPanel: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'ai', text: 'Olá! Eu sou a Sofia. Pergunte-me sobre seus cooperados, análises de risco, ou peça para eu gerar um e-mail.', timestamp: new Date().toISOString() }
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

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: textToSend, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await sendChatMessage(textToSend);
            const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText, timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Desculpe, ocorreu um erro ao processar sua solicitação.', timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const quickActions = [
        "Análise de Cooperado", "Recomendações de Produto", "Gerar E-mail Personalizado",
        "Análise de Risco de Churn", "Oportunidades de Upsell", "Análise de Sentimento"
    ];

    return (
        <Card className="h-full flex flex-col">
            <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map(msg => <Message key={msg.id} message={msg} />)}
                {isLoading && (
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <div className="bg-neutral-100 text-neutral-800 p-3 rounded-lg flex items-center gap-2">
                            <LoaderCircle size={16} className="animate-spin text-primary" />
                            <span className="text-sm text-neutral-500">Sofia está pensando...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="p-4 border-t flex-col items-start gap-4">
                 <div className="flex gap-2 flex-wrap">
                    {quickActions.map(action => (
                        <Button key={action} variant="outline" size="sm" onClick={() => handleSendMessage(action)} disabled={isLoading}>
                            {action}
                        </Button>
                    ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="w-full flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pergunte à Sofia..."
                        className="flex-1 rounded-lg border-input bg-background p-3 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                        rows={1}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button type="submit" size="lg" disabled={isLoading}>
                        <Send size={20} />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
};

export default ChatPanel;
