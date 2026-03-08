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
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border/60 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3",
          title: "group-[.toast]:font-semibold group-[.toast]:text-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-[hsl(var(--success))]",
          error:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-[hsl(var(--destructive))]",
          info:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-[hsl(var(--accent))]",
          warning:
            "group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-[hsl(var(--warning))]",
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />,
        error: <AlertCircle className="h-4 w-4 text-destructive" />,
        info: <Info className="h-4 w-4 text-accent" />,
        warning: <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
