import { useState, useEffect, useMemo } from "react";
import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, isWithinInterval, parseISO } from "date-fns";
import { toast } from "sonner";

interface RoomRate {
  id: string;
  room_name: string;
  base_price: number;
  season_price: number;
}

interface SeasonalRange {
  id: string;
  start_date: string;
  end_date: string;
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
  const [seasonalRanges, setSeasonalRanges] = useState<SeasonalRange[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch both room rates and seasonal price ranges from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: rates } = await supabase.from("room_rates").select("*");
      const { data: ranges } = await supabase.from("seasonal_ranges").select("*");
      
      if (rates) setRoomRates(rates);
      if (ranges) setSeasonalRanges(ranges);
    };
    fetchData();
  }, []);

  // Automatically determine if the selected check-in date falls within a peak season
  const isPeakSeason = useMemo(() => {
    if (!formData.checkin || seasonalRanges.length === 0) return false;
    
    const checkinDate = parseISO(formData.checkin);
    
    return seasonalRanges.some((range) => {
      const start = parseISO(range.start_date);
      const end = parseISO(range.end_date);
      return isWithinInterval(checkinDate, { start, end });
    });
  }, [formData.checkin, seasonalRanges]);

  const totalCost = useMemo(() => {
    if (!formData.room || !formData.checkin || !formData.checkout) return null;
    
    const rate = roomRates.find((r) => r.room_name === formData.room);
    if (!rate) return null;
    
    const nights = differenceInDays(new Date(formData.checkout), new Date(formData.checkin));
    if (nights <= 0) return null;
    
    const pricePerNight = isPeakSeason ? rate.season_price : rate.base_price;
    return { nights, pricePerNight, total: nights * pricePerNight };
  }, [formData.room, formData.checkin, formData.checkout, roomRates, isPeakSeason]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsProcessing(true);

  // SIMULATED PAYMENT (Use this until you have keys)
  console.log("Simulating successful payment...");
  
  const { error: bookingError } = await supabase.from("bookings").insert({
    guest_name: formData.name,
    guest_email: formData.email,
    room_id: roomRates.find(r => r.room_name === formData.room)?.id,
    check_in: formData.checkin,
    check_out: formData.checkout,
    total_price: totalCost?.total,
    payment_id: "test_payment_123",
    status: 'confirmed'
  });

  if (!bookingError) {
    toast.success("Booking saved to database (Test Mode)");
    setFormData({ name: "", email: "", checkin: "", checkout: "", room: "", message: "" });
  }
  setIsProcessing(false);
};

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong with the payment system.");
    } finally {
      setIsProcessing(false);
    }
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
                Experience luxury in the hills. Complete your booking securely online.
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
                    {rate.room_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price estimate with automated season detection */}
            {totalCost && (
              <div className="bg-card border border-accent/30 p-5 space-y-1 animate-in fade-in duration-500">
                <p className="font-body text-xs tracking-widest uppercase text-accent font-semibold">
                  Total Stay Cost
                </p>
                <p className="font-display text-2xl font-bold text-foreground">
                  ₹{totalCost.total.toLocaleString("en-IN")}
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  {totalCost.nights} night{totalCost.nights > 1 ? "s" : ""} × ₹{totalCost.pricePerNight.toLocaleString("en-IN")}/night
                  {isPeakSeason && <span className="text-accent ml-2 font-semibold">(Peak Season Rate Applied)</span>}
                </p>
              </div>
            )}

            <div>
              <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
                Additional Message
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-card border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase font-body hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay & Confirm Booking"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;