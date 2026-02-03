import { Calendar, Gauge, Users, Wrench, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const VehicleHeader = () => {
  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">TESLA MODEL Y</h1>
          <p className="text-muted-foreground">Rear-Wheel Drive 110</p>
        </div>
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-foreground">
            <path
              fill="currentColor"
              d="M50 5 C30 5 15 20 15 35 L15 40 L25 40 L25 35 C25 25 35 15 50 15 C65 15 75 25 75 35 L75 40 L85 40 L85 35 C85 20 70 5 50 5 Z M50 25 L50 95 L55 95 L55 25 L50 25 Z"
            />
          </svg>
          <span className="text-xs text-muted-foreground mt-1">TESLA</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehicle Mileage</p>
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Gauge className="w-4 h-4 text-accent" />
            106,569km
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Maintenance Records</p>
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-4 h-4 text-accent" />
            46
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Vehicle Age</p>
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            6 Years
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Owners</p>
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            3 Owners
          </p>
        </div>
      </div>

      {/* Last Maintenance */}
      <div className="pt-4 border-t border-border space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Maintenance</p>
          <p className="text-sm font-semibold text-foreground">03 March 2026 (3 month 17 days ago)</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Maintenance Consistency</p>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-success">Very High</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
        Unlock Full Service History
      </Button>
    </div>
  );
};

export default VehicleHeader;
