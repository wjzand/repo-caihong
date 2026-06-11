import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "@/pages/HomePage";
import DiyPage from "@/pages/DiyPage";
import PosterPage from "@/pages/PosterPage";
import DailyPage from "@/pages/DailyPage";
import BattlePage from "@/pages/BattlePage";
import MinePage from "@/pages/MinePage";
import MysteryBoxPage from "@/pages/MysteryBoxPage";
import { useAppStore } from "@/store";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function TabTracker() {
  const { pathname } = useLocation();
  const { setActiveTab } = useAppStore();

  useEffect(() => {
    if (pathname === "/" || pathname === "/home") setActiveTab("home");
    else if (pathname === "/daily") setActiveTab("daily");
    else if (pathname === "/mine") setActiveTab("mine");
  }, [pathname, setActiveTab]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <TabTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/diy" element={<DiyPage />} />
        <Route path="/poster" element={<PosterPage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/mine" element={<MinePage />} />
        <Route path="/mystery" element={<MysteryBoxPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
