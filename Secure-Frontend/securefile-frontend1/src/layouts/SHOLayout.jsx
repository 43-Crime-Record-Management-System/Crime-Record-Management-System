// ================= SHO LAYOUT =================
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SHOLayout = () => {

  const location = useLocation();


  const pageConfig = {
    "/sho": {
      title: "Dashboard",
      subtitle: "Overview of crime statistics",
    },

    "/sho/fir-approvals": {
      title: "FIR Approvals",
      subtitle: "Review and approve registered FIRs",
    },

    "/sho/case-assignment": {
      title: "Case Assignment",
      subtitle: "Assign approved FIRs to officers",
    },

    "/sho/performance": {
      title: "Officer Performance",
      subtitle: "Track officer case performance",
    },

    "/sho/case-monitoring": {
      title: "Case Monitoring",
      subtitle: "Monitor ongoing investigations",
    },
  };

  const currentPage =
    pageConfig[location.pathname] || {
      title: "SecureFile",
      subtitle: "",
    };

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
        />

        <main
          className="px-4 pb-4"
          style={{
            paddingTop: "88px",
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            flexGrow: 1,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SHOLayout;
