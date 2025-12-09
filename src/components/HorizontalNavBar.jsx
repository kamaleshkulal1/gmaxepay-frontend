import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildMenuItemsFromPermissions } from "../config/routeConfig";

const HorizontalNavBar = ({
  permissions,
  dashboardType = "super",
  company,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyLogo = "/img/gmaxepay.png";
  const [mobileDropdowns, setMobileDropdowns] = useState({});

  // Build menu items from permissions
  const menuItems = buildMenuItemsFromPermissions(permissions, dashboardType);

  // Helper: ensure Dashboard always navigates to correct home path
  const dashboardPath =
    menuItems.find((item) => item.name === "Dashboard")?.path ||
    (dashboardType === "admin"
      ? "/adminDashboard/home"
      : "/superDashboard/home");

  // Always show nav bar - Dashboard is always included
  // If no menu items (shouldn't happen), show empty nav bar

  // Close mobile dropdowns when menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setMobileDropdowns({});
    }
  }, [isMobileMenuOpen]);

  const handleMenuClick = (name, dropdown, path, e) => {
    if (e?.target?.tagName === "A" || e?.target?.closest("a")) {
      return;
    }

    // Dashboard should always navigate to its home path
    if (name === "Dashboard") {
      navigate(dashboardPath);
      setIsMobileMenuOpen(false);
      return;
    }

    if (dropdown) {
      // For dropdown items, navigate to base path if available
      if (path) {
        navigate(path);
      }
    } else {
      // For non-dropdown items, navigate to the path
      if (path) {
        navigate(path);
      }
    }
    // Close mobile menu on click
    setIsMobileMenuOpen(false);
  };

  // Check if menu item is active
  const isMenuActive = (name, path, dropdown, children) => {
    if (dropdown && children) {
      const hasActiveChild = children.some(
        (child) =>
          location.pathname === child.path ||
          location.pathname.startsWith(child.path)
      );
      const isBasePathActive =
        path &&
        (location.pathname === path ||
          location.pathname.startsWith(path + "/"));
      return hasActiveChild || isBasePathActive;
    } else {
      return (
        path &&
        (location.pathname === path ||
          (name === "Dashboard" && location.pathname.includes("/home")))
      );
    }
  };

  return (
    <>
      {/* Desktop Horizontal Navigation - Full Width, Beautiful */}
      <nav className="hidden lg:flex items-center justify-start gap-1 px-4 xl:px-6 py-3 bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="flex items-center gap-1 w-full">
          {menuItems.map(({ name, icon, path, dropdown, children }) => {
            const isActive = isMenuActive(name, path, dropdown, children);

            return (
              <div key={name} className="relative group">
                <button
                  onClick={(e) => handleMenuClick(name, dropdown, path, e)}
                  className={`flex items-center gap-2 px-4 xl:px-5 py-2.5 rounded-xl transition-all duration-200 font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-[#039155] text-white shadow-lg shadow-[#039155]/20"
                      : "text-gray-700 hover:bg-[#039155]/10 hover:text-[#039155] hover:shadow-md"
                  }`}
                >
                  <img
                    src={icon}
                    alt={name}
                    className={`w-5 h-5 object-contain flex-shrink-0 ${
                      isActive ? "filter brightness-0 invert" : ""
                    }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/gmaxepay.png";
                    }}
                  />
                  <span className="text-sm xl:text-base">{name}</span>
                  {dropdown && children && children.length > 0 && (
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>

                {/* Styled Dropdown Menu for Desktop */}
                {dropdown && children && children.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                    <div className="py-2">
                      {children.map((child, index) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <button
                            key={child.name}
                            onClick={() => {
                              navigate(child.path);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-5 py-3 text-sm transition-all duration-200 flex items-center gap-3 ${
                              isChildActive
                                ? "text-[#039155] font-semibold bg-gradient-to-r from-[#039155]/10 to-transparent border-l-4 border-[#039155]"
                                : "text-gray-700 hover:bg-gradient-to-r hover:from-[#039155]/5 hover:to-transparent hover:text-[#039155]"
                            } ${index === 0 ? "mt-1" : ""} ${
                              index === children.length - 1 ? "mb-1" : ""
                            }`}
                          >
                            <svg
                              className={`w-4 h-4 ${
                                isChildActive ? "text-[#039155]" : "text-gray-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <span>{child.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <img
          src={company?.logo || companyLogo}
          alt="Company Logo"
          className="h-8 object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = companyLogo;
          }}
        />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay - Top to Bottom */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setMobileDropdowns({});
              }}
            />
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 right-0 z-50 bg-white lg:hidden flex flex-col max-h-[90vh]"
            >
              {/* Mobile Header - Fixed at Top */}
              <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
                <div className="flex items-center justify-between">
                  <img
                    src={company?.logo || companyLogo}
                    alt="Company Logo"
                    className="h-10 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = companyLogo;
                    }}
                  />
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileDropdowns({});
                    }}
                    className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Navigation - Scrollable with Dropdowns */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                {menuItems.map(({ name, icon, path, dropdown, children }) => {
                  const isActive = isMenuActive(name, path, dropdown, children);
                  const isOpen = mobileDropdowns[name] || false;

                  return (
                    <div key={name} className="space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dropdown && children && children.length > 0) {
                            // Toggle dropdown and navigate to base path (e.g. Members page)
                            setMobileDropdowns((prev) => ({
                              ...prev,
                              [name]: !prev[name],
                            }));
                            // Navigate to parent route but keep menu open
                            if (path) {
                              navigate(path);
                            }
                          } else {
                            // Navigate if no dropdown
                            handleMenuClick(name, dropdown, path, e);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                          isActive
                            ? "bg-[#039155] text-white shadow-md"
                            : "text-gray-700 hover:bg-[#039155]/10 hover:text-[#039155]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={icon}
                            alt={name}
                            className={`w-5 h-5 object-contain flex-shrink-0 ${
                              isActive ? "filter brightness-0 invert" : ""
                            }`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/img/gmaxepay.png";
                            }}
                          />
                          <span>{name}</span>
                        </div>
                        {dropdown && children && children.length > 0 && (
                          <svg
                            className={`w-4 h-4 transition-transform flex-shrink-0 ${
                              isOpen ? "rotate-180" : ""
                            } ${isActive ? "text-white" : "text-gray-500"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </button>

                      {/* Mobile Dropdown - Simple Top to Bottom */}
                      {dropdown && children && children.length > 0 && (
                        <AnimatePresence mode="wait">
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden w-full"
                            >
                              <div className="ml-4 mt-2 mb-2 space-y-1">
                                {children.map((child, index) => {
                                  const isChildActive =
                                    location.pathname === child.path ||
                                    location.pathname.startsWith(child.path + "/");
                                  return (
                                    <button
                                      key={child.name}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(child.path);
                                        setIsMobileMenuOpen(false);
                                        setMobileDropdowns({});
                                      }}
                                      className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-all duration-200 flex items-center gap-3 ${
                                        isChildActive
                                          ? "text-[#039155] font-semibold bg-gray-100"
                                          : "text-gray-700 hover:bg-gray-50"
                                      }`}
                                    >
                                      <svg
                                        className={`w-4 h-4 flex-shrink-0 ${
                                          isChildActive ? "text-[#039155]" : "text-gray-400"
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 5l7 7-7 7"
                                        />
                                      </svg>
                                      <span>{child.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HorizontalNavBar;

