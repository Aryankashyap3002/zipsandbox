import { useAuth } from '@/hooks/context/useAuth';
import { useChatStore } from '@/store/chatStore';

export const TypingIndicator = () => {
    const { typingUsers } = useChatStore();
    const { auth } = useAuth();
    
    if (typingUsers.length === 0) return null;

    const otherUsers = typingUsers.filter(id => id !== auth.user?._id);
    if (otherUsers.length === 0) return null;

    return (
        <div className="text-xs text-gray-400 italic">
            {otherUsers.length > 1 
                ? 'Several people are typing...' 
                : 'Someone is typing...'}
        </div>
    );
};