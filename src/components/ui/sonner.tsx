import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border/50 group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/5 group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3.5 group-[.toaster]:gap-3",
          title: "group-[.toast]:font-semibold group-[.toast]:text-[13px] group-[.toast]:tracking-tight",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-[18px] w-[18px] text-[hsl(var(--success))]" />,
        error: <AlertCircle className="h-[18px] w-[18px] text-destructive" />,
        info: <Info className="h-[18px] w-[18px] text-accent" />,
        warning: <AlertTriangle className="h-[18px] w-[18px] text-[hsl(var(--warning))]" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
