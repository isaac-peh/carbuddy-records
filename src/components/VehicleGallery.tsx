import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import teslaHero from "@/assets/tesla-model-y-hero.jpg";
import teslaInterior from "@/assets/tesla-interior.jpg";
import teslaRear from "@/assets/tesla-rear.jpg";
import teslaSide from "@/assets/tesla-side.jpg";
import teslaTrunk from "@/assets/tesla-trunk.jpg";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const images = [
  { src: teslaHero, alt: "Tesla Model Y - Hero View" },
  { src: teslaInterior, alt: "Tesla Model Y - Interior" },
  { src: teslaRear, alt: "Tesla Model Y - Rear View" },
  { src: teslaSide, alt: "Tesla Model Y - Side View" },
  { src: teslaTrunk, alt: "Tesla Model Y - Trunk" },
];

const VehicleGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goNext = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const goPrev = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative overflow-hidden rounded-2xl bg-secondary aspect-[16/10] shadow-elevated group cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={images[selectedImage].src}
          alt={images[selectedImage].alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-foreground/40 hover:bg-foreground/60 text-primary-foreground rounded-full p-1.5 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-foreground/40 hover:bg-foreground/60 text-primary-foreground rounded-full p-1.5 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-3 right-3 bg-foreground/60 backdrop-blur-sm text-primary-foreground text-xs px-2.5 py-1 rounded-full">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative overflow-hidden rounded-xl aspect-square w-16 flex-shrink-0 transition-all duration-200 ${
              selectedImage === index
                ? "ring-2 ring-accent ring-offset-2 shadow-elevated scale-105"
                : "opacity-60 hover:opacity-100 hover:shadow-soft"
            }`}
          >
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto p-0 border-none bg-transparent shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <div className="flex flex-col items-center gap-4">
            {/* Main lightbox image with arrows */}
            <div className="relative flex items-center justify-center">
              <button
                onClick={goPrev}
                className="absolute left-2 z-10 bg-foreground/50 hover:bg-foreground/70 text-primary-foreground rounded-full p-2 backdrop-blur-sm transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl"
              />

              <button
                onClick={goNext}
                className="absolute right-2 z-10 bg-foreground/50 hover:bg-foreground/70 text-primary-foreground rounded-full p-2 backdrop-blur-sm transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Close button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-2 right-2 z-10 bg-foreground/50 hover:bg-foreground/70 text-primary-foreground rounded-full p-1.5 backdrop-blur-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnails in lightbox */}
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg aspect-square w-14 flex-shrink-0 transition-all duration-200 ${
                    selectedImage === index
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-black/50 scale-110"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleGallery;
