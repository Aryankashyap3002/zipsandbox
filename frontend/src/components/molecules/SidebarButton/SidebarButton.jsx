import { Button } from '@/components/ui/button';

export const SidebarButton = ({
    Icon,
    label,
    isActive = false,
    onClick
}) => {
    return (
        <div 
            className="flex flex-col items-center justify-center cursor-pointer gap-y-0.5 relative"
            onClick={onClick}
        >
            {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-md" />
            )}
            <Button
                variant="ghost"
                className={`size-10 p-2 transition-all ${isActive 
                    ? 'bg-accent/20 text-accent hover:bg-accent/30' 
                    : 'bg-transparent hover:bg-accent/10 text-white'}`}
            >
                <Icon className={`size-5 ${isActive ? 'text-accent' : 'text-white'} transition-all`} />
            </Button>
            <span
                className={`text-[10px] ${isActive ? 'text-accent' : 'text-white'} transition-all`}
            >
                {label}
            </span>
        </div>
    );
};