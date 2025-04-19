import { useState } from 'react';
import {
    BellIcon,
    HomeIcon,
    MessageSquareIcon,
    MoreHorizontalIcon
} from 'lucide-react';

import { UserButton } from '@/components/atoms/UserButton/UserButton';
import { SidebarButton } from '@/components/molecules/SidebarButton/SidebarButton';

// Create a custom event for communication between components
const FILE_EXPLORER_TOGGLE_EVENT = 'fileExplorerToggle';

export const WorkspaceSidebar = () => {
    const [activeButton, setActiveButton] = useState('Home');
    
    const handleButtonClick = (label) => {
        setActiveButton(label);
        
        // When Home button is clicked, dispatch a custom event
        if (label === 'Home') {
            // Create and dispatch a custom event to toggle file explorer
            const toggleEvent = new CustomEvent(FILE_EXPLORER_TOGGLE_EVENT);
            document.dispatchEvent(toggleEvent);
        }
    };

    return (
        <aside
            className="w-[72px] h-full flex flex-col gap-y-6 items-center pt-6 pb-4"
            style={{
                background: "linear-gradient(180deg, #1a1a2e 0%, #1f1f2e 100%)",
                height: '100vh',
                position: 'sticky',
                top: 0,
                boxShadow: '2px 0 10px rgba(0, 0, 0, 0.15)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            <div className="mb-6 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
            </div>

            <div className="flex flex-col gap-y-6 items-center w-full">
                <SidebarButton 
                    Icon={HomeIcon} 
                    label="Home" 
                    isActive={activeButton === 'Home'}
                    onClick={() => handleButtonClick('Home')}
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
    );
};

// Export the event name for use in other components
export const FILE_EXPLORER_TOGGLE_EVENT_NAME = FILE_EXPLORER_TOGGLE_EVENT;