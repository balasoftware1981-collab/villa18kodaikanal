import { useState, useEffect, useMemo } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";

interface RoomRate {
  id: string;
  room_name: string;
  base_price: number;
  season_price: number;
}

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkin: "",
    checkout: "",
    room: "",
    message: "",
  });

  const [roomRates, setRoomRates] = useState<RoomRate[]>([]);
  const [useSeason, setUseSeason] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      const { data } = await supabase.from("room_rates").select("*");
      if (data) setRoomRates(data);
    };
    fetchRates();
  }, []);

  const totalCost = useMemo(() => {
    if (!formData.room || !formData.checkin || !formData.checkout) return null;
    const rate = roomRates.find((r) => r.room_name === formData.room);
    if (!rate) return null;
    const nights = differenceInDays(new Date(formData.checkout), new Date(formData.checkin));
    if (nights <= 0) return null;
    const pricePerNight = useSeason ? rate.season_price : rate.base_price;
    return { nights, pricePerNight, total: nights * pricePerNight };
  }, [formData.room, formData.checkin, formData.checkout, roomRates, useSeason]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const costInfo = totalCost
      ? `%0AEstimated Cost: ₹${totalCost.total.toLocaleString("en-IN")} (${totalCost.nights} nights × ₹${totalCost.pricePerNight.toLocaleString("en-IN")}/night)`
      : "";
    const subject = `Booking Inquiry - ${formData.room || "General"}`;
    const body = `Name: ${formData.name}%0AEmail: ${formData.email}%0ACheck-in: ${formData.checkin}%0ACheck-out: ${formData.checkout}%0ARoom: ${formData.room}%0AMessage: ${formData.message}${costInfo}`;
    window.location.href = `mailto:dineshvilla18@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="booking" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-body text-sm tracking-[0.4em] uppercase mb-4 font-medium">
            Reservations
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Book Your Stay
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                We'd love to hear from you! Reach out for bookings, inquiries, or special requests.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <p className="font-body text-foreground">Kodaikanal, Tamil Nadu, India</p>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <a href="tel:+919789762916" className="font-body text-foreground hover:text-accent transition-colors">
                  +91 97897 62916
                </a>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <a href="mailto:dineshvilla18@gmail.com" className="font-body text-foreground hover:text-accent transition-colors">
                  dineshvilla18@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  required
                  value={formData.checkin}
                  onChange={(e) => setFormData({ ...formData, checkin: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  required
                  value={formData.checkout}
                  onChange={(e) => setFormData({ ...formData, checkout: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
                Room Type
              </label>
              <select
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full bg-card border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Select a room</option>
                {roomRates.map((rate) => (
                  <option key={rate.id} value={rate.room_name}>
                    {rate.room_name} — ₹{Number(rate.base_price).toLocaleString("en-IN")}/night
                  </option>
                ))}
              </select>
            </div>

            {/* Season toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="season-toggle"
                checked={useSeason}
                onChange={(e) => setUseSeason(e.target.checked)}
                className="accent-accent w-4 h-4"
              />
              <label htmlFor="season-toggle" className="font-body text-sm text-muted-foreground">
                Peak season / Holiday pricing
              </label>
            </div>

            {/* Price estimate */}
            {totalCost && (
              <div className="bg-card border border-accent/30 p-5 space-y-1">
                <p className="font-body text-xs tracking-widest uppercase text-accent font-semibold">
                  Estimated Cost
                </p>
                <p className="font-display text-2xl font-bold text-foreground">
                  ₹{totalCost.total.toLocaleString("en-IN")}
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  {totalCost.nights} night{totalCost.nights > 1 ? "s" : ""} × ₹{totalCost.pricePerNight.toLocaleString("en-IN")}/night
                  {useSeason && <span className="text-accent ml-1">(peak season)</span>}
                </p>
              </div>
            )}

            <div>
              <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
                Additional Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-card border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase font-body hover:bg-accent/90 transition-colors"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;
