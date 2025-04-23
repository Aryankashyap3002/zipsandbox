import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// UserItem Component
export const UserItem = ({
    id,
    label = 'Member',
    image,
    variant = "default"
}) => {
    return (
        <Button
            className={cn(
                'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm w-full rounded',
                variant === 'active' ? 'text-[#461450] bg-white/90 hover:bg-white/80' : 'text-[#f9edffcc] hover:bg-white/10'
            )}
        >
            <div className="size-4 flex-shrink-0 relative overflow-hidden text-white font-semibold rounded-full flex items-center justify-center bg-[#616061]">
                {label.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{label}</span>
        </Button>
    );
};