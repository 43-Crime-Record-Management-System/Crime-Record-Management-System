import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../pages/admin/AdminSidebar";
import Topbar from "../components/Topbar";

const AdminLayout = () => {

  const location = useLocation();


  const pageConfig = {
    "/admin": {
      title: "Admin Dashboard",
      subtitle:
        "Headquarters overview of crime records and system activity",
    },

    "/admin/dashboard": {
      title: "Admin Dashboard",
      subtitle:
        "Headquarters overview of crime records and system activity",
    },

    "/admin/users": {
      title: "User Management",
      subtitle:
        "Manage system users, roles and access",
    },

    "/admin/audit": {
      title: "System Audit",
      subtitle:
        "Track platform activities and logs",
    },
    "/admin/personnel": {
      title: "Force Overview",
      subtitle:
        "Detailed performance metrics and workload tracking for all personnel",
    },
  };

  const currentPage =
    pageConfig[location.pathname] || {
      title: "SecureFile Admin",
      subtitle: "",
    };

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(160% 120% at 50% 0%, #0b1220 0%, #020617 65%, #020617 100%)",
      }}
    >

      <AdminSidebar />


      <div className="flex-grow-1">

        <Topbar
          title={currentPage.title}
          subtitle={currentPage.subtitle}
        />


        <main
          className="px-4"
          style={{
            paddingTop: "96px",
            marginLeft: "240px",
            minHeight: "100vh",
            background: "transparent",
          }}
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
