import { MapPin, Phone, CalendarCheck, Star, ExternalLink, ShieldCheck, Clock, Wrench } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const WorkshopDetails = () => {
  const workshop = {
    name: "Tesla Service Center KL",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop",
    address: "Lot 15, Jalan Teknologi 3/1, Subang Hi-Tech Industrial Park, 40000 Shah Alam",
    phone: "+60 3-5621 8888",
    reservationUrl: "tel:+60356218888",
    googleRating: 4.6,
    totalReviews: 328,
    totalVisits: 12,
    googleMapsUrl: "https://maps.google.com",
    isVerified: true,
    specializations: ["EV Specialist", "Tesla Certified"],
    operatingHours: "Mon–Sat, 8AM–6PM",
  };

  return (
    <div className="space-y-5">
      <SectionTitle title="Most Visited Workshop" subtitle={`${workshop.totalVisits} visits on record`} />

      <div className="p-5 rounded-2xl bg-section-warm shadow-soft">
        <div className="flex gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={workshop.image}
              alt={workshop.name}
              className="w-32 h-32 rounded-xl object-cover shadow-soft"
            />
            {workshop.isVerified && (
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-success flex items-center justify-center shadow-elevated">
                <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
            )}
          </div>
          <div className="space-y-2.5 min-w-0 flex-1">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">{workshop.name}</h3>
                {workshop.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success">
                    <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                    Verified
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(workshop.googleRating) ? "text-warning fill-warning" : "text-muted-foreground/20"}`}
                  strokeWidth={1.5}
                />
              ))}
              <span className="text-sm font-semibold text-foreground ml-1.5">{workshop.googleRating}</span>
              <span className="text-xs text-muted-foreground ml-0.5">({workshop.totalReviews} reviews)</span>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1.5">
              {workshop.specializations.map((spec) => (
                <span key={spec} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent">
                  <Wrench className="w-2.5 h-2.5" strokeWidth={1.5} />
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <span className="leading-relaxed">{workshop.address}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
              <span>{workshop.operatingHours}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a href={`tel:${workshop.phone}`} className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 px-2.5 py-1.5 rounded-lg transition-all">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                Call
              </a>
              <a href={workshop.reservationUrl} className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 px-2.5 py-1.5 rounded-lg transition-all">
                <CalendarCheck className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                Reserve
              </a>
              <a href={workshop.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 bg-accent/5 hover:bg-accent/10 px-2.5 py-1.5 rounded-lg transition-all">
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetails;
