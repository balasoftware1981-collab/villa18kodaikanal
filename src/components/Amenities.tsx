import { Droplets, BedDouble, Flame, Wifi, Mountain, Telescope, Car, ChefHat } from "lucide-react";

const amenities = [
  { icon: Droplets, title: "24hr Hot Water", desc: "Individual geysers" },
  { icon: BedDouble, title: "Extra Beds", desc: "Available on request" },
  { icon: Flame, title: "Campfire", desc: "Under the stars" },
  { icon: Wifi, title: "Free WiFi", desc: "Stay connected" },
  { icon: Mountain, title: "Private Balcony", desc: "In every room" },
  { icon: Telescope, title: "Sky Glance Terrace", desc: "For stargazing" },
  { icon: Car, title: "Ample Parking", desc: "Secure and spacious" },
  { icon: ChefHat, title: "In-house Kitchen", desc: "Home-cooked meals" },
];

const Amenities = () => {
  return (
    <section id="amenities" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-body text-sm tracking-[0.4em] uppercase mb-4 font-medium">
            Experience
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Facilities & Services
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {amenities.map((item) => (
            <div
              key={item.title}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-primary-foreground/20 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                <item.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">{item.title}</h3>
              <p className="font-body text-sm text-primary-foreground/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
