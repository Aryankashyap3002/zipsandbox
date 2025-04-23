import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAddChannelToWorkspace } from '@/hooks/apis/workspaces/useAddChannelToWorkspace';
import { useCreateChannelModal } from '@/hooks/context/useCreateChannelModal';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';

export const CreateChannelModal = () => {
    const queryClient = useQueryClient();
    const { openCreateChannelModal, setOpenCreateChannelModal } = useCreateChannelModal();
    const [channelName, setChannelName] = useState('');
    const { addChannelToWorkspaceMutation } = useAddChannelToWorkspace();
    const { currentWorkspace } = useCurrentWorkspace();

    function handleClose() {
        setOpenCreateChannelModal(false);
        setChannelName('');
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        try {
            await addChannelToWorkspaceMutation({
                workspaceId: currentWorkspace?._id,
                channelName: channelName
            });
            toast.success('Channel created successfully');
            queryClient.invalidateQueries([`fetchWorkspaceById-${currentWorkspace?._id}`]);
            handleClose();
        } catch (error) {
            toast.error('Failed to create channel');
            console.error('Error creating channel:', error);
        }
    }

    return (
        <Dialog open={openCreateChannelModal} onOpenChange={setOpenCreateChannelModal}>
            <DialogContent className="sm:max-w-[425px] bg-[#2a2b2d] border-[#3a3b3d] text-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Create a channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            id="channel-name"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            minLength={3}
                            placeholder="Channel Name e.g. team-announcements"
                            required
                            className="bg-[#1f1f2e] border-[#3a3b3d] text-white placeholder:text-gray-400 focus:ring-[#7b1fa2] focus:border-[#7b1fa2]"
                        />
                        <p className="text-xs text-gray-400">
                            Channel names must be lowercase and contain 3 or more characters
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleClose}
                            className="bg-transparent border-[#3a3b3d] text-white hover:bg-[#3a3b3d]"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            className="bg-[#7b1fa2] hover:bg-[#6a1b9a] text-white"
                        >
                            Create Channel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};