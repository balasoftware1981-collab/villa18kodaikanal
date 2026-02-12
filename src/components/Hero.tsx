import heroImage from "@/assets/hero-villa.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/30 to-primary/70" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-up">
        <p className="text-accent font-body text-sm tracking-[0.4em] uppercase mb-6 font-medium">
          Kodaikanal, Tamil Nadu
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-[1.1]">
          Villa18
        </h1>
        <p className="font-display text-xl md:text-2xl text-primary-foreground/90 italic mb-10">
          Stay Above The Clouds
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#rooms"
            className="bg-accent text-accent-foreground px-10 py-4 text-sm font-semibold tracking-widest uppercase font-body hover:bg-accent/90 transition-all"
          >
            Explore Rooms
          </a>
          <a
            href="#booking"
            className="border border-primary-foreground/40 text-primary-foreground px-10 py-4 text-sm font-semibold tracking-widest uppercase font-body hover:bg-primary-foreground/10 transition-all"
          >
            Book Your Stay
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-primary-foreground/50" />
      </div>
    </section>
  );
};

export default Hero;
