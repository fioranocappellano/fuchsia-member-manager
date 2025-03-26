
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import AdminManager from "@/components/admin/AdminManager";
import { Loader2 } from "lucide-react";

/**
 * Admin dashboard page
 * Requires authentication
 */
const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("User not authenticated, redirecting to auth");
      navigate('/auth');
    } else if (!isLoading && user && !isAdmin) {
      console.log("User not an admin, redirecting to home");
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-jf-dark text-white flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D946EF]" />
        <p className="mt-4">Verifica autorizzazioni...</p>
      </div>
    );
  }

  // Show loading while checking admin status
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Judgment Fleet</title>
      </Helmet>
      
      <AdminManager />
    </>
  );
};

export default Admin;
