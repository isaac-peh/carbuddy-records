import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { B2BSidebar } from "@/components/b2b/B2BSidebar";
import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

export default function B2BLayout() {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <B2BSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-14 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-lg px-4 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <div className="hidden sm:block relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search parts, invoices..."
                  className="pl-9 h-8 text-sm bg-secondary/60 border-0 shadow-soft"
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="w-4 h-4 text-muted-foreground rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" strokeWidth={1.5} />
                <Moon className="absolute w-4 h-4 text-muted-foreground rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" strokeWidth={1.5} />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              </Button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
