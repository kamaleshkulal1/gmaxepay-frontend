import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useCompany } from "../../context/CompanyContext";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/action/userProfileAction";
import { useNotification } from "../../context/NotificationContext";
import DynamicSidebar from "../../components/DynamicSidebar";
import HorizontalNavBar from "../../components/HorizontalNavBar";

// Use absolute paths for public folder assets
const NotificationIcon = "/img/NotificationIcon.png";
const defaultProfileImage = "/img/defaultProfilelogo.png";
const companyLogo = "/img/gmaxepay.png";

const WhiteLabelDashboardLayout = ({ children }) => {
  const { company } = useCompany();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const { email, name, unauthorized, error } = useSelector(
    (state) => state.userProfile
  );
  const permissions = useSelector((state) => state?.auth?.permissions);

  // Get navigation type from company context
  const navigationType = company?.navigationBar || "VERTICAL";
  const isHorizontal = navigationType === "HORIZONTAL";

  // State for open dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);
  // State for active (highlighted) main menu item - will be determined by route
  const [activeMenu, setActiveMenu] = useState(null);
  // State for mobile sidebar (vertical) or mobile menu (horizontal)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Handle unauthorized token expiration - redirect to login
  useEffect(() => {
    if (unauthorized) {
      const errorMessage = error || "Invalid token. Please login again.";
      showNotification({
        message: errorMessage,
        type: "error",
        duration: 3000,
        isCritical: true, // Mark as critical so it shows on dashboard
      });
      // Redirect to login after a short delay to show notification
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 500);
    }
  }, [unauthorized, error, navigate, showNotification]);

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsMobileMenuOpen(false);
    // Reset active menu when route changes - let DynamicSidebar determine it from path
    setActiveMenu(null);
  }, [location.pathname]);

  // Referral code - can be fetched from state or props
  const referralCode = "NPSK6P9R4";

  const shareReferralCode = () => {
    if (navigator.share) {
      navigator.share({
        title: "Referral Code",
        text: `Use my referral code: ${referralCode}`,
      });
    } else {
      // Fallback to copy if share is not available
      navigator.clipboard.writeText(referralCode);
      showNotification({
        type: "success",
        message: "Referral code copied to clipboard!",
        duration: 2000,
      });
    }
  };

  // If horizontal navigation
  if (isHorizontal) {
    return (
      <div className="relative flex flex-col h-screen text-[#1B1717] font-[Gilroy-Medium] overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-col flex-1 w-full min-h-screen overflow-hidden">
          {/* Header with Profile */}
          <div className="sticky top-0 z-40 px-2 sm:px-4 lg:px-6 pt-4 pb-2 flex-shrink-0">
            <header className="bg-white rounded-xl shadow-sm px-4 sm:px-6 lg:px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-base lg:text-lg font-semibold text-[#1B1717]">
                    Welcome Back !
                  </h1>
                  <p className="text-sm text-[#1B1717]">{name || email || "Admin"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 bg-gray-50 transition hover:bg-gray-100">
                  <img
                    src={NotificationIcon}
                    alt="Notifications"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/gmaxepay.png";
                    }}
                  />
                </button>

                <div className="flex items-center gap-2">
                  <span className="hidden text-xl font-semibold text-[#1B1717] sm:inline">
                    Admin Panel
                  </span>
                  <img
                    src={defaultProfileImage}
                    alt="Profile"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = companyLogo;
                    }}
                  />
                </div>
              </div>
            </header>
          </div>

          {/* Horizontal Navigation Bar - Below Profile, Always Visible */}
          <div className="sticky top-[73px] z-30 bg-white">
            <HorizontalNavBar
              permissions={permissions}
              dashboardType="admin"
              company={company}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>

          {/* Page Content */}
          <main className="flex-1 w-full p-2 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // If vertical navigation (sidebar) - default behavior
  return (
    <div className="relative flex h-screen text-[#1B1717] font-[Gilroy-Medium] overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Dynamic Sidebar */}
      <DynamicSidebar
        permissions={permissions}
        dashboardType="admin"
        company={company}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        footerContent={
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-sm font-medium text-[#1B1717]">Referral Code</p>
              <button
                onClick={shareReferralCode}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Share referral code"
              >
                <img
                  src="/img/shareIcon.png"
                  alt="Share"
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/gmaxepay.png";
                  }}
                />
              </button>
            </div>
            <p className="text-sm font-medium text-[#1B1717]">
              {referralCode}
            </p>
          </div>
        }
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full min-h-screen overflow-hidden lg:ml-[277px]">
        {/* Header */}
        <div className="sticky top-0 z-20 px-2 sm:px-4 lg:px-6 pt-4 pb-2 flex-shrink-0">
          <header className="bg-white rounded-xl shadow-sm px-4 sm:px-6 lg:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-md text-[#1B1717] focus:outline-none lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base lg:text-lg font-semibold text-[#1B1717]">
                  Welcome Back !
                </h1>
                <p className="text-sm text-[#1B1717]">{name || email || "Admin"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-gray-300 bg-gray-50 transition hover:bg-gray-100">
                <img
                  src={NotificationIcon}
                  alt="Notifications"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/gmaxepay.png";
                  }}
                />
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden text-xl font-semibold text-[#1B1717] sm:inline">
                  Admin Panel
                </span>
                <img
                  src={defaultProfileImage}
                  alt="Profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = companyLogo;
                  }}
                />
              </div>
            </div>
          </header>
        </div>

        {/* Page Content */}
        <main className="flex-1 w-full p-2 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WhiteLabelDashboardLayout;




