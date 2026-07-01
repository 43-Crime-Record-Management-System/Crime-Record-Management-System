import { useLocation, useNavigate } from "react-router-dom";

const AlertDetails = () => {

  const navigate = useNavigate();
  const { state } = useLocation(); 

  if (!state) {
    return (
      <div style={{ color: "white", padding: 40 }}>
        No Alert Data Found
      </div>
    );
  }

  const colorMap = {
    critical: "#ef4444",
    warning: "#facc15",
    info: "#38bdf8",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "radial-gradient(160% 120% at 50% 0%, #0b1220 0%, #020617 65%, #020617 100%)",
        color: "#e5e7eb",
      }}
    >
      <div className="mb-4">
        <h3 style={{ color: colorMap[state.type] }}>
          {state.title}
        </h3>
        <p style={{ color: "#94a3b8" }}>
          Alert Details & Recommended Actions
        </p>
      </div>

      <div
        style={{
          background: "linear-gradient(145deg,#0b1220,#020617)",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          padding: "26px",
          maxWidth: "700px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
        }}
      >

        <p style={{ fontSize: "15px" }}>
          <strong>Description:</strong><br />
          {state.description}
        </p>

        <hr style={{ borderColor: "#1e293b" }} />

        <p>
          <strong>Severity:</strong>{" "}
          <span style={{ color: colorMap[state.type] }}>
            {state.type.toUpperCase()}
          </span>
        </p>

        <p>
          <strong>Status:</strong> Active
        </p>

        <p>
          <strong>Reported Time:</strong> Just Now
        </p>

        <div className="d-flex gap-3 mt-4">

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

      </div>

    </div>
  );
};

export default AlertDetails;
