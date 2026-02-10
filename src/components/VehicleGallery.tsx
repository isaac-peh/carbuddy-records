import { useState } from "react";
import teslaHero from "@/assets/tesla-model-y-hero.jpg";
import teslaInterior from "@/assets/tesla-interior.jpg";
import teslaRear from "@/assets/tesla-rear.jpg";
import teslaSide from "@/assets/tesla-side.jpg";
import teslaTrunk from "@/assets/tesla-trunk.jpg";

const VehicleGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    { src: teslaHero, alt: "Tesla Model Y - Hero View" },
    { src: teslaInterior, alt: "Tesla Model Y - Interior" },
    { src: teslaRear, alt: "Tesla Model Y - Rear View" },
    { src: teslaSide, alt: "Tesla Model Y - Side View" },
    { src: teslaTrunk, alt: "Tesla Model Y - Trunk" },
  ];

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[16/10] shadow-elevated group">
        <img
          src={images[selectedImage].src}
          alt={images[selectedImage].alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {/* Image counter pill */}
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
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehicleGallery;
