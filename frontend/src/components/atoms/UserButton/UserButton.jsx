import { LogOutIcon, PencilIcon, SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; 

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/context/useAuth';
import { useCreateWorkspaceModal } from '@/hooks/context/useCreateWorkspaceModal';

export const UserButton = () => {
    const navigate = useNavigate();
    const { auth, logout } = useAuth();
    const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal();

    function openWorkspaceCreateModal() {
        setOpenCreateWorkspaceModal(true);
    }

    async function handleLogout() {
        await logout();
        toast.success('Successfully signed out');
        navigate('/');
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='outline-none relative group'>
                <div className="relative">
                    <Avatar className='size-10 border-2 border-transparent transition-all group-hover:border-accent'>
                        <AvatarImage src={auth?.user?.avatar} />
                        <AvatarFallback className="bg-accent/20 text-accent">
                            {auth?.user?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1a1a2e]" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5}>
                <DropdownMenuItem onClick={openWorkspaceCreateModal} className="cursor-pointer">
                    <PencilIcon className='size-4 mr-2' />
                    Create Workspace
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer"> 
                    <SettingsIcon className='size-4 mr-2' />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
                    <LogOutIcon className='size-4 mr-2' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};