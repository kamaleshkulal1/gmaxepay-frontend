import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCompany } from '../context/CompanyContext';

const NotFound = () => {
  const { company, loading } = useCompany();
  const location = useLocation();
  const user = useSelector((state) => state?.auth?.user);
  const userRole = user?.user?.userRole;

  // Determine the correct home path based on current route and user role
  const getHomePath = () => {
    // If we're in a dashboard route, determine based on the path
    if (location.pathname.includes('/superDashboard')) {
      return '/superDashboard/home';
    } else if (location.pathname.includes('/adminDashboard')) {
      return '/adminDashboard/home';
    } else if (location.pathname.includes('/masterDistributerDashboard')) {
      return '/masterDistributerDashboard/home';
    } else if (location.pathname.includes('/distributerDashboard')) {
      return '/distributerDashboard/home';
    } else if (location.pathname.includes('/retailerDashboard')) {
      return '/retailerDashboard/home';
    } else if (location.pathname.includes('/employeeDashboard')) {
      return '/employeeDashboard/home';
    }
    
    // Fallback to user role based path
    if (userRole) {
      const rolePaths = {
        1: '/superDashboard/home',
        2: '/adminDashboard/home',
        3: '/masterDistributerDashboard/home',
        4: '/distributerDashboard/home',
        5: '/retailerDashboard/home',
        6: '/employeeDashboard/home',
      };
      return rolePaths[userRole] || '/superDashboard/home';
    }
    
    // Default fallback
    return '/superDashboard/home';
  };

  const homePath = getHomePath();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <img 
          src="/img/pageNotFound.png" 
          alt="Page Not Found" 
          className="mx-auto mb-6 max-w-xs md:max-w-md"
        />
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-4">The page you're looking for doesn't exist.</p>
        {!loading && (
          <Link
            to={homePath}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-white rounded-lg transition-colors"
            style={{
              backgroundColor: company?.primaryColor || '#039155'
            }}
            onMouseEnter={(e) => {
              if (company?.secondaryColor) {
                e.target.style.backgroundColor = company.secondaryColor;
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = company?.primaryColor || '#039155';
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Go Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
