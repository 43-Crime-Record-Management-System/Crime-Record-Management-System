import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScheduleCourtHearingModal from "./ScheduleCourtHearingModal";
import { useNotifications } from "../../context/NotificationContext";
import { EVIDENCE_API_URL } from "../../config";

const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 25px rgba(0,0,0,0.6)",
};

const CourtHearings = () => {

  const { caseId } = useParams();
  const { showAlert, showConfirm } = useNotifications();

  const [showModal, setShowModal] = useState(false);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchHearings = useCallback(async () => {
    if (!caseId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${EVIDENCE_API_URL}/hearings/${caseId}`
      );
      setHearings(res.data || []);
    } catch (error) {
      console.error("Fetch hearings error:", error);
      setHearings([]);
    } finally {
      setLoading(false);
    }
  }, [caseId]);
  useEffect(() => {
    fetchHearings();
  }, [fetchHearings]);


  const handleAddHearing = async (data) => {
    try {
      const res = await axios.post(
        `${EVIDENCE_API_URL}/hearings`,
        {
          caseId: caseId,   // 🔥 DO NOT convert to Number
          date: data.date,
          court: data.court,
          purpose: data.purpose,
        }
      );

      setHearings(prev => [res.data, ...prev]);
      setShowModal(false);
      showAlert("Court hearing has been scheduled successfully.", "Hearing Scheduled", "success");

    } catch (error) {
      console.error(error.response?.data || error);
      showAlert("Failed to schedule hearing. Please check the details and try again.", "Error", "error");
    }
  };


  /* ✅ UPDATE STATUS */
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${EVIDENCE_API_URL}/hearings/${id}/status?status=${status}`
      );

      setHearings(prev =>
        prev.map(h => (h.id === id ? res.data : h))
      );
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  /* ✅ DELETE */
  const deleteHearing = async (id) => {
    const confirmed = await showConfirm(
      "Are you sure you want to delete this court hearing? This action cannot be undone.",
      "Delete Hearing"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${EVIDENCE_API_URL}/hearings/${id}`
      );

      setHearings(prev =>
        prev.filter(h => h.id !== id)
      );

      showAlert("Court hearing removed successfully.", "Deleted", "success");
    } catch (error) {
      console.error("Delete error:", error);
      showAlert("Failed to delete hearing.", "Error", "error");
    }
  };

  return (
    <div className="ps-5">

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-outline-info"
          onClick={() => setShowModal(true)}
        >
          + Schedule Hearing
        </button>
      </div>

      {loading && (
        <div className="text-secondary">
          Loading hearings...
        </div>
      )}

      {!loading && hearings.length === 0 && (
        <div className="text-center text-secondary py-5">
          📅 No court hearings scheduled
        </div>
      )}

      <div className="d-flex flex-column gap-3">

        {hearings.map((h) => (
          <div
            key={h.id}
            style={{ ...cardStyle, padding: "18px 20px" }}
          >
            <div className="d-flex justify-content-between align-items-center">

              <div>
                <div className="fw-semibold text-light">
                  {h.court}
                </div>

                <div className="text-secondary small">
                  {h.purpose}
                </div>

                <div className="text-secondary small mt-1">
                  🕒 {new Date(h.date).toDateString()}
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">

                <span
                  className="badge rounded-pill"
                  style={{
                    background:
                      h.status === "Completed"
                        ? "rgba(34,197,94,.15)"
                        : "rgba(59,130,246,.15)",
                    color:
                      h.status === "Completed"
                        ? "#22c55e"
                        : "#60a5fa",
                  }}
                >
                  {h.status}
                </span>

                {h.status !== "Completed" && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      updateStatus(h.id, "Completed")
                    }
                  >
                    Complete
                  </button>
                )}

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteHearing(h.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

      {showModal && (
        <ScheduleCourtHearingModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddHearing}
        />
      )}

    </div>
  );
};

export default CourtHearings;
