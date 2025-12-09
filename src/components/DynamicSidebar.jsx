import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildMenuItemsFromPermissions } from "../config/routeConfig";

const DynamicSidebar = ({ 
  permissions, 
  dashboardType = "super",
  company,
  isSidebarOpen,
  setIsSidebarOpen,
  openDropdown,
  setOpenDropdown,
  activeMenu,
  setActiveMenu,
  footerContent,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyLogo = "/img/gmaxepay.png";

  // Build menu items from permissions
  const menuItems = buildMenuItemsFromPermissions(permissions, dashboardType);

  const handleMenuClick = (name, dropdown, path, e) => {
    // Prevent event bubbling if clicking on a link
    if (e?.target?.tagName === 'A' || e?.target?.closest('a')) {
      return;
    }

    if (dropdown) {
      // toggle dropdown open/close
      setOpenDropdown((prev) => (prev === name ? null : name));
      // also set it as active parent
      setActiveMenu(name);
      // If dropdown has a path and we're opening it, navigate to that path
      if (path && openDropdown !== name) {
        navigate(path);
      }
    } else {
      // For non-dropdown items, navigate to the path when clicking anywhere on the button
      if (path) {
        navigate(path);
      }
      // close any open dropdown
      setOpenDropdown(null);
      // mark this as active
      setActiveMenu(name);
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-[260px] max-w-[85%] bg-white lg:bg-[#0391550D] flex flex-col shadow-2xl rounded-r-xl transform transition-transform duration-300 lg:w-[277px] lg:translate-x-0 lg:shadow-lg lg:rounded-r-2xl ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ backgroundColor: isSidebarOpen ? "#FFFFFF" : undefined }}
    >
      {/* Logo */}
      <div className="p-6 text-center border-[#039155]/20 flex-shrink-0">
        <img
          src={company?.logo || companyLogo}
          alt="Company Logo"
          className="h-10 mx-auto mb-2 object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = companyLogo;
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto overflow-x-hidden">
        {menuItems.map(({ name, icon, path, dropdown, children }) => {
          const isOpen = openDropdown === name;
          
          // Check if this menu item is active based on current route
          let isActiveParent = false;
          
          if (dropdown && children) {
            // For dropdown items, check if any child path matches current location
            const hasActiveChild = children.some((child) => 
              location.pathname === child.path || location.pathname.startsWith(child.path)
            );
            // Also check if base path matches (for routes like /superDashboard/members)
            const isBasePathActive = path && (
              location.pathname === path || 
              location.pathname.startsWith(path + "/")
            );
            isActiveParent = hasActiveChild || isBasePathActive;
          } else {
            // For non-dropdown items, check exact path match
            isActiveParent = path && (
              location.pathname === path || 
              (name === "Dashboard" && location.pathname.includes("/home"))
            );
          }

          return (
            <div key={name}>
              {/* Main Menu Item */}
              <div
                onClick={(e) => handleMenuClick(name, dropdown, path, e)}
                className={`flex items-center justify-between gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 font-medium ${
                  isActiveParent
                    ? "bg-[#039155] text-white shadow-md"
                    : "text-gray-700 hover:bg-[#039155]/10 hover:text-[#039155]"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={icon}
                    alt={name}
                    className={`w-5 h-5 object-contain flex-shrink-0 ${
                      isActiveParent ? "filter brightness-0 invert" : ""
                    }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/gmaxepay.png";
                    }}
                  />
                  <span className="flex-1">{name}</span>
                </div>

                {dropdown &&
                  (isOpen ? (
                    <ChevronUp className={`w-4 h-4 transition-transform duration-300 ${
                      isActiveParent ? "text-white" : "text-gray-500"
                    }`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      isActiveParent ? "text-white" : "text-gray-500"
                    }`} />
                  ))}
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdown && isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="bg-white rounded-2xl mt-2 shadow-sm py-2 px-3 space-y-1 border border-gray-100 overflow-hidden"
                  >
                    {children?.map((child) => {
                      const isChildPathActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.name}
                          to={child.path}
                          className={`flex items-center gap-2 py-2 px-3 text-md rounded-md transition-all duration-200 ${
                            isChildPathActive
                              ? "text-[#039155] font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke={isChildPathActive ? "#039155" : "currentColor"}
                            className="w-4 h-4 mr-3 transition-colors"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          {child.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
      {footerContent && (
        <div className="px-4 py-4 flex-shrink-0">
          {footerContent}
        </div>
      )}
    </aside>
  );
};

export default DynamicSidebar;

