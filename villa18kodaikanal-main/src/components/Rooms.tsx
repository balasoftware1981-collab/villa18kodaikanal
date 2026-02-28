import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomOwnerSuite from "@/assets/room-owner-suite.jpg";
import roomRoyalSuite from "@/assets/room-royal-suite.jpg";

const rooms = [
  {
    name: "Standard Room",
    description: "Cozy and comfortable, perfect for solo travelers or couples.",
    availability: "1 Room Available",
    image: roomStandard,
  },
  {
    name: "Deluxe Room",
    subtitle: "with Bathtub",
    description: "Indulge in luxury with a spacious room and a relaxing bathtub.",
    availability: "1 Room Available",
    image: roomDeluxe,
  },
  {
    name: "Owner Suite",
    description: "Ideal for families, with two bedrooms and a separate living room.",
    availability: "1 Suite Available",
    image: roomOwnerSuite,
  },
  {
    name: "Royal Suite",
    description: "The epitome of luxury for larger groups, with four bedrooms and two living rooms.",
    availability: "1 Suite Available",
    image: roomRoyalSuite,
  },
];

const Rooms = () => {
  return (
    <section id="rooms" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-body text-sm tracking-[0.4em] uppercase mb-4 font-medium">
            Accommodations
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Our Rooms & Suites
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {rooms.map((room) => (
            <div
              key={room.name}
              className="group bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                  {room.name}
                </h3>
                {room.subtitle && (
                  <p className="font-display text-accent italic text-lg mb-3">{room.subtitle}</p>
                )}
                <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                  {room.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-body tracking-widest uppercase text-accent font-semibold">
                    {room.availability}
                  </span>
                  <a
                    href="#booking"
                    className="text-xs font-body tracking-widest uppercase text-foreground font-semibold hover:text-accent transition-colors"
                  >
                    Book Now →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rooms;
