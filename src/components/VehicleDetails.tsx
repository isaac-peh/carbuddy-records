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
    {
      icon: Zap,
      label: "Motor Type",
      value: "Permanent Magnet Synchronous",
    },
    {
      icon: Battery,
      label: "Battery Capacity",
      value: "60 kWh",
    },
    {
      icon: Gauge,
      label: "Power Output",
      value: "220 kW (295 hp)",
    },
    {
      icon: Fuel,
      label: "Range (EPA)",
      value: "326 miles",
    },
    {
      icon: Cog,
      label: "Transmission",
      value: "Single-Speed Fixed Gear",
    },
    {
      icon: Car,
      label: "Drivetrain",
      value: "Rear-Wheel Drive",
    },
    {
      icon: Palette,
      label: "Exterior Color",
      value: "Pearl White Multi-Coat",
    },
    {
      icon: Thermometer,
      label: "Interior",
      value: "Black Premium Leather",
    },
    {
      icon: Shield,
      label: "VIN",
      value: "5YJ3E1EA•••••37892",
    },
    {
      icon: Calendar,
      label: "Year of Manufacture",
      value: "2020",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Car className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Full Vehicle Details</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specifications.map((spec, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 py-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
              <spec.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{spec.label}</p>
              <p className="text-sm font-medium text-foreground truncate">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleDetails;
