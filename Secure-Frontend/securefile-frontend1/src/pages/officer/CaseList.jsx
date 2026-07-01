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

const CaseList = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const officerId = localStorage.getItem("officerId");
      if (!officerId) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${FIR_API_URL}/officer/${officerId}`
      );

      // ✅ SHOW BOTH ASSIGNED + IN_PROGRESS
      const filteredCases = (res.data || []).filter(
        (f) =>
          f.status === "ASSIGNED" ||
          f.status === "IN_PROGRESS"
      );

      setCases(filteredCases);

    } catch (err) {
      console.error("Error fetching cases:", err);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const startInvestigation = async (caseId, status) => {
    try {

      // 🔥 Only update if still ASSIGNED
      if (status === "ASSIGNED") {
        await axios.put(
          `${FIR_API_URL}/status/${caseId}?status=IN_PROGRESS`
        );
      }

      navigate(`/dashboard/cases/${caseId}`);

    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <div className="container py-4 text-white">

      <div className="text-center mb-5">
        <h3 className="fw-semibold mb-1">
          Active Investigations
        </h3>
        <small className="text-secondary">
          View and manage your assigned cases
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
          <h6>No Active Cases</h6>
          <p className="text-secondary small mb-0">
            You currently have no assigned investigations.
          </p>
        </div>
      ) : (
        <div className="row justify-content-center g-4">
          {cases.map((c) => (
            <div key={c.id} className="col-md-5 col-lg-4">
              <div
                style={{
                  ...cardStyle,
                  padding: "22px",
                  borderLeft:
                    c.status === "IN_PROGRESS"
                      ? "4px solid #f59e0b"
                      : "4px solid #38bdf8",
                  height: "100%",
                  cursor: "pointer",
                }}
                onClick={() =>
                  startInvestigation(c.id, c.status)
                }
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="fw-semibold">
                    Case #{c.id}
                  </div>

                  <span
                    className="badge rounded-pill"
                    style={{
                      background:
                        c.status === "IN_PROGRESS"
                          ? "rgba(245,158,11,.15)"
                          : "rgba(59,130,246,.15)",
                      color:
                        c.status === "IN_PROGRESS"
                          ? "#f59e0b"
                          : "#60a5fa",
                      fontSize: "11px",
                      padding: "6px 12px",
                    }}
                  >
                    {c.status === "IN_PROGRESS"
                      ? "Investigating"
                      : "Assigned"}
                  </span>
                </div>

                <p
                  className="text-secondary small"
                  style={{ minHeight: "50px" }}
                >
                  {c.description || "No description provided"}
                </p>

                <div
                  className="mt-3 small fw-semibold"
                  style={{
                    color:
                      c.status === "IN_PROGRESS"
                        ? "#f59e0b"
                        : "#38bdf8",
                  }}
                >
                  {c.status === "IN_PROGRESS"
                    ? "Continue Investigation →"
                    : "Start Investigation →"}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseList;