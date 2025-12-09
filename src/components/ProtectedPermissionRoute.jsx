import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { hasPermissionForRoute } from "../config/routeConfig";

const ProtectedPermissionRoute = ({ children, requiredPermission = "read" }) => {
  // All hooks must be called at the top, before any conditional returns
  const location = useLocation();
  const permissions = useSelector((state) => state?.auth?.permissions);
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const userRole = useSelector((state) => state?.auth?.user?.user?.userRole);

  // Memoize permission check and dashboard path to avoid recalculation
  const { hasPermission, dashboardPath } = useMemo(() => {
    const dashboard = userRole === 2
      ? "/adminDashboard/home"
      : "/superDashboard/home";

    // Dashboard is always accessible
    if (location.pathname.includes("/home")) {
      return { hasPermission: true, dashboardPath: dashboard };
    }

    // Check permission for the route
    const hasPerm = hasPermissionForRoute(
      permissions,
      location.pathname,
      requiredPermission
    );

    return { hasPermission: hasPerm, dashboardPath: dashboard };
  }, [location.pathname, permissions, requiredPermission, userRole]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  // Dashboard is always accessible
  if (location.pathname.includes("/home")) {
    return children;
  }

  // Check permission for the route
  if (!hasPermission) {
    // Redirect to dashboard if no permission
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedPermissionRoute;

