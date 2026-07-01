import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const OfficerLayout = () => {
  const location = useLocation();

  const pageConfig = {
    "/dashboard": {
      title: "Welcome back, Officer",
      subtitle: "",
      showTime: true,
    },
    "/dashboard/fir": {
      title: "FIR Portal",
      subtitle: "View and register First Information Reports",
      showTime: false,
    },
    "/dashboard/fir/register": {
      title: "Register FIR",
      subtitle: "File a new First Information Report",
      showTime: false,
    },
    "/dashboard/criminals": {
      title: "Criminal Records",
      subtitle: "Search and manage profiles",
      showTime: false,
    },
    "/dashboard/cases": {
      title: "Case Investigation",
      subtitle: "Manage active investigations and evidence",
      showTime: false,
    },
    "/dashboard/settings": {
      title: "Settings",
      subtitle: "Manage your account and preferences",
      showTime: false,
    },
    "/dashboard/notifications": {
      title: "Notifications",
      subtitle: "View system alerts and updates",
      showTime: false,
    },
  };

  let currentPage = pageConfig[location.pathname];

  if (!currentPage && location.pathname.startsWith("/dashboard/fir/")) {
    currentPage = {
      title: "FIR Official Record",
      subtitle: "Detailed view of First Information Report",
      showTime: false,
    };
  }

  if (!currentPage && location.pathname.startsWith("/dashboard/cases/")) {
    currentPage = {
      title: "Case Investigation",
      subtitle: "Manage active investigations and evidence",
      showTime: false,
    };
  }

  if (!currentPage) {
    currentPage = {
      title: "SecureFile",
      subtitle: "",
      showTime: false,
    };
  }

  return (
    <div className="min-vh-100" style={{ background: "#020617" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "240px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          showTime={currentPage.showTime}
        />

        <div
          className="px-4 pb-4"
          style={{
            paddingTop: "72px",
            flexGrow: 1,
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OfficerLayout;
