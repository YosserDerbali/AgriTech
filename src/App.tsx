import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { AgronomistBottomNav } from "@/components/layout/AgronomistBottomNav";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import HomePage from "./pages/HomePage";
import DiagnosePage from "./pages/DiagnosePage";
import HistoryPage from "./pages/HistoryPage";
import DiagnosisDetailPage from "./pages/DiagnosisDetailPage";
import ProfilePage from "./pages/ProfilePage";
import FarmerArticlesPage from "./pages/FarmerArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import NotFound from "./pages/NotFound";
// Agronomist pages
import AgronomistDashboardPage from "./pages/agronomist/AgronomistDashboardPage";
import PendingQueuePage from "./pages/agronomist/PendingQueuePage";
import DiagnosisReviewPage from "./pages/agronomist/DiagnosisReviewPage";
import ArticlesPage from "./pages/agronomist/ArticlesPage";
import ArticleEditorPage from "./pages/agronomist/ArticleEditorPage";
import AgronomistProfilePage from "./pages/agronomist/AgronomistProfilePage";
// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import AIModelsPage from "./pages/admin/AIModelsPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAgronomistRoute = location.pathname.startsWith('/agronomist');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background">
      <RoleSwitcher />
      <Routes>
        {/* Farmer routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/diagnose" element={<DiagnosePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/diagnosis/:id" element={<DiagnosisDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/articles" element={<FarmerArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        
        {/* Agronomist routes */}
        <Route path="/agronomist" element={<AgronomistDashboardPage />} />
        <Route path="/agronomist/queue" element={<PendingQueuePage />} />
        <Route path="/agronomist/review/:id" element={<DiagnosisReviewPage />} />
        <Route path="/agronomist/articles" element={<ArticlesPage />} />
        <Route path="/agronomist/articles/new" element={<ArticleEditorPage />} />
        <Route path="/agronomist/articles/edit/:id" element={<ArticleEditorPage />} />
        <Route path="/agronomist/profile" element={<AgronomistProfilePage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/ai-models" element={<AIModelsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && (isAgronomistRoute ? <AgronomistBottomNav /> : <BottomNav />)}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
