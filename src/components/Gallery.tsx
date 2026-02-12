import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const images = [
  { src: gallery1, alt: "Mountain sunset in Kodaikanal" },
  { src: gallery2, alt: "Campfire under the stars" },
  { src: gallery3, alt: "Stargazing terrace" },
  { src: gallery4, alt: "Private balcony with mountain view" },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-body text-sm tracking-[0.4em] uppercase mb-4 font-medium">
            Glimpses
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Moments at Villa 18
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden group ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-all duration-500" />
              <p className="absolute bottom-4 left-4 text-primary-foreground font-body text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {img.alt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
