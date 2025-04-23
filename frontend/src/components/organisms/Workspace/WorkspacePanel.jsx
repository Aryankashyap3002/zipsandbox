import { 
  HashIcon, 
  AlertTriangleIcon, 
  MessageSquareTextIcon, 
  SendHorizonalIcon,

} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useCreateChannelModal } from '@/hooks/context/useCreateChannelModal';

import WorkspacePanelHeader from '@/components/molecules/workspace/WorkspacePanelHeader';
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import WorkspacePanelSection from '@/components/molecules/workspace/WorkspacePanelSection';
import { SideBarItem } from '@/components/atoms/SideBarItem/SideBarItem';
import { UserItem } from '@/components/atoms/UserItem/UserItem';

import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';

export const WorkspacePanel = () => {
    const { workspaceId: urlWorkspaceId } = useParams();

    
    // Use the context you've created
    const { currentWorkspace } = useCurrentWorkspace();
    
    // Determine which workspaceId to use and add debugging
    console.log("URL workspaceId:", urlWorkspaceId);
    console.log("Context workspace:", currentWorkspace);
    
    // If urlWorkspaceId exists, use that; otherwise, use the ID from context
    const workspaceId = urlWorkspaceId || (currentWorkspace?.id || null);
    
    const { setOpenCreateChannelModal } = useCreateChannelModal();
    
    // Only fetch if workspaceId exists
    const { workspace, isFetching, isSuccess } = useGetWorkspaceById(workspaceId);

    console.log("From panel", workspace, workspaceId);
 
    
    if(isFetching) {
        return (
            <div className="flex items-center justify-center h-full bg-[#461450] text-white">
                <div className="flex items-center gap-2">
                    <span className="animate-spin">
                        <HashIcon className="size-4" />
                    </span>
                    Loading workspace...
                </div>
            </div>
        );
    }

    // This is the correct logic - show error when NOT successful
if(!isSuccess && !isFetching && workspaceId) {
    return (
        <div className="flex items-center justify-center h-full bg-[#461450] text-white">
            <div className="flex items-center gap-2 text-red-300">
                <AlertTriangleIcon className="size-4" />
                Something went wrong
            </div>
        </div>
    );
}

    // At the beginning of render logic in WorkspacePanel
if (!workspaceId) {
    return (
        <div className="flex items-center justify-center h-full bg-[#461450] text-white">
            <div className="flex flex-col items-center gap-2">
                <AlertTriangleIcon className="size-4" />
                <p>Please select a workspace</p>
            </div>
        </div>
    );
}

    return (
        <div className="h-full bg-[#461450] text-white flex flex-col overflow-hidden">
            {/* Workspace Header */}
            <WorkspacePanelHeader workspace={workspace} />

            <div
                 className='flex flex-col px-2 mt-3'
             >
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
            
            {/* Channels Section */}
            <div className="flex-1 overflow-y-auto">
            <WorkspacePanelSection
                 label={'Channels'}
                 onIconClick={() => {setOpenCreateChannelModal(true);}}
             >
                 {workspace?.channels?.map((channel) => {
                     return <SideBarItem key={channel._id} icon={HashIcon} label={channel.name} id={channel._id} />;
                 })}
             </WorkspacePanelSection>

                {/* Direct Messages Section */}
                <WorkspacePanelSection 
                    label="Direct messages"
                    onIconClick={() => {
                        console.log("Add direct message clicked");
                    }}
                >
                    {workspace?.members?.map((member) => (
                        <UserItem
                            key={member.id}
                            id={member.id}
                            label={member.name}
                            image={member.image}
                            variant="default"
                        />
                    ))}
                </WorkspacePanelSection>
            </div>
        </div>
    );
};





