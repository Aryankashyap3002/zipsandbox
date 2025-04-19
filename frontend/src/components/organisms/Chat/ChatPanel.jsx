import { useEffect, useRef } from 'react';
import { ChatInput } from '@/components/molecules/ChatInput/ChatInput';
import { MessageList } from '@/components/molecules/MessageList/MessageList';
import { useChatStore } from '@/store/chatStore';
import { useAuth } from '@/hooks/context/useAuth';
import { TypingIndicator } from '@/components/atoms/TypingIndicator/TypingIndicator';

export const ChatPanel = () => {
    const { messages, typingUsers } = useChatStore();
    const { auth } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-[#1E1E2E] border-l border-gray-700">
            <div className="flex-1 overflow-auto p-4 space-y-2">
                <MessageList messages={messages} />
                {typingUsers.length > 0 && (
                    <TypingIndicator users={typingUsers} />
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <ChatInput />
            </div>
        </div>
    );
};