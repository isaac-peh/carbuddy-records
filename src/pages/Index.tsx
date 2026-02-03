import NavigationBar from "@/components/NavigationBar";
import VehicleGallery from "@/components/VehicleGallery";
import VehicleHeader from "@/components/VehicleHeader";
import VehicleDetails from "@/components/VehicleDetails";
import ServiceScoring from "@/components/ServiceScoring";
import ServiceRecordTable from "@/components/ServiceRecordTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Navigation Bar */}
        <NavigationBar />

        {/* Main Content - Vehicle Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <VehicleGallery />
          <VehicleHeader />
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Vehicle Details & Service Scoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <VehicleDetails />
          <ServiceScoring />
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Service Record Table */}
        <ServiceRecordTable />
      </div>
    </div>
  );
};

export default Index;
