import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Header from "./components/Header";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import HealthPage from "./pages/HealthPage";
import WatchlistPage from "./pages/WatchlistPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg-deep)", color: "var(--text-primary)" }}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <BackToTop />
      </div>
    </ToastProvider>
  );
}

export default App;
