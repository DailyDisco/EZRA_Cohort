import React, { useState } from "react";
import ChatBot from "react-chatbotify";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const MyChatBot: React.FC = () => {
    const [conversation, setConversation] = useState<Message[]>([]);
    const settings = {
        chatHistory: { storageKey: "example_llm_conversation" },
        general: {
            primaryColor: "#00674f",
            secondaryColor: "#00674f",
            showHeader: true,
            showFooter: false,
            showInputRow: true,
            embedded: false,
        },
        tooltip: {
            mode: "START",
            text: "Have an issue? Chat with me!",
        },
        header: {
            title: <div style={{ cursor: "pointer", margin: 0, fontSize: 20, fontWeight: "bold" }}>EZRA Bot</div>,
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
            icon: "logo-with-bg.png",
        },
    };
    const callServerChat = async (params: { userInput: string; injectMessage: (msg: string) => Promise<void> }) => {
        const userMessage: Message = {
            role: "user",
            content: params.userInput,
        };

        const updatedConversation = [...conversation, userMessage];

        // Get API URL from environment variables, ensuring no trailing slash
        const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

        if (!API_URL) {
            console.error("VITE_API_URL is not defined.");
            await params.injectMessage("Configuration error: API URL is missing. Please contact support.");
            return;
        }

        // Remove trailing slash from API_URL if present
        const cleanedAPI_URL = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

        try {
            const response = await fetch(`${cleanedAPI_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation: updatedConversation }),
            });

            if (!response.ok) throw new Error("Server error");
            const data = await response.json();

            const assistantMessage: Message = {
                role: "assistant",
                content: data.reply,
            };

            setConversation([...updatedConversation, assistantMessage]);
            await params.injectMessage(data.reply);
        } catch {
            await params.injectMessage("Unable to load model, try again later.");
        }
    };

    const flow = {
        start: {
            message: "Hello there! I'm EZRAbot, your helpful AI apartment assistant!",
            path: "loop",
        },
        loop: {
            message: async (params: { userInput: string; injectMessage: (msg: string) => Promise<void> }) => {
                await callServerChat(params);
            },
            path: "loop",
        },
    };

    return (
        <ChatBot
            settings={settings}
            flow={flow}
        />
    );
};

export default MyChatBot;
