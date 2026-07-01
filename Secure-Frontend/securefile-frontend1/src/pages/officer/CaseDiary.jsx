import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddCaseEntryModal from "./AddCaseEntryModal";
import UploadEvidenceModal from "./UploadEvidenceModal";
import CourtHearings from "./CourtHearings";
import { useNotifications } from "../../context/NotificationContext";
import { EVIDENCE_API_URL, FIR_API_URL } from "../../config";

const cardStyle = {
  background:
    "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 25px rgba(0,0,0,0.6)",
};

const CaseDiary = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useNotifications();

  const [activeTab, setActiveTab] = useState("diary");
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [evidenceList, setEvidenceList] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [loadingDiary, setLoadingDiary] = useState(true);
  const [loadingEvidence, setLoadingEvidence] = useState(true);

  /* ---------------- FETCH EVIDENCE ---------------- */
  const fetchEvidence = useCallback(async () => {
    if (!caseId) return;

    try {
      setLoadingEvidence(true);
      const res = await axios.get(
        `${EVIDENCE_API_URL}/evidence/${caseId}`
      );
      setEvidenceList(res.data || []);
    } catch (err) {
      console.error("Error fetching evidence:", err);
      setEvidenceList([]);
    } finally {
      setLoadingEvidence(false);
    }
  }, [caseId]);

  /* ---------------- FETCH DIARY ---------------- */
  const fetchDiary = useCallback(async () => {
    if (!caseId) return;

    try {
      setLoadingDiary(true);
      const res = await axios.get(
        `${EVIDENCE_API_URL}/case-diary/${caseId}`
      );

      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setDiaryEntries(sorted);
    } catch (err) {
      console.error("Error fetching diary:", err);
      setDiaryEntries([]);
    } finally {
      setLoadingDiary(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchEvidence();
    fetchDiary();
  }, [fetchEvidence, fetchDiary]);

  /* ---------------- ADD DIARY ---------------- */
  const handleAddDiaryEntry = async (entry) => {
    try {
      await axios.post(
        `${EVIDENCE_API_URL}/case-diary`,
        {
          caseId: caseId,
          date: entry.date,
          type: entry.type,
          description: entry.description,
        }
      );

      await fetchDiary();
      setShowAddEntry(false);
      showAlert("New entry added to case diary.", "Entry Added", "success");
    } catch (error) {
      console.error("Add diary error:", error);
      showAlert("There was an error adding your entry. Please try again.", "Error", "error");
    }
  };

  /* ---------------- ADD EVIDENCE ---------------- */
  const handleAddEvidence = (savedEvidence) => {
    setEvidenceList((prev) => [savedEvidence, ...prev]);
    setShowUpload(false);
    setActiveTab("evidence");
  };

  /* ---------------- CLOSE INVESTIGATION ---------------- */
  const closeInvestigation = async () => {
    const confirmClose = await showConfirm(
      "Are you sure you want to close this investigation? This action cannot be undone.",
      "Close Case"
    );

    if (!confirmClose) return;

    try {
      await axios.put(
        `${FIR_API_URL}/status/${caseId}?status=CLOSED`
      );

      await showAlert("The investigation has been closed successfully.", "Case Closed", "success");

      navigate("/dashboard/cases");

    } catch (error) {
      console.error("Close failed:", error);
      showAlert("Failed to close investigation. Please try again later.", "Error", "error");
    }
  };

  return (
    <div className="p-4 text-light mt-3">
      <div className="row g-4">

        {/* LEFT SIDE */}
        <div className="col-md-3">
          <h6 className="text-light mb-2">Active Case</h6>

          <div style={cardStyle} className="p-3">
            <p className="fw-semibold mb-2">
              Case ID: {caseId}
            </p>

            <span
              className="badge rounded-pill mb-3"
              style={{
                background: "rgba(245,158,11,.15)",
                color: "#f59e0b",
              }}
            >
              High
            </span>

            {/* 🔥 CLOSE BUTTON */}
            <button
              className="btn btn-success w-100 mt-2"
              onClick={closeInvestigation}
            >
              Close Investigation
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-9 d-flex flex-column gap-3">

          <div
            style={cardStyle}
            className="p-4 d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 className="mb-1">Case {caseId}</h5>
              <small className="text-secondary">
                Investigation details
              </small>
            </div>

            {activeTab === "diary" && (
              <button
                className="btn btn-info fw-semibold px-4"
                onClick={() => setShowAddEntry(true)}
              >
                + Add Entry
              </button>
            )}

            {activeTab === "evidence" && (
              <button
                className="btn btn-info fw-semibold px-4"
                onClick={() => setShowUpload(true)}
              >
                + Upload Evidence
              </button>
            )}
          </div>

          {/* TABS */}
          <div className="d-flex gap-2">
            {["diary", "evidence", "court"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="btn btn-sm px-3"
                style={
                  activeTab === tab
                    ? { border: "1px solid #38bdf8", color: "#38bdf8" }
                    : { border: "1px solid #1e293b", color: "#94a3b8" }
                }
              >
                {tab === "diary"
                  ? "Case Diary"
                  : tab === "evidence"
                    ? "Evidence"
                    : "Court Hearings"}
              </button>
            ))}
          </div>

          {/* DIARY TAB */}
          {activeTab === "diary" && (
            <div className="d-flex flex-column gap-3">
              {loadingDiary && (
                <div className="text-secondary">
                  Loading diary entries...
                </div>
              )}

              {!loadingDiary && diaryEntries.length === 0 && (
                <div className="text-secondary">
                  No diary entries yet.
                </div>
              )}

              {diaryEntries.map((entry) => (
                <div key={entry.id} style={cardStyle} className="p-3">
                  <div className="d-flex justify-content-between">
                    <strong>{entry.type}</strong>
                    <small className="text-secondary">
                      {new Date(entry.date).toDateString()}
                    </small>
                  </div>

                  <p className="small text-secondary mt-2 mb-0">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* EVIDENCE TAB */}
          {activeTab === "evidence" && (
            <div className="row g-3">
              {loadingEvidence && (
                <div className="text-secondary">
                  Loading evidence...
                </div>
              )}

              {!loadingEvidence &&
                evidenceList.map((ev) => (
                  <div key={ev.id} className="col-md-6">
                    <div style={cardStyle} className="p-3">
                      <h6>{ev.title}</h6>
                      <p className="small text-secondary">
                        {ev.description || "No description"}
                      </p>
                      <span
                        className="badge rounded-pill"
                        style={{
                          background: "rgba(59,130,246,.15)",
                          color: "#60a5fa",
                        }}
                      >
                        {ev.type}
                      </span>
                      <div className="small text-secondary mt-2">
                        📎 {ev.fileName}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* COURT TAB */}
          {activeTab === "court" && <CourtHearings />}

        </div>
      </div>

      {showAddEntry && (
        <AddCaseEntryModal
          onClose={() => setShowAddEntry(false)}
          onAdd={handleAddDiaryEntry}
        />
      )}

      {showUpload && (
        <UploadEvidenceModal
          caseId={caseId}
          onClose={() => setShowUpload(false)}
          onUpload={handleAddEvidence}
        />
      )}
    </div>
  );
};

export default CaseDiary;