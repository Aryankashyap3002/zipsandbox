import { useQueryClient } from '@tanstack/react-query';
import { TrashIcon, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDeleteWorkspace } from '@/hooks/apis/workspaces/useDeleteWorkspace';
import { useUpdateWorkspace } from '@/hooks/apis/workspaces/useUpdateWorkspace';
import { useWorkspacePreferencesModal } from '@/hooks/context/useWorkspacePreferencesModal';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useFetchWorkspace } from '@/hooks/apis/workspaces/useFetchWorkspace';
import { useConfirm } from '@/hooks/useConfirm';

export const WorkspacePreferencesModal = () => {
    const queryClient = useQueryClient();
    const [workspaceId, setWorkspaceId] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [renameValue, setRenameValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Get workspace context
    const { currentWorkspace, setCurrentWorkspace } = useCurrentWorkspace();
    const { data: workspaces } = useFetchWorkspace();
    const { 
        initialValue, 
        openPreferences, 
        setOpenPreferences, 
        workspace: contextWorkspace 
    } = useWorkspacePreferencesModal();

    // Determine active workspace
    const activeWorkspace = contextWorkspace?.data || contextWorkspace || currentWorkspace;

    // Initialize workspace ID and name
    useEffect(() => {
        const id = activeWorkspace?._id || 'sandbox-workspace-id';
        const name = initialValue || activeWorkspace?.name || 'Sandbox Workspace';
        
        setWorkspaceId(id);
        setRenameValue(name);
    }, [activeWorkspace, initialValue]);

    const { deleteWorkspaceMutation } = useDeleteWorkspace(workspaceId);
    const { isPending, updateWorkspaceMutation } = useUpdateWorkspace(workspaceId);

    const { confirmation, ConfirmDialog } = useConfirm({ 
        title: 'Delete Workspace?', 
        message: 'This action cannot be undone.' 
    });

    const { confirmation: updateConfirmation, ConfirmDialog: UpdateDialog } = useConfirm({ 
        title: 'Update Workspace?', 
        message: 'This will change the workspace name.' 
    });

    const handleClose = () => {
        setOpenPreferences(false);
        setEditOpen(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const ok = await confirmation();
            if (!ok) return;
            
            // Sandbox mode handling
            if (!workspaceId || workspaceId === 'sandbox-workspace-id') {
                console.log("Sandbox mode - simulating delete");
                
                // Optimistically update UI
                queryClient.setQueryData('fetchWorkspaces', old => 
                    old?.filter(w => w._id !== workspaceId) || []);
                
                // Select first available workspace
                if (workspaces?.length > 1) {
                    const nextWorkspace = workspaces.find(w => w._id !== workspaceId) || workspaces[0];
                    setCurrentWorkspace(nextWorkspace);
                } else {
                    setCurrentWorkspace(null);
                }
                
                handleClose();
                toast.success('Workspace deleted successfully (sandbox mode)');
                return;
            }

            // Real deletion flow
            await deleteWorkspaceMutation();
            
            // Invalidate and update
            await queryClient.invalidateQueries('fetchWorkspaces');
            const updatedWorkspaces = queryClient.getQueryData('fetchWorkspaces');
            
            // Select new workspace if available
            if (updatedWorkspaces?.length > 0) {
                const nextWorkspace = updatedWorkspaces.find(w => w._id !== workspaceId) || updatedWorkspaces[0];
                setCurrentWorkspace(nextWorkspace);
            } else {
                setCurrentWorkspace(null);
            }
            
            handleClose();
            toast.success('Workspace deleted successfully');
        } catch (error) {
            console.error('Deletion error:', error);
            toast.error(error.message || 'Failed to delete workspace');
            queryClient.invalidateQueries('fetchWorkspaces');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const ok = await updateConfirmation();
            if (!ok) return;
            
            // Sandbox mode handling
            if (!workspaceId || workspaceId === 'sandbox-workspace-id') {
                console.log("Sandbox mode - simulating update");
                toast.success('Workspace updated successfully (sandbox mode)');
                setEditOpen(false);
                return;
            }
            
            await updateWorkspaceMutation(renameValue);
            queryClient.invalidateQueries(`fetchWorkspaceById-${workspaceId}`);
            setEditOpen(false);
            toast.success('Workspace updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update workspace');
        }
    };

    return (
        <>
            <ConfirmDialog />
            <UpdateDialog />
            
            <Dialog open={openPreferences} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {initialValue || 'Workspace Settings'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        {/* Workspace Name Section */}
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger>
                                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>   
                                    <div className='flex items-center justify-between'>
                                        <p className='font-semibold text-sm'>
                                            Workspace Name
                                        </p>
                                        <p className='text-sm font-semibold hover:underline'>
                                            Edit
                                        </p>
                                    </div>
                                    <p className='text-sm'>
                                        {renameValue || initialValue || 'Workspace'}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename Workspace
                                    </DialogTitle>
                                </DialogHeader>
                                <form className='space-y-4' onSubmit={handleFormSubmit}>
                                    <Input
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={50}
                                        disabled={isPending}
                                        placeholder='Workspace Name'
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isPending}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={isPending}>
                                            {isPending ? <Loader className="animate-spin mr-2" /> : null}
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        
                        {/* Delete Workspace Button */}
                        <button
                            className={`flex items-center gap-x-2 px-5 py-4 rounded-lg border cursor-pointer ${
                                isDeleting ? 'bg-gray-300' : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader className="animate-spin size-5" />
                            ) : (
                                <TrashIcon className="size-5" />
                            )}
                            <p className="text-sm font-semibold">
                                {isDeleting ? 'Deleting...' : 'Delete Workspace'}
                            </p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};