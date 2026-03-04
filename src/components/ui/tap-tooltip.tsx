import * as React from "react";
import { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface TapTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function TapTooltip({ children, content }: TapTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex"
            onClick={() => setOpen((prev) => !prev)}
            onBlur={() => setOpen(false)}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
