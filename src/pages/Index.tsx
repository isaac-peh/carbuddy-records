import NavigationBar from "@/components/NavigationBar";
import VehicleGallery from "@/components/VehicleGallery";
import VehicleHeader from "@/components/VehicleHeader";
import VehicleDetails from "@/components/VehicleDetails";
import ServiceScoring from "@/components/ServiceScoring";
import WorkshopDetails from "@/components/WorkshopDetails";
import ServiceRecordTable from "@/components/ServiceRecordTable";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Vehicle Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <VehicleGallery />
          <VehicleHeader />
        </div>

        {/* Vehicle Specs */}
        <VehicleDetails />

        {/* Scoring & Workshop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ServiceScoring />
          <WorkshopDetails />
        </div>

        {/* Service Records */}
        <ServiceRecordTable />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
