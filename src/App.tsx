import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { AgronomistBottomNav } from "@/components/layout/AgronomistBottomNav";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { useAppStore } from "@/stores/appStore";
import HomePage from "./pages/HomePage";
import DiagnosePage from "./pages/DiagnosePage";
import HistoryPage from "./pages/HistoryPage";
import DiagnosisDetailPage from "./pages/DiagnosisDetailPage";
import ProfilePage from "./pages/ProfilePage";
import FarmerArticlesPage from "./pages/FarmerArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import NotFound from "./pages/NotFound";
// Auth pages
import FarmerAuthPage from "./pages/auth/FarmerAuthPage";
import AgronomistAuthPage from "./pages/auth/AgronomistAuthPage";
import AdminAuthPage from "./pages/auth/AdminAuthPage";
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

// Protected route wrapper
function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[];
}) {
  const { isAuthenticated, currentRole } = useAppStore();
  
  if (!isAuthenticated) {
    // Redirect to appropriate auth page based on attempted route
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/auth/admin" replace />;
    }
    if (allowedRoles.includes('agronomist')) {
      return <Navigate to="/auth/agronomist" replace />;
    }
    return <Navigate to="/auth/farmer" replace />;
  }
  
  if (!allowedRoles.includes(currentRole)) {
    // Redirect to their appropriate dashboard
    if (currentRole === 'admin') return <Navigate to="/admin" replace />;
    if (currentRole === 'agronomist') return <Navigate to="/agronomist" replace />;
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, currentRole } = useAppStore();
  const isAgronomistRoute = location.pathname.startsWith('/agronomist');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname.startsWith('/auth');

  // Don't show nav on auth pages
  const showNav = isAuthenticated && !isAuthRoute;

  return (
    <div className="min-h-screen bg-background">
      {showNav && !isAdminRoute && <RoleSwitcher />}
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/farmer" element={<FarmerAuthPage />} />
        <Route path="/auth/agronomist" element={<AgronomistAuthPage />} />
        <Route path="/auth/admin" element={<AdminAuthPage />} />
        
        {/* Farmer routes */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/diagnose" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <DiagnosePage />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <HistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/diagnosis/:id" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <DiagnosisDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/articles" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerArticlesPage />
          </ProtectedRoute>
        } />
        <Route path="/articles/:id" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <ArticleDetailPage />
          </ProtectedRoute>
        } />
        
        {/* Agronomist routes */}
        <Route path="/agronomist" element={
          <ProtectedRoute allowedRoles={['agronomist']}>
            <AgronomistDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/agronomist/queue" element={
          <ProtectedRoute allowedRoles={['agronomist']}>
            <PendingQueuePage />
          </ProtectedRoute>
        } />
        <Route path="/agronomist/review/:id" element={
          <ProtectedRoute allowedRoles={['agronomist']}>
            <DiagnosisReviewPage />
          </ProtectedRoute>
        } />
        <Route path="/agronomist/articles" element={
          <ProtectedRoute allowedRoles={['agronomist']}>
            <ArticlesPage />
          </ProtectedRoute>
        } />
        <Route path="/agronomist/articles/new" element={
          <ProtectedRoute allowedRoles={['agronomist']}>
            <ArticleEditorPage />
          </ProtectedRoute>
        } />
        <Route path="/agronomist/articles/edit/:id" element={
          <ProtectedRoute allowedRoles={['agronomist']}>
            <ArticleEditorPage />
          </ProtectedRoute>
        } />
        <Route path="/agronomist/profile" element={
          <ProtectedRoute allowedRoles={['agronomist']}>
            <AgronomistProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/ai-models" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AIModelsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNav && !isAdminRoute && (isAgronomistRoute ? <AgronomistBottomNav /> : <BottomNav />)}
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
