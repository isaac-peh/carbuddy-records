import { Search, Car, Menu, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shadow-soft">
              <Car className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">VehicleTrack</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by VIN, plate number, or vehicle..."
                className="pl-10 bg-secondary/60 border-0 shadow-soft focus:shadow-elevated transition-shadow"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {["Dashboard", "My Vehicles", "Service Centers"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-lg transition-all"
              >
                {item}
              </a>
            ))}
            <a href="#" className="px-3 py-2 text-sm font-semibold text-foreground bg-secondary/60 rounded-lg">
              Vehicle Report
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary/60">
              <Bell className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-secondary/60">
              <User className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.5} />
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-secondary/60">
              <Menu className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
