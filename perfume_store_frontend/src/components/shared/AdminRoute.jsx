import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-32 h-32 rounded-xl" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
