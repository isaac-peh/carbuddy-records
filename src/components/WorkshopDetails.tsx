import { MapPin, Phone, CalendarCheck, Star, ExternalLink } from "lucide-react";

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
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Most Visited Workshop</h2>

      <div className="flex gap-4">
        <img
          src={workshop.image}
          alt={workshop.name}
          className="w-28 h-28 rounded-xl object-cover flex-shrink-0"
        />
        <div className="space-y-2 min-w-0">
          <div>
            <h3 className="text-base font-semibold text-foreground">{workshop.name}</h3>
            <p className="text-xs text-muted-foreground">{workshop.totalVisits} visits recorded</p>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(workshop.googleRating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
                strokeWidth={1.5}
              />
            ))}
            <span className="text-xs font-medium text-foreground ml-1">{workshop.googleRating}</span>
            <span className="text-xs text-muted-foreground">({workshop.totalReviews} reviews)</span>
          </div>

          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <span className="leading-tight">{workshop.address}</span>
          </div>

          <div className="flex items-center gap-4">
            <a href={`tel:${workshop.phone}`} className="flex items-center gap-1.5 text-xs text-accent hover:underline">
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              {workshop.phone}
            </a>
            <a href={workshop.reservationUrl} className="flex items-center gap-1.5 text-xs text-accent hover:underline">
              <CalendarCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              Reserve
            </a>
            <a href={workshop.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-accent hover:underline">
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetails;
