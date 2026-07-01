import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FIR_API_URL } from "../../config";

const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(2,6,23,1))",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 20px rgba(0,0,0,0.5)",
};

const InvestigationList = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

const loadCases = async () => {
  try {
    const officerId = localStorage.getItem("officerId");
    if (!officerId) {
      setLoading(false);
      return;
    }

    console.log("OfficerId:", officerId);

    const res = await axios.get(
      `${FIR_API_URL}/officer/${officerId}`
    );

    console.log("Response:", res.data);

    const investigatingCases = (res.data || []).filter(
      (f) =>
        f.status &&
        f.status?.toUpperCase() === "IN_PROGRESS"
    );

    console.log("Filtered:", investigatingCases);

    setCases(investigatingCases);

  } catch (err) {
    console.error("Error fetching investigations:", err);
    setCases([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCases();

    // 🔥 Auto refresh every 3 seconds (temporary testing)
    const interval = setInterval(loadCases, 3000);
    return () => clearInterval(interval);

  }, []);

  return (
    <div className="container py-4 text-white">

      <div className="text-center mb-5">
        <h3 className="fw-semibold mb-1">
          Ongoing Investigations
        </h3>
        <small className="text-secondary">
          Continue your active investigations
        </small>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : cases.length === 0 ? (
        <div
          style={{
            ...cardStyle,
            padding: "60px",
            textAlign: "center",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <h6>No Cases Under Investigation</h6>
        </div>
      ) : (
        <div className="row justify-content-center g-4">
          {cases.map((c) => (
            <div key={c.id} className="col-md-5 col-lg-4">
              <div
                style={{
                  ...cardStyle,
                  padding: "22px",
                  borderLeft: "4px solid #f59e0b",
                  height: "100%",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/dashboard/cases/${c.id}`)}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="fw-semibold">
                    Case #{c.id}
                  </div>

                  <span
                    className="badge rounded-pill"
                    style={{
                      background: "rgba(245,158,11,.15)",
                      color: "#f59e0b",
                      fontSize: "11px",
                      padding: "6px 12px",
                    }}
                  >
                    IN_PROGRESS
                  </span>
                </div>

                <p
                  className="text-secondary small"
                  style={{ minHeight: "50px" }}
                >
                  {c.description || "No description provided"}
                </p>

                <div className="mt-3 text-warning small fw-semibold">
                  Continue Investigation →
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default InvestigationList;