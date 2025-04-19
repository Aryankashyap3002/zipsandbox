import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const WorkspaceSwitcher = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className='size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 font-semibold text-slate-800 text-xl mb-6'
                >
                    C
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem className='cursor-pointer flex-col justify-start items-start'>
                    CodeSandbox
                    <span className='text-xs text-muted-foreground'>
                        (Active Workspace)
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};