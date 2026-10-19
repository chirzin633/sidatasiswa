import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContect";
import Auth from "./pages/Auth";
import Dasboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentCreate from "./pages/StudentCreate";
import StudentEdit from "./pages/StudentEdit";
import StudentDetail from "./pages/StudentDetail";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-10 font-sans font-bold">Loading....</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-10 font-sans font-bold">Loading....</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dasboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students/create"
        element={
          <ProtectedRoute>
            <StudentCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students/:id"
        element={
          <ProtectedRoute>
            <StudentDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students/:id/edit"
        element={
          <ProtectedRoute>
            <StudentEdit />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={"/dashboard"} replace />} />
      <Route path="*" element={<Navigate to={"/login"} replace />} />
    </Routes>
  );
}
