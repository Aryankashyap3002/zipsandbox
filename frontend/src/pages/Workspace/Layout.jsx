// Updated WorkspaceLayout.jsx
import { WorkspaceSidebar } from '@/components/organisms/Workspace/WorkspaceSidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChatPanel } from '@/components/organisms/Chat/ChatPanel'; // New component
import { useChatStore } from '@/store/chatStore';

export const WorkspaceLayout = ({ children }) => {
    const { currentChannel } = useChatStore();
    
    return (
        <div className="h-[100vh]">
            <div className="flex h-[calc(100vh-40px)]">
                <WorkspaceSidebar />
                <ResizablePanelGroup direction="horizontal" autoSaveId={'workspace-resize'}>
                    {/* Left Panel - File Explorer */}
                    <ResizablePanel defaultSize={20} minSize={11} className='bg-[#1E1E2E]'>
                        {/* File explorer content */}
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    
                    {/* Middle Panel - Editor/Browser */}
                    <ResizablePanel minSize={30}>
                        {children}
                    </ResizablePanel>
                    
                    {/* Right Panel - Chat (conditionally shown) */}
                    {currentChannel && (
                        <>
                            <ResizableHandle withHandle/>
                            <ResizablePanel defaultSize={25} minSize={15} maxSize={35} className='border-l border-gray-700'>
                                <ChatPanel />
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
};