// Route mapping configuration based on module names from API
// Maps module names to routes and menu items

// Icon paths
const MaskGroup = "/img/Maskgroup.png";
const MaskGroup1 = "/img/Maskgroup1.png";
const MaskGroup2 = "/img/Maskgroup2.png";
const MaskGroup3 = "/img/Maskgroup3.png";
const MaskGroup4 = "/img/Maskgroup4.png";
const MaskGroup5 = "/img/Maskgroup5.png";

// Module name to route mapping
export const MODULE_ROUTE_MAP = {
  // Super Admin Dashboard Routes
  MEMBERS: {
    basePath: "/superDashboard/members",
    icon: MaskGroup1,
    displayName: "Members",
    children: {
      USER: {
        path: "/superDashboard/members/add",
        displayName: "Users",
      },
      AGENT: {
        path: "/superDashboard/members/list",
        displayName: "Agents",
      },
      ROLE_MANAGEMENT: {
        path: "/superDashboard/members/rolemanagement",
        displayName: "Role Management",
      },
    },
  },
  "API_&_OPERATOR": {
    basePath: "/superDashboard/api-operator",
    icon: MaskGroup2,
    displayName: "API Operator",
    children: {
      OPERATOR_LIST: {
        path: "/superDashboard/api-operator/list",
        displayName: "Operator List",
      },
      API_SETTINGS: {
        path: "/superDashboard/api-operator/settings",
        displayName: "API Settings",
      },
    },
  },
  RESOURCES: {
    basePath: "/superDashboard/resources",
    icon: MaskGroup3,
    displayName: "Resources",
    children: {
      SCHEME_MANAGER: {
        path: "/superDashboard/resources/schemamaster",
        displayName: "Schema Master",
      },
      ROLE_UPGRADE_REQUEST: {
        path: "/superDashboard/resources/roleupgraderequest",
        displayName: "Role Upgrade",
      },
    },
  },
  FUND_MANAGEMENT: {
    basePath: "/superDashboard/fund-manage",
    icon: MaskGroup4,
    displayName: "Fund Manage",
    children: {
      SCHEME_MANAGER: {
        path: "/superDashboard/fund-manage/add",
        displayName: "Scheme Manager",
      },
      ROLE_UPGRADE_REQUEST: {
        path: "/superDashboard/fund-manage/history",
        displayName: "Role Upgrade Request",
      },
    },
  },
  REPORTS: {
    basePath: "/superDashboard/reports",
    icon: MaskGroup5,
    displayName: "Reports",
    children: {
      BUSSINESS_REPORT: {
        path: "/superDashboard/reports/daily",
        displayName: "Daily Reports",
      },
      EARNINGS_REPORT: {
        path: "/superDashboard/reports/monthly",
        displayName: "Monthly Reports",
      },
    },
  },
  TXN_HISTORY: {
    basePath: "/superDashboard/tax-history",
    icon: MaskGroup5,
    displayName: "Txn History",
    children: null,
  },
  // Admin Dashboard Routes - These are mapped from MEMBERS module for admin
  // Admin Dashboard - Members (same structure as super admin but different paths)
  ADMIN_MEMBERS: {
    basePath: "/adminDashboard/members",
    icon: MaskGroup1,
    displayName: "Members",
    children: {
      USER: {
        path: "/adminDashboard/members/add",
        displayName: "Users",
      },
      AGENT: {
        path: "/adminDashboard/members/list",
        displayName: "Agents",
      },
    },
  },
  ADMIN_RESOURCES: {
    basePath: "/adminDashboard/resources",
    icon: MaskGroup2,
    displayName: "Resources",
    children: {
      RESOURCE_LIST: {
        path: "/adminDashboard/resources/list",
        displayName: "Resource List",
      },
      ADD_RESOURCE: {
        path: "/adminDashboard/resources/add",
        displayName: "Add Resource",
      },
    },
  },
  ADMIN_FUND_MANAGEMENT: {
    basePath: "/adminDashboard/fund-manage",
    icon: MaskGroup3,
    displayName: "Fund Manage",
    children: {
      SCHEME_MANAGER: {
        path: "/adminDashboard/fund-manage/add",
        displayName: "Scheme Manager",
      },
      ROLE_UPGRADE_REQUEST: {
        path: "/adminDashboard/fund-manage/history",
        displayName: "Role Upgrade Request",
      },
    },
  },
  ADMIN_TAX_HISTORY: {
    basePath: "/adminDashboard/tax-history",
    icon: MaskGroup4,
    displayName: "Tax History",
    children: {
      TRANSACTION_LIST: {
        path: "/adminDashboard/tax-history/list",
        displayName: "Transaction List",
      },
      REFUNDS: {
        path: "/adminDashboard/tax-history/refunds",
        displayName: "Refunds",
      },
    },
  },
  ADMIN_REPORTS: {
    basePath: "/adminDashboard/reports",
    icon: MaskGroup5,
    displayName: "Reports",
    children: {
      DAILY_REPORTS: {
        path: "/adminDashboard/reports/daily",
        displayName: "Daily Reports",
      },
      MONTHLY_REPORTS: {
        path: "/adminDashboard/reports/monthly",
        displayName: "Monthly Reports",
      },
    },
  },
};

// Dashboard paths (fixed for all users)
export const DASHBOARD_PATHS = {
  SUPER_ADMIN: "/superDashboard/home",
  ADMIN: "/adminDashboard/home",
};

// Helper function to get route config by module name
export const getRouteConfig = (moduleName) => {
  return MODULE_ROUTE_MAP[moduleName] || null;
};

// Helper function to build menu items from permissions
export const buildMenuItemsFromPermissions = (permissions, dashboardType = "super") => {
  const menuItems = [];
  const dashboardPath = dashboardType === "admin" ? DASHBOARD_PATHS.ADMIN : DASHBOARD_PATHS.SUPER_ADMIN;

  // Always add Dashboard as first item
  menuItems.push({
    name: "Dashboard",
    icon: MaskGroup,
    path: dashboardPath,
    dropdown: false,
  });

  // Process permissions if available
  if (!permissions || !Array.isArray(permissions)) {
    return menuItems; // Return at least Dashboard
  }

  // Process permissions
  permissions.forEach((permission) => {
    if (!permission.isParent) return; // Skip non-parent permissions

    const moduleName = permission.moduleName;
    const routeConfig = getRouteConfig(moduleName);

    if (!routeConfig) {
      // Try alternative mappings for admin dashboard
      if (dashboardType === "admin") {
        let adminConfig = null;
        if (moduleName === "MEMBERS") {
          adminConfig = getRouteConfig("ADMIN_MEMBERS");
        } else if (moduleName === "RESOURCES") {
          adminConfig = getRouteConfig("ADMIN_RESOURCES");
        } else if (moduleName === "FUND_MANAGEMENT") {
          adminConfig = getRouteConfig("ADMIN_FUND_MANAGEMENT");
        } else if (moduleName === "REPORTS") {
          adminConfig = getRouteConfig("ADMIN_REPORTS");
        } else if (moduleName === "TXN_HISTORY") {
          adminConfig = getRouteConfig("ADMIN_TAX_HISTORY");
        }
        
        if (adminConfig) {
          menuItems.push(buildMenuItemFromPermission(permission, adminConfig));
        }
      }
      return;
    }

    menuItems.push(buildMenuItemFromPermission(permission, routeConfig));
  });

  return menuItems;
};

// Helper function to build a single menu item from permission
const buildMenuItemFromPermission = (permission, routeConfig) => {
  const hasChildren = permission.children && permission.children.length > 0;
  const children = hasChildren && routeConfig.children
    ? permission.children
        .map((child) => {
          // Try to find matching child config by moduleName
          let childConfig = routeConfig.children[child.moduleName];
          
          // If not found, try to find by matching any key that contains the module name
          if (!childConfig) {
            const childKey = Object.keys(routeConfig.children).find((key) => {
              return key === child.moduleName || 
                     key.includes(child.moduleName) ||
                     child.moduleName.includes(key);
            });
            if (childKey) {
              childConfig = routeConfig.children[childKey];
            }
          }
          
          if (!childConfig) return null;
          return {
            name: childConfig.displayName,
            path: childConfig.path,
          };
        })
        .filter(Boolean)
    : null;

  return {
    name: routeConfig.displayName,
    icon: routeConfig.icon,
    path: routeConfig.basePath,
    dropdown: hasChildren && children && children.length > 0,
    children: children,
  };
};

// Helper function to check if user has permission for a route
export const hasPermissionForRoute = (permissions, routePath, requiredPermission = "read") => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }

  // Dashboard is always accessible
  if (routePath.includes("/home")) {
    return true;
  }

  // Normalize route path (remove trailing slashes, handle wildcards)
  const normalizedPath = routePath.replace(/\/+$/, "");

  // Check all permissions recursively
  const checkPermission = (perms, path) => {
    for (const perm of perms) {
      // Check if this permission matches the route
      const routeConfig = getRouteConfig(perm.moduleName);
      if (routeConfig) {
        // Normalize base path
        const normalizedBasePath = routeConfig.basePath.replace(/\/+$/, "");
        
        // Check if path exactly matches base path
        if (path === normalizedBasePath) {
          // Base path access - check parent permission
          return requiredPermission === "read" ? perm.read : perm.write;
        }
        
        // Check if path starts with base path (for child routes and wildcards)
        if (path.startsWith(normalizedBasePath + "/") || path.startsWith(normalizedBasePath)) {
          // Check if it's a child route
          if (routeConfig.children) {
            // Check each child route
            let childMatched = false;
            for (const [childKey, childConfig] of Object.entries(routeConfig.children)) {
              const normalizedChildPath = childConfig.path.replace(/\/+$/, "");
              
              // Exact match with child path
              if (path === normalizedChildPath) {
                childMatched = true;
                // Find matching child permission by moduleName
                if (perm.children) {
                  const childPerm = perm.children.find((c) => {
                    // Match by module name or key
                    return c.moduleName === childKey || 
                           c.moduleName === childConfig.displayName?.toUpperCase().replace(/\s+/g, "_");
                  });
                  if (childPerm) {
                    return requiredPermission === "read" ? childPerm.read : childPerm.write;
                  }
                  // If no exact match, check if any child has read/write permission
                  const hasAnyChildPermission = perm.children.some((c) => {
                    return requiredPermission === "read" ? c.read : c.write;
                  });
                  if (hasAnyChildPermission) {
                    return true;
                  }
                }
                // If no children permissions but parent has permission, allow
                return requiredPermission === "read" ? perm.read : perm.write;
              }
              
              // Check if path starts with child path (for nested routes)
              if (path.startsWith(normalizedChildPath + "/")) {
                childMatched = true;
                // For nested routes under a child, check child permission first
                if (perm.children) {
                  const childPerm = perm.children.find((c) => {
                    return c.moduleName === childKey || 
                           c.moduleName === childConfig.displayName?.toUpperCase().replace(/\s+/g, "_");
                  });
                  if (childPerm) {
                    return requiredPermission === "read" ? childPerm.read : childPerm.write;
                  }
                }
                // Fallback to parent permission
                return requiredPermission === "read" ? perm.read : perm.write;
              }
            }
            
            // If path starts with basePath but doesn't match any child exactly,
            // check parent permission (for wildcard routes like /members/*)
            if (!childMatched && (path.startsWith(normalizedBasePath + "/") || path === normalizedBasePath)) {
              return requiredPermission === "read" ? perm.read : perm.write;
            }
          } else {
            // No children, direct match or starts with base path
            return requiredPermission === "read" ? perm.read : perm.write;
          }
        }
      }

      // Recursively check children
      if (perm.children) {
        const childResult = checkPermission(perm.children, path);
        if (childResult !== null && childResult !== false) {
          return childResult;
        }
      }
    }
    return null;
  };

  const result = checkPermission(permissions, normalizedPath);
  return result === true;
};

