import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { FIR_API_URL } from "../../config";

export default function FirApproval() {
  const navigate = useNavigate();
  const { showAlert } = useNotifications();

  const [firs, setFirs] = useState([]);
  const [selectedFir, setSelectedFir] = useState(null);
  const [rejectReason, setRejectReason] = useState("");


  useEffect(() => {
    fetchFirs();
  }, []);

  const fetchFirs = async () => {
    try {

      const pending = await fetch(`${FIR_API_URL}/status/PENDING`);
      const registered = await fetch(`${FIR_API_URL}/status/REGISTERED`);
      const rejected = await fetch(`${FIR_API_URL}/status/REJECTED`);

      const data1 = await pending.json();
      const data2 = await registered.json();
      const data3 = await rejected.json();

      const allFirs = [
        ...(data1 || []),
        ...(data2 || []),
        ...(data3 || []),
      ];

      setFirs(allFirs);

    } catch (err) {
      console.error("FIR fetch failed:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {

      let url = `${FIR_API_URL}/status/${id}?status=${status}`;

      if (status === "REJECTED") {
        url += `&reason=${encodeURIComponent(rejectReason)}`;
      }

      const res = await fetch(url, { method: "PUT" });

      if (!res.ok) {
        throw new Error("Status update failed");
      }

      await fetchFirs();

      setRejectReason("");

      showAlert(`FIR ${status} successfully ✅`, "Status Updated", "success");

    } catch (err) {
      console.error("Status update failed:", err);
      showAlert("Something went wrong while updating FIR status. Please try again.", "Error", "error");
    }
  };


  const statusStyle = (status) => {
    if (status === "PENDING")
      return { background: "rgba(234,179,8,.15)", color: "#facc15" };

    if (status === "REGISTERED")
      return { background: "rgba(34,197,94,.15)", color: "#4ade80" };

    return { background: "rgba(239,68,68,.15)", color: "#f87171" };
  };

  return (
    <div style={{ color: "#e5e7eb" }}>

      <div style={panelCard}>

        <div style={panelHeader}>
          <h6 className="mb-0 fw-semibold text-light">
            Pending & Registered FIRs
          </h6>
        </div>

        <div className="table-responsive">
          <table style={tableStyle}>

            <thead>
              <tr>
                <th style={th}>FIR No</th>
                <th style={th}>Complainant</th>
                <th style={th}>Crime</th>
                <th style={th}>Status</th>
                <th style={{ ...th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {firs.map((fir) => (
                <tr key={fir.id} style={rowStyle}>

                  <td style={{ ...td, color: "#38bdf8" }}>
                    {fir.id}
                  </td>

                  <td style={td}>{fir.fullName}</td>

                  <td style={td}>
                    {fir.ipcSections?.join(", ") || "-"}
                  </td>

                  <td style={td}>
                    <span style={{ ...badge, ...statusStyle(fir.status) }}>
                      {fir.status}
                    </span>
                  </td>

                  <td style={{ ...td, textAlign: "center" }}>
                    {fir.status === "PENDING" ? (
                      <button
                        style={reviewBtn}
                        onClick={() => setSelectedFir(fir)}
                      >
                        Review
                      </button>
                    ) : (
                      <span style={{ color: "#64748b" }}>—</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div style={panelFooter}>
          <small className="text-secondary">
            Showing {firs.length} FIR records
          </small>
        </div>

      </div>


      {selectedFir && (
        <div style={modalOverlay}>

          <div style={modalCard}>

            <h6 className="mb-3 text-light">
              Review FIR – {selectedFir.id}
            </h6>

            <div className="mb-2">
              <small className="text-secondary">Complainant</small>
              <div>{selectedFir.fullName}</div>
            </div>

            <div className="mb-3">
              <small className="text-secondary">Crime</small>
              <div>{selectedFir.ipcSections?.join(", ")}</div>
            </div>

            <button
              style={outlineBtn}
              onClick={() =>
                navigate(`/sho/fir/${selectedFir.id}`)
              }
            >
              View Full FIR
            </button>

            <textarea
              rows="3"
              placeholder="Enter rejection reason"
              style={textarea}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-3 mt-4">

              <button
                style={approveBtn}
                onClick={() =>
                  updateStatus(selectedFir.id, "REGISTERED")
                }
              >
                Register
              </button>

              <button
                style={rejectBtn}
                disabled={!rejectReason}
                onClick={() =>
                  updateStatus(selectedFir.id, "REJECTED")
                }
              >
                Reject
              </button>

              <button
                style={cancelBtn}
                onClick={() => setSelectedFir(null)}
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

const panelCard = {
  background: "linear-gradient(145deg,#0b1220,#020617)",
  border: "1px solid #1e293b",
  borderRadius: "18px",
  boxShadow: "0 30px 80px rgba(0,0,0,.7)",
  overflow: "hidden",
};

const panelHeader = {
  padding: "18px 22px",
  borderBottom: "1px solid #1e293b",
};

const panelFooter = {
  padding: "12px 22px",
  borderTop: "1px solid #1e293b",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  padding: "14px",
  textAlign: "left",
  fontSize: "13px",
  color: "#93c5fd",
  borderBottom: "1px solid #1e293b",
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #1e293b",
};

const rowStyle = {
  background: "rgba(2,6,23,.4)",
};

const badge = {
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 600,
};

const reviewBtn = {
  background: "#38bdf8",
  color: "#020617",
  border: "none",
  padding: "5px 14px",
  borderRadius: "8px",
  fontSize: "13px",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalCard = {
  width: "360px",
  background: "linear-gradient(145deg,#0b1220,#020617)",
  border: "1px solid #1e293b",
  borderRadius: "16px",
  padding: "22px",
};

const outlineBtn = {
  width: "100%",
  marginBottom: "12px",
  background: "transparent",
  border: "1px solid #38bdf8",
  color: "#38bdf8",
  padding: "6px",
  borderRadius: "8px",
};

const textarea = {
  width: "100%",
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  padding: "8px",
  color: "#e5e7eb",
};

const approveBtn = {
  background: "#22c55e",
  border: "none",
  padding: "6px 14px",
  borderRadius: "8px",
  color: "#020617",
};

const rejectBtn = {
  background: "#ef4444",
  border: "none",
  padding: "6px 14px",
  borderRadius: "8px",
  color: "#020617",
};

const cancelBtn = {
  background: "transparent",
  border: "1px solid #64748b",
  padding: "6px 14px",
  borderRadius: "8px",
  color: "#94a3b8",
};
