import { create } from "zustand";
import { useActiveFileTabStore } from "./activeFileTabStore";
import { useTreeStructureStore } from "./treeStructureStore";
import { usePortStore } from "./portStore";
import { useChatStore } from "./chatStore";

export const useEditorSocketStore = create((set, get) => ({
    editorSocket: null,
    collaborators: [],
    
    setEditorSocket: (incomingSocket) => {
        const { setActiveFileTab } = useActiveFileTabStore.getState();
        const { setTreeStructure } = useTreeStructureStore.getState();
        const { setPort } = usePortStore.getState();
        const { addMessage, addTypingUser, removeTypingUser } = useChatStore.getState();

        // Editor events
        incomingSocket?.on("readFileSuccess", (data) => {
            const fileExtension = data.path.split('.').pop();
            setActiveFileTab(data.path, data.value, fileExtension);
        });

        // Chat events
        incomingSocket?.on("NewMessageReceived", (data) => {
            addMessage(data);
        });

        // Collaboration events
        incomingSocket?.on("CodeUpdate", (data) => {
            if(data.path === useActiveFileTabStore.getState().activeFileTab?.path) {
                setActiveFileTab(data.path, data.content, data.extension);
            }
        });

        incomingSocket?.on("UserTyping", (userId) => {
            addTypingUser(userId);
            setTimeout(() => removeTypingUser(userId), 3000);
        });

        incomingSocket?.on("CollaboratorsUpdated", (users) => {
            set({ collaborators: users });
        });

        set({ editorSocket: incomingSocket });
    },
    
    emitCodeUpdate: (data) => {
        const socket = get().editorSocket;
        socket?.emit("CodeUpdate", data);
    },
    
    joinProject: (projectId) => {
        const socket = get().editorSocket;
        socket?.emit("JoinProject", projectId);
    }
}));