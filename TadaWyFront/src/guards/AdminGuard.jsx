import ProtectedRoute from "../components/ProtectedRoute";

const AdminGuard = ({ children }) => {
  return <ProtectedRoute allowedRoles={["Admin"]}>{children}</ProtectedRoute>;
};

export default AdminGuard;
