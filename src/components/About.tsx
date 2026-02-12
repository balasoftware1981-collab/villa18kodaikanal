const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <p className="text-accent font-body text-sm tracking-[0.4em] uppercase mb-4 font-medium">
          Welcome
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-8">
          Your Serene Escape
        </h2>
        <div className="w-16 h-[2px] bg-accent mx-auto mb-8" />
        <p className="font-body text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          Nestled in the heart of Kodaikanal, Villa 18 offers a tranquil retreat 
          with breathtaking views and unparalleled comfort. Experience the perfect 
          blend of nature's beauty and modern luxury. Each room opens to a private 
          balcony, letting you soak in the majestic scenery from the moment you wake.
        </p>
      </div>
    </section>
  );
};

export default About;
