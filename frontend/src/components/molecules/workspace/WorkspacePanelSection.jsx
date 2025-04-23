import { useState } from 'react';
import { 
 
  PlusIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';



const WorkspacePanelSection = ({ children, label, onIconClick }) => {
    const [open, setOpen] = useState(true);

    return (
        <div className="px-2 mt-2">
            <div className="flex items-center justify-between mb-1 group">
                <Button
                    onClick={() => setOpen(!open)}
                    variant="transparent"
                    className="p-0.5 text-sm size-6 text-[#f9edffcc] flex items-center hover:bg-transparent"
                >
                    {open ? 
                        <svg className="size-3" fill="currentColor" viewBox="0 0 320 512">
                            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"></path>
                        </svg> : 
                        <svg className="size-3" fill="currentColor" viewBox="0 0 320 512">
                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-128 128c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 137.4 150.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l128 128z"></path>
                        </svg>
                    }
                </Button>
                
                <span className="text-xs uppercase font-medium text-[#f9edffcc] flex-1 ml-1">
                    {label}
                </span>

                {onIconClick && (
                    <Button
                        onClick={onIconClick}
                        variant="transparent"
                        className="opacity-0 group-hover:opacity-100 size-5 p-0 text-white hover:bg-white/10 rounded"
                    >
                        <PlusIcon className="size-3" />
                    </Button>
                )}
            </div>

            {open && <div className="space-y-0.5">{children}</div>}
        </div>
    );
};

export default WorkspacePanelSection;