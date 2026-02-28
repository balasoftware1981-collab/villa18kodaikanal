import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Pencil, X, Loader2, Calendar, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RoomRate {
  id: string;
  room_name: string;
  base_price: number;
  season_price: number;
}

interface SeasonalRange {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

const AdminDashboard = () => {
  const [rates, setRates] = useState<RoomRate[]>([]);
  const [seasons, setSeasons] = useState<SeasonalRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RoomRate | null>(null);
  
  // States for new season form
  const [newSeason, setNewSeason] = useState({ name: "", start: "", end: "" });
  const [basePrice, setBasePrice] = useState("");
  const [seasonPrice, setSeasonPrice] = useState("");
  const [saving, setSaving] = useState(false);
  
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/login", { replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: ratesData } = await supabase.from("room_rates").select("*");
    const { data: seasonsData } = await supabase.from("seasonal_ranges").select("*");
    
    if (ratesData) setRates(ratesData);
    if (seasonsData) setSeasons(seasonsData);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openEdit = (rate: RoomRate) => {
    setEditing(rate);
    setBasePrice(String(rate.base_price));
    setSeasonPrice(String(rate.season_price));
  };

  const handleSaveRate = async () => {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("room_rates")
      .update({
        base_price: Number(basePrice),
        season_price: Number(seasonPrice),
        updated_at: new Date().toISOString(),
      })
      .eq("id", editing.id);

    if (error) toast.error("Failed to update rate");
    else toast.success("Rate updated successfully");
    
    setSaving(false);
    setEditing(null);
    fetchData();
  };

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeason.name || !newSeason.start || !newSeason.end) {
      toast.error("Please fill all season fields");
      return;
    }

    const { error } = await supabase.from("seasonal_ranges").insert({
      name: newSeason.name,
      start_date: newSeason.start,
      end_date: newSeason.end
    });

    if (error) toast.error("Failed to add season");
    else {
      toast.success("New season range added");
      setNewSeason({ name: "", start: "", end: "" });
      fetchData();
    }
  };

  const handleDeleteSeason = async (id: string) => {
    const { error } = await supabase.from("seasonal_ranges").delete().eq("id", id);
    if (error) toast.error("Failed to delete season");
    else {
      toast.success("Season removed");
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Villa18</h1>
            <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">Admin Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Section 1: Room Rates */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Pencil className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl font-bold text-foreground">Pricing Management</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin text-accent" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-card border border-border">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Room Type</th>
                    <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Base Price</th>
                    <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Season Price</th>
                    <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((rate) => (
                    <tr key={rate.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 font-body text-foreground font-medium">{rate.room_name}</td>
                      <td className="px-6 py-4 font-body text-foreground text-right">₹{Number(rate.base_price).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4 font-body text-foreground text-right text-accent font-semibold">₹{Number(rate.season_price).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEdit(rate)} className="text-accent hover:underline text-xs uppercase tracking-tighter font-bold">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 2: Season Calendar Management */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl font-bold text-foreground">Peak Season Dates</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Add New Season Form */}
            <form onSubmit={handleAddSeason} className="bg-card border border-border p-6 space-y-4 h-fit">
              <h3 className="font-body text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Peak Range
              </h3>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Season Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Holidays"
                  value={newSeason.name}
                  onChange={(e) => setNewSeason({...newSeason, name: e.target.value})}
                  className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newSeason.start}
                    onChange={(e) => setNewSeason({...newSeason, start: e.target.value})}
                    className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    value={newSeason.end}
                    onChange={(e) => setNewSeason({...newSeason, end: e.target.value})}
                    className="w-full bg-secondary border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-accent text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent/90 transition-opacity">
                Save Season Range
              </button>
            </form>

            {/* Existing Seasons List */}
            <div className="md:col-span-2">
              <div className="bg-card border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-6 py-3 font-body text-[10px] tracking-widest uppercase text-muted-foreground">Label</th>
                      <th className="text-left px-6 py-3 font-body text-[10px] tracking-widest uppercase text-muted-foreground">Duration</th>
                      <th className="text-right px-6 py-3 font-body text-[10px] tracking-widest uppercase text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasons.length === 0 && (
                      <tr><td colSpan={3} className="text-center py-10 text-muted-foreground text-sm">No special seasons defined yet.</td></tr>
                    )}
                    {seasons.map((s) => (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{s.name}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {new Date(s.start_date).toLocaleDateString()} — {new Date(s.end_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteSeason(s.id)} className="text-destructive hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Edit Rate Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6 backdrop-blur-sm">
          <div className="bg-card border border-border p-8 w-full max-w-md space-y-6 relative shadow-2xl">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Update {editing.room_name}</h3>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mt-1">Pricing Configuration</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Base Price (Standard) ₹</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full bg-secondary border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Season Price (Peak) ₹</label>
                <input
                  type="number"
                  value={seasonPrice}
                  onChange={(e) => setSeasonPrice(e.target.value)}
                  className="w-full bg-secondary border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleSaveRate}
              disabled={saving}
              className="w-full bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase font-body hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;