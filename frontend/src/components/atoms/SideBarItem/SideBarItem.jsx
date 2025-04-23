import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";




export const SideBarItem = ({
    label,
    id,
    icon: Icon,
    variant = "default"
}) => {
    return (
        <Button
            className={cn(
                'flex items-center justify-start gap-1.5 font-normal h-7 px-4 text-sm overflow-hidden w-full rounded',
                variant === 'active' ? 'text-[#461450] bg-white/90 hover:bg-white/80' : 'text-[#f9edffcc] hover:bg-white/10'
            )}
        >
            {Icon && <Icon className="size-3.5 flex-shrink-0" />}
            <span className="truncate">{label}</span>
        </Button>
    );
};