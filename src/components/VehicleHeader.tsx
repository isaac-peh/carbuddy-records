import { Calendar, Gauge, Users, Wrench, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const VehicleHeader = () => {
  return (
    <div className="space-y-6 flex flex-col justify-center">
      {/* Title Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">TESLA MODEL Y</h1>
          <p className="text-muted-foreground mt-0.5">Rear-Wheel Drive 110</p>
        </div>
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-foreground">
            <path
              fill="currentColor"
              d="M50 5 C30 5 15 20 15 35 L15 40 L25 40 L25 35 C25 25 35 15 50 15 C65 15 75 25 75 35 L75 40 L85 40 L85 35 C85 20 70 5 50 5 Z M50 25 L50 95 L55 95 L55 25 L50 25 Z"
            />
          </svg>
          <span className="text-[10px] text-muted-foreground mt-1 tracking-widest">TESLA</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Vehicle Mileage", value: "106,569km", icon: Gauge },
          { label: "Maintenance Records", value: "46", icon: Wrench },
          { label: "Vehicle Age", value: "6 Years", icon: Calendar },
          { label: "Owners", value: "3 Owners", icon: Users },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3.5 rounded-xl bg-secondary/50"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-foreground flex items-center gap-2">
              <stat.icon className="w-4 h-4 text-accent opacity-70" strokeWidth={1.5} />
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Last Maintenance */}
      <div className="p-4 rounded-xl bg-success/5 border border-success/10 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Maintenance</p>
            <p className="text-sm font-semibold text-foreground">03 March 2026 (3 month 17 days ago)</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10">
            <CheckCircle className="w-3.5 h-3.5 text-success" strokeWidth={1.5} />
            <span className="text-xs font-semibold text-success">Very High</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-elevated hover:shadow-hover transition-all gap-2">
        <Lock className="w-4 h-4" />
        Unlock Full Service History
      </Button>
    </div>
  );
};

export default VehicleHeader;
