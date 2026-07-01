import { useNavigate } from "react-router-dom";

const FIRSuccess = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex align-items-center justify-content-center text-light"
      style={{
        minHeight: "70vh",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "18px",
          padding: "36px",
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "12px",
          }}
        >
          ✅
        </div>

        <h3 className="fw-semibold mb-2">
          FIR Registered Successfully
        </h3>

        <p className="text-secondary mb-4">
          The First Information Report has been securely recorded
          in the system.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-outline-info px-4"
            onClick={() => navigate("/dashboard/fir")}
          >
            View All FIRs
          </button>

          <button
            className="btn btn-info px-4 fw-semibold"
            onClick={() => navigate("/dashboard/fir")}
          >
            Register New FIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default FIRSuccess;
