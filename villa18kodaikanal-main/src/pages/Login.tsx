import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin-dashboard", { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/admin-dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="bg-card border border-border p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">Villa18</h1>
          <p className="font-body text-sm text-muted-foreground">Admin Login</p>
        </div>

        {error && (
          <p className="text-sm text-destructive font-body text-center">{error}</p>
        )}

        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label className="block font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary border border-border px-4 py-3 font-body text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase font-body hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
