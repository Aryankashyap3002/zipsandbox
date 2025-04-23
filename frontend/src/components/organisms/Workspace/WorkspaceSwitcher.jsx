import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace'; 
import { useGetWorkspaceById } from '@/hooks/apis/workspaces/useGetWorkspaceById';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useEffect } from 'react';

export const WorkspaceSwitcher = () => {
    const { workspaceId } = useParams();
    const { currentWorkspace, setCurrentWorkspace } = useCurrentWorkspace();
    const { isFetching, workspace } = useGetWorkspaceById(workspaceId || '');
    const { workspaces, isFetching: isFetchingWorkspace } = useFetchWorkspace();

    // Determine which workspace to show (context > URL param > first available)
    const displayWorkspace = currentWorkspace || workspace || workspaces?.[0];

    // When a workspace is clicked
    const handleWorkspaceSelect = (ws) => {
        // Ensure the workspace object has an id property
        const workspaceWithId = {
            ...ws,
            id: ws._id // Add id property if it's using _id instead
        };
        
        // Update context
        setCurrentWorkspace(workspaceWithId);
        
        // Optionally navigate to the workspace URL
        // This will update the URL parameter which could be useful in some cases
        // navigate(`/workspace/${ws._id}`);
        
        console.log("Selected workspace with ID:", workspaceWithId.id);
  
    };

    // Add this at component initialization in WorkspaceSwitcher
    useEffect(() => {
        // If we have workspaces but no selected workspace, set the first one
        if (workspaces?.length > 0 && !currentWorkspace) {
        const firstWorkspace = {
            ...workspaces[0],
            id: workspaces[0]._id  // Make sure id is set
        };
        setCurrentWorkspace(firstWorkspace);
        console.log("Auto-selecting first workspace:", firstWorkspace);
        }
    }, [workspaces, currentWorkspace, setCurrentWorkspace]);

    // In WorkspaceSwitcher
    useEffect(() => {
        // If there's a workspace from the URL, set it as current
        if (workspace && !currentWorkspace) {
            const workspaceWithId = {
                ...workspace,
                id: workspace._id
            };
            setCurrentWorkspace(workspaceWithId);
        }
    }, [workspace, currentWorkspace, setCurrentWorkspace]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    className='size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 font-semibold text-slate-800 text-xl'
                >
                    {isFetching ? (
                        <Loader className='size-5 animate-spin' />
                    ) : (
                        displayWorkspace?.name?.charAt(0).toUpperCase() || 'W'
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {displayWorkspace && (
                    <DropdownMenuItem
                        className='cursor-pointer flex-col justify-start items-start'
                    >
                        {displayWorkspace?.name}
                        <span className='text-xs text-muted-foregorund'>
                            (Active Workspace)
                        </span>
                    </DropdownMenuItem>
                )}
                {isFetchingWorkspace ? (
                    <Loader className='size-5 animate-spin' />
                ) : (
                    workspaces?.map((ws) => {
                        if (ws._id === displayWorkspace?._id) return null;
                        
                        return (
                            <DropdownMenuItem
                                className='cursor-pointer flex-col justify-start items-start'
                                key={ws._id}
                                onClick={() => handleWorkspaceSelect(ws)}
                            >
                                <p className='truncate'>{ws.name}</p>
                            </DropdownMenuItem>
                        );
                    })
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};