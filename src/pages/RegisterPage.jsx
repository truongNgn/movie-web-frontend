import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const toast        = useToast();
  const navigate     = useNavigate();

  const [form, setForm]       = useState({ username: "", email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: undefined, non_field_errors: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await register(form);
      toast({ message: `Account created! Welcome, ${form.username}!`, type: "success" });
      navigate("/", { replace: true });
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

        <h1 className="text-2xl font-bold text-center text-white mb-1">Create account</h1>
        <p className="text-slate-500 text-center text-sm mb-8">
          Already have one?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
        </p>

        <div className="glass p-6">
          {errors.non_field_errors && (
            <div className="bg-red-950/50 border border-red-800/50 text-red-300 text-sm rounded-xl p-3 mb-4">
              {errors.non_field_errors.join(" ")}
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
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Email <span className="text-slate-600 normal-case font-normal">(optional)</span>
              </label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                autoComplete="email"
                className={`input-field ${errors.email ? "!border-red-500/50" : ""}`}
                placeholder="you@example.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.join(" ")}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                autoComplete="new-password" required minLength={8}
                className={`input-field ${errors.password ? "!border-red-500/50" : ""}`}
                placeholder="Min. 8 characters" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.join(" ")}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
