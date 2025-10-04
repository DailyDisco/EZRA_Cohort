import React, { useState } from 'react';
import ChatBot from 'react-chatbotify';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatResponse {
    reply: string;
}

// Configuration constants
const CHAT_CONFIG = {
    API_URL: (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, ''),
    STORAGE_KEY: 'ezra_chat_conversation',
} as const;

const MyChatBot: React.FC = () => {
    const [conversation, setConversation] = useState<Message[]>([]);
    const settings = {
        chatHistory: { storageKey: CHAT_CONFIG.STORAGE_KEY },
        general: {
            primaryColor: '#00674f', // Site's primary teal
            secondaryColor: '#14b8a6', // Lighter teal for accents
            showHeader: true,
            showFooter: false,
            showInputRow: true,
            embedded: false,
        },
        tooltip: {
            mode: 'START',
            text: "👋 Need help with your apartment? I'm here to assist!",
        },
        header: {
            title: (
                <div
                    style={{
                        cursor: 'pointer',
                        margin: 0,
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#262626',
                        letterSpacing: '0.5px',
                    }}
                >
                    🏢 EZRA Assistant
                </div>
            ),
            showAvatar: false,
        },
        emoji: {
            disabled: true,
        },
        toast: {
            maxCount: 3,
            forbidOnMax: false,
            dismissOnClick: true,
        },
        notification: {
            showCount: false,
        },
        chatButton: {
            icon: `data:image/svg+xml;base64,${btoa(
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M8 13h8"/><path d="M9 17h6"/></svg>'
            )}`,
        },
    };
    const callServerChat = async (params: { userInput: string; injectMessage: (msg: string) => Promise<void> }) => {
        const userMessage: Message = {
            role: 'user',
            content: params.userInput,
        };

        const updatedConversation = [...conversation, userMessage];

        try {
            const response = await fetch(`${CHAT_CONFIG.API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation: updatedConversation }),
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const data: ChatResponse = await response.json();

            if (!data.reply) {
                throw new Error('Invalid response format from server');
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.reply,
            };

            setConversation([...updatedConversation, assistantMessage]);
            await params.injectMessage(data.reply);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage =
                error instanceof Error
                    ? "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
                    : 'Something went wrong. Please check your connection and try again.';
            await params.injectMessage(errorMessage);
        }
    };

    const flow = {
        start: {
            message: "👋 Hello! I'm your EZRA Apartment Assistant. How can I help you with your apartment needs today?",
            path: 'loop',
        },
        loop: {
            message: async (params: { userInput: string; injectMessage: (msg: string) => Promise<void> }) => {
                await callServerChat(params);
            },
            path: 'loop',
        },
    };

    return <ChatBot settings={settings} flow={flow} />;
};

export default MyChatBot;
