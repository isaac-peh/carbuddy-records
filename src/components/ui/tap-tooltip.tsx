import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface TapTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function TapTooltip({ children, content }: TapTooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleOutsideClick = useCallback((e: MouseEvent | TouchEvent) => {
    if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("pointerdown", handleOutsideClick);
      return () => document.removeEventListener("pointerdown", handleOutsideClick);
    }
  }, [open, handleOutsideClick]);

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            className="inline-flex"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            onPointerEnter={() => setOpen(true)}
            onPointerLeave={() => setOpen(false)}
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
