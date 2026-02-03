import NavigationBar from "@/components/NavigationBar";
import VehicleGallery from "@/components/VehicleGallery";
import VehicleHeader from "@/components/VehicleHeader";
import VehicleDetails from "@/components/VehicleDetails";
import ServiceScoring from "@/components/ServiceScoring";
import ServiceRecordTable from "@/components/ServiceRecordTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar */}
        <NavigationBar />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Vehicle Gallery */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <VehicleGallery />
          </div>

          {/* Right Column - Vehicle Info */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <VehicleHeader />
          </div>
        </div>

        {/* Vehicle Details & Service Scoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VehicleDetails />
          <ServiceScoring />
        </div>

        {/* Service Record Table */}
        <ServiceRecordTable />
      </div>
    </div>
  );
};

export default Index;
