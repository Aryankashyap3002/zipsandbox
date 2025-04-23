import { useEffect, useState } from 'react';
import {
    BellIcon,
    HomeIcon,
    MessageSquareIcon,
    MoreHorizontalIcon,
    FolderIcon
} from 'lucide-react';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { SidebarButton } from '@/components/molecules/SidebarButton/SidebarButton';
import { useCreateWorkspaceModal } from '@/hooks/context/useCreateWorkspaceModal';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { WorkspacePanel } from './WorkspacePanel';

export const FILE_EXPLORER_TOGGLE_EVENT_NAME = 'fileExplorerToggle';
export const WORKSPACE_PANEL_TOGGLE_EVENT_NAME = 'workspacePanelToggle';

export const WorkspaceSidebar = () => {
    const [activeButton, setActiveButton] = useState('FileExplorer');
    const [showWorkspacePanel, setShowWorkspacePanel] = useState(false);
    const { isFetching, workspaces } = useFetchWorkspace();
    const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal();

    // Open file explorer panel once at load
    useEffect(() => {
        const event = new CustomEvent(FILE_EXPLORER_TOGGLE_EVENT_NAME);
        document.dispatchEvent(event);
    }, []);

    // Handle empty workspace scenario
    useEffect(() => {
        if (isFetching) return;
        if (!workspaces || workspaces.length === 0) {
            setOpenCreateWorkspaceModal(true);
        }
    }, [isFetching, workspaces, setOpenCreateWorkspaceModal]);

    // Listen for workspace toggle
    useEffect(() => {
        const handler = () => setShowWorkspacePanel(prev => !prev);
        document.addEventListener(WORKSPACE_PANEL_TOGGLE_EVENT_NAME, handler);
        return () => {
            document.removeEventListener(WORKSPACE_PANEL_TOGGLE_EVENT_NAME, handler);
        };
    }, []);

    const handleButtonClick = (label) => {
        setActiveButton(label);

        if (label === 'Home') {
            document.dispatchEvent(new CustomEvent(WORKSPACE_PANEL_TOGGLE_EVENT_NAME));
        } else if (label === 'FileExplorer') {
            document.dispatchEvent(new CustomEvent(FILE_EXPLORER_TOGGLE_EVENT_NAME));
        }
    };

    return (
        <div className="flex h-full">
            {/* Left Sidebar */}
            <aside
                className="w-[72px] h-full flex flex-col gap-y-6 items-center pt-6 pb-4"
                style={{
                    background: "#1a1a2e",
                    position: 'sticky',
                    top: 0,
                    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.15)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <div className="mb-6 w-10 h-10 rounded-full bg-[#7b1fa2] flex items-center justify-center">
                    <span className="text-white font-bold text-lg">W</span>
                </div>

                <div className="flex flex-col gap-y-6 items-center w-full">
                    <WorkspaceSwitcher />

                    <SidebarButton 
                        Icon={HomeIcon} 
                        label="Home" 
                        isActive={activeButton === 'Home'}
                        onClick={() => handleButtonClick('Home')}
                    />

                    <SidebarButton 
                        Icon={FolderIcon} 
                        label="FileExplorer" 
                        isActive={activeButton === 'FileExplorer'}
                        onClick={() => handleButtonClick('FileExplorer')}
                    />

                    <SidebarButton 
                        Icon={MessageSquareIcon} 
                        label="DMs" 
                        isActive={activeButton === 'DMs'}
                        onClick={() => handleButtonClick('DMs')}
                    />

                    <SidebarButton 
                        Icon={BellIcon} 
                        label="Notifications" 
                        isActive={activeButton === 'Notifications'}
                        onClick={() => handleButtonClick('Notifications')}
                    />

                    <SidebarButton 
                        Icon={MoreHorizontalIcon} 
                        label="More" 
                        isActive={activeButton === 'More'}
                        onClick={() => handleButtonClick('More')}
                    />
                </div>

                <div className="flex flex-col items-center justify-center mt-auto mb-5">
                    <UserButton />
                </div>
            </aside>

            {/* Workspace Panel */}
            {showWorkspacePanel && (
                <div 
                    className="w-64 flex-shrink-0 transition-all duration-200 ease-in-out"
                    style={{ animation: 'slideIn 0.2s ease-out' }}
                >
                    <WorkspacePanel />
                </div>
            )}
        </div>
    );
};
