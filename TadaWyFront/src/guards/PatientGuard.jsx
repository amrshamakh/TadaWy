import ProtectedRoute from "../components/ProtectedRoute";

const PatientGuard = ({ children, renderBlockedContent = false }) => {
  return <ProtectedRoute allowedRoles={["patient"]} renderBlockedContent={renderBlockedContent}>{children}</ProtectedRoute>;
};

export default PatientGuard;
