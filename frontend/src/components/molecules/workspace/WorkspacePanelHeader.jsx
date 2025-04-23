import { useEffect, useState } from 'react';
import { 

  ChevronDownIcon, 
  ListFilterIcon,
  SquarePenIcon, 

} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WorkspaceInviteModal } from '@/components/organisms/Modals/WorkspaceInviteModal'; 
import { useWorkspacePreferencesModal } from '@/hooks/context/useWorkspacePreferencesModal';
import { useAuth } from '@/hooks/context/useAuth';


// WorkspacePanelHeader Component
const WorkspacePanelHeader = ({ workspace }) => {
    console.log('workspace is', workspace?.data?.name);

  const [openInviteModal, setOpenInviteModal] = useState(false);
  const { setWorkspace, setOpenPreferences, setInitialValue } = useWorkspacePreferencesModal();
  const { auth } = useAuth();
  
  const workspacemembers = workspace?.data?.members;
  const isLoggedInUserAdminOfWorkspace = workspacemembers?.find(
    member => member.memberId._id === auth?.user?._id && member.role === 'admin'
  );

  useEffect(() => {
    console.log('Setting workspace in context');
    setWorkspace(workspace);
  }, [workspace, setWorkspace]);

  const handlePreferencesClick = () => {
    console.log('Preferences clicked');
    setInitialValue(workspace?.data?.name);
    setOpenPreferences(true);
  };

    
    return (
        <>

         <WorkspaceInviteModal 
                 openInviteModal={openInviteModal}
                 setOpenInviteModal={setOpenInviteModal}
                 workspaceName={workspace?.name}
                 joinCode={workspace?.joinCode}
                 workspaceId={workspace?._id}
 
         />

         <div
             className='flex items-center justify-between px-4 h-[50px] gap-0.5'
         >
             <DropdownMenu>
                 <DropdownMenuTrigger>
                     <Button
                         variant='transparent'
                         className='font-semibold text-lg w-auto p-1.5 overflow-hidden'
                     >
                         <span className='truncate'>
                             {workspace?.data?.name}
                         </span>
                         <ChevronDownIcon className='size-5 ml-1' />
                     </Button>
                 </DropdownMenuTrigger>
 
                 <DropdownMenuContent side='bottom' align='start' className='w-64'>
                     <DropdownMenuItem>
                         <div 
                             className='size-9 relative overflow-hidden text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2 bg-[#616061]'
                         >
                             {workspace?.data?.name.charAt(0).toUpperCase()}
                         </div>
                         <div className='flex flex-col items-start'>
                             <p className='font-bold'>
                                 {workspace?.data?.name}
                             </p>
                             <p className='text-xs text-muted-foreground'>
                                 Active Workspace
                             </p>
                         </div>
                     </DropdownMenuItem>
 
                     {isLoggedInUserAdminOfWorkspace && (
                         <>
                             <DropdownMenuItem
                                 className='cursor-pointer py-2'
                                 onClick={handlePreferencesClick}
                             >
                                 Preferences
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem
                                 className='cursor-pointer py-2'
                                 onClick={() => {setOpenInviteModal(true);}}
                             >
                                 Invite people to {workspace?.data?.name}
                             </DropdownMenuItem>
                         </>
                     )}
 
                 </DropdownMenuContent>
             </DropdownMenu>
 
             <div 
                 className='flex items-center gap-0.5'
             >
                 <Button
                     variant='transparent'
                     size='iconSm'
                 >
                     <ListFilterIcon className='size-5' />
                 </Button>
 
                 <Button
                     variant='transparent'
                     size='iconSm'
                 >
                     <SquarePenIcon className='size-5' />
                 </Button>
             </div>
         </div>

        </>
    );
};


export default WorkspacePanelHeader;