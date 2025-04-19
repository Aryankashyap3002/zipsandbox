import { create } from "zustand";

export const useChatStore = create((set) => ({
    messages: [],
    currentChannel: null,
    typingUsers: [],
    
    addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
    })),
    
    setCurrentChannel: (channelId) => set({ 
        currentChannel: channelId,
        messages: [] // Clear messages when channel changes
    }),
    
    addTypingUser: (userId) => set((state) => ({
        typingUsers: [...new Set([...state.typingUsers, userId])]
    })),
    
    removeTypingUser: (userId) => set((state) => ({
        typingUsers: state.typingUsers.filter(id => id !== userId)
    })),
    
    clearMessages: () => set({ messages: [] })
}));