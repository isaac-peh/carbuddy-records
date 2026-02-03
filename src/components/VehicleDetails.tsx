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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VehicleDetails = () => {
  const specifications = [
    {
      icon: Zap,
      label: "Motor Type",
      value: "Permanent Magnet Synchronous",
      category: "powertrain"
    },
    {
      icon: Battery,
      label: "Battery Capacity",
      value: "60 kWh",
      category: "powertrain"
    },
    {
      icon: Gauge,
      label: "Power Output",
      value: "220 kW (295 hp)",
      category: "powertrain"
    },
    {
      icon: Fuel,
      label: "Range (EPA)",
      value: "326 miles",
      category: "powertrain"
    },
    {
      icon: Cog,
      label: "Transmission",
      value: "Single-Speed Fixed Gear",
      category: "drivetrain"
    },
    {
      icon: Car,
      label: "Drivetrain",
      value: "Rear-Wheel Drive",
      category: "drivetrain"
    },
    {
      icon: Palette,
      label: "Exterior Color",
      value: "Pearl White Multi-Coat",
      category: "appearance"
    },
    {
      icon: Thermometer,
      label: "Interior",
      value: "Black Premium Leather",
      category: "appearance"
    },
    {
      icon: Shield,
      label: "VIN",
      value: "5YJ3E1EA•••••37892",
      category: "identification"
    },
    {
      icon: Calendar,
      label: "Year of Manufacture",
      value: "2020",
      category: "identification"
    },
  ];

  return (
    <Card className="bg-card border-border shadow-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Car className="w-4 h-4 text-accent" />
          </div>
          Full Vehicle Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {specifications.map((spec, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                <spec.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{spec.label}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{spec.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
