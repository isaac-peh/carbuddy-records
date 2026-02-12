import { 
  Battery, Zap, Palette, Cog, Car, Gauge, Fuel, Thermometer, Shield, Calendar
} from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const VehicleDetails = () => {
  const specifications = [
    { icon: Zap, label: "Motor", value: "Permanent Magnet Synchronous" },
    { icon: Battery, label: "Battery", value: "60 kWh" },
    { icon: Gauge, label: "Power", value: "220 kW (295 hp)" },
    { icon: Fuel, label: "Range", value: "326 mi" },
    { icon: Cog, label: "Transmission", value: "Single-Speed Fixed" },
    { icon: Car, label: "Drivetrain", value: "RWD" },
    { icon: Palette, label: "Color", value: "Pearl White" },
    { icon: Thermometer, label: "Interior", value: "Black Premium" },
    { icon: Shield, label: "VIN", value: "5YJ3E1EA•••37892" },
    { icon: Calendar, label: "Year", value: "2020" },
  ];

  return (
    <div className="space-y-5">
      <SectionTitle title="Vehicle Specifications" subtitle="Technical details & configuration" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center flex-shrink-0">
              <spec.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mb-1">{spec.label}</p>
              <p className="text-sm font-medium text-foreground leading-tight">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleDetails;
