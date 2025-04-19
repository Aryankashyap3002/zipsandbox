import { HashIcon, MessageSquareTextIcon, SendHorizonalIcon } from 'lucide-react';
import { SideBarItem } from '@/components/atoms/SideBarItem/SideBarItem';
import { UserItem } from '@/components/atoms/UserItem/UserItem';
import { WorkspacePanelHeader } from './WorkspacePanelHeader';
import { WorkspacePanelSection } from './WorkspacePanelSection';

export const WorkspacePanel = () => {
    // Mock data - replace with real data from your context/store
    const workspace = {
        name: "CodeSandbox",
        channels: [
            { _id: "general", name: "general" },
            { _id: "help", name: "help" }
        ],
        members: [
            { memberId: { _id: "1", username: "You", avatar: "" } }
        ]
    };

    return (
        <div className="flex flex-col h-full bg-[#2e2f40] w-full">
            <WorkspacePanelHeader workspace={workspace} />

            <div className='flex flex-col px-2 mt-3'>
                <SideBarItem 
                    label="Threads"
                    icon={MessageSquareTextIcon}
                    id="threads"
                    variant='active'
                />
                <SideBarItem 
                    label="Drafts & Sends"
                    icon={SendHorizonalIcon}
                    id="drafts"
                    variant='default'
                />
            </div>

            <WorkspacePanelSection
                label={'Channels'}
                onIconClick={() => console.log("Create channel")}
            >
                {workspace?.channels?.map((channel) => (
                    <SideBarItem 
                        key={channel._id} 
                        icon={HashIcon} 
                        label={channel.name} 
                        id={channel._id} 
                    />
                ))}
            </WorkspacePanelSection>

            <WorkspacePanelSection
                label="Direct messages"
                onIconClick={() => console.log("Add member")}
            >
                {workspace?.members?.map((item) => (
                    <UserItem 
                        key={item.memberId._id} 
                        label={item.memberId.username} 
                        id={item.memberId._id} 
                        image={item.memberId.avatar} 
                    />
                ))}
            </WorkspacePanelSection>
        </div>
    );
};