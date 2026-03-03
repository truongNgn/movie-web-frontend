import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const { login } = useAuth();
  const toast     = useToast();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from ?? "/";

  const [form, setForm]       = useState({ username: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: undefined, non_field_errors: undefined, detail: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await login(form);
      toast({ message: `Welcome back, ${form.username}!`, type: "success" });
      navigate(from, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data) setErrors(data);
      else setErrors({ non_field_errors: ["Something went wrong. Please try again."] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10 8 16 12 10 16 10 8" fill="white" stroke="none"/>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1">Welcome back</h1>
        <p className="text-slate-500 text-center text-sm mb-8">
          New here?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Create an account</Link>
        </p>

        <div className="glass p-6 space-y-4">
          {(errors.non_field_errors || errors.detail) && (
            <div className="bg-red-950/50 border border-red-800/50 text-red-300 text-sm rounded-xl p-3">
              {errors.non_field_errors?.join(" ") ?? errors.detail}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
              <input name="username" value={form.username} onChange={handleChange}
                autoComplete="username" required
                className={`input-field ${errors.username ? "!border-red-500/50" : ""}`}
                placeholder="your_username" />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.join(" ")}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                autoComplete="current-password" required
                className={`input-field ${errors.password ? "!border-red-500/50" : ""}`}
                placeholder="••••••••" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.join(" ")}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
