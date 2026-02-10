import NavigationBar from "@/components/NavigationBar";
import VehicleGallery from "@/components/VehicleGallery";
import VehicleHeader from "@/components/VehicleHeader";
import VehicleDetails from "@/components/VehicleDetails";
import ServiceScoring from "@/components/ServiceScoring";
import WorkshopDetails from "@/components/WorkshopDetails";
import ServiceRecordTable from "@/components/ServiceRecordTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationBar />

      {/* Vehicle Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <VehicleGallery />
          <VehicleHeader />
        </div>
      </div>

      {/* Vehicle Specs - Soft tinted section */}
      <div className="section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VehicleDetails />
        </div>
      </div>

      {/* Scoring & Workshop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ServiceScoring />
          <WorkshopDetails />
        </div>
      </div>

      {/* Service Records - Tinted section */}
      <div className="section-cool">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ServiceRecordTable />
        </div>
      </div>
    </div>
  );
};

export default Index;
