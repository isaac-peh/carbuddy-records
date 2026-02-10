import { 
  Battery, 
  Zap, 
  Palette, 
  Cog, 
  Car, 
  Gauge, 
  Fuel, 
  Thermometer,
  Shield,
  Calendar
} from "lucide-react";

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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Vehicle Specifications</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-4">
        {specifications.map((spec, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <spec.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider leading-none mb-1">{spec.label}</p>
              <p className="text-sm font-medium text-foreground leading-tight">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleDetails;
