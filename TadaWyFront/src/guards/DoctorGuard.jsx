import ProtectedRoute from "../components/ProtectedRoute";

const DoctorGuard = ({ children }) => {
  return <ProtectedRoute allowedRoles={["Doctor"]}>{children}</ProtectedRoute>;
};

export default DoctorGuard;
