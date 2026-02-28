import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Pencil, X, Loader2 } from "lucide-react";

interface RoomRate {
  id: string;
  room_name: string;
  base_price: number;
  season_price: number;
}

const AdminDashboard = () => {
  const [rates, setRates] = useState<RoomRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RoomRate | null>(null);
  const [basePrice, setBasePrice] = useState("");
  const [seasonPrice, setSeasonPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/login", { replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("room_rates").select("*");
    if (data) setRates(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const openEdit = (rate: RoomRate) => {
    setEditing(rate);
    setBasePrice(String(rate.base_price));
    setSeasonPrice(String(rate.season_price));
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await supabase
      .from("room_rates")
      .update({
        base_price: Number(basePrice),
        season_price: Number(seasonPrice),
        updated_at: new Date().toISOString(),
      })
      .eq("id", editing.id);
    setSaving(false);
    setEditing(null);
    fetchRates();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary">
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

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        <h2 className="font-display text-xl font-bold text-foreground mb-6">Room Rates</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-card border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Room</th>
                  <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Base Price</th>
                  <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Season Price</th>
                  <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate.id} className="border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4 font-body text-foreground font-medium">{rate.room_name}</td>
                    <td className="px-6 py-4 font-body text-foreground text-right">₹{Number(rate.base_price).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 font-body text-foreground text-right">₹{Number(rate.season_price).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEdit(rate)}
                        className="inline-flex items-center gap-1.5 text-xs font-body tracking-widest uppercase text-accent hover:text-foreground transition-colors font-semibold"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-card border border-border p-8 w-full max-w-md space-y-6 relative">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Edit Pricing</h3>
              <p className="font-body text-sm text-muted-foreground">{editing.room_name}</p>
            </div>

            <div>
              <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Base Price (₹)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Season Price (₹)</label>
              <input
                type="number"
                value={seasonPrice}
                onChange={(e) => setSeasonPrice(e.target.value)}
                className="w-full bg-secondary border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase font-body hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
