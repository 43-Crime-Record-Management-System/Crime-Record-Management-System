import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Info,
  Clock,
  MapPin,
  FileText,
  Calendar,
  X
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { FIR_API_URL } from "../../config";

const FIRList = () => {
  const { showAlert, showConfirm } = useNotifications();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [firs, setFirs] = useState([]);

  const filterRef = useRef(null);

  /* ================= FETCH FIRs ================= */
  const fetchFIRs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${FIR_API_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      const formatted = data.map((fir) => {

        let uiStatus = "Registered";

        if (fir.status === "REGISTERED") uiStatus = "Registered";
        else if (fir.status === "ASSIGNED") uiStatus = "Assigned";
        else if (fir.status === "IN_PROGRESS") uiStatus = "Investigating";
        else if (fir.status === "CLOSED") uiStatus = "Closed";
        else if (fir.status === "REJECTED") uiStatus = "Rejected";

        return {
          ...fir,
          originalStatus: fir.status,
          complainant: fir.fullName,
          status: uiStatus,
          date: fir.incidentDate
            ? new Date(fir.incidentDate).toLocaleDateString()
            : "",
          location: fir.incidentLocation,
          sections: fir.ipcSections
            ? fir.ipcSections.join(", ")
            : "",
        };
      });

      setFirs(formatted);

    } catch (err) {
      console.error("Error fetching FIRs:", err);
    }
  };

  useEffect(() => {
    fetchFIRs();
  }, []);

  /* ================= CLOSE CASE ================= */
  const closeCase = async (id) => {
    const confirmClose = await showConfirm(
      "Are you sure you want to close this case? This action cannot be undone.",
      "Close Case"
    );
    if (!confirmClose) return;

    try {
      const res = await fetch(
        `${FIR_API_URL}/status/${id}?status=CLOSED`,
        { method: "PUT" }
      );

      if (!res.ok) {
        showAlert("Failed to close case. Please try again later.", "Error", "error");
        return;
      }

      await showAlert("Case Closed Successfully ✅", "Success", "success");

      await fetchFIRs();
      setSelectedFIR(null);

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filtered = firs.filter((fir) => {

    const matchSearch =
      fir.id?.toLowerCase().includes(search.toLowerCase()) ||
      fir.complainant?.toLowerCase().includes(search.toLowerCase()) ||
      fir.description?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || fir.status === statusFilter;

    return matchSearch && matchStatus;
  });

  /* ================= CLICK OUTSIDE FILTER ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= STATUS STYLE ================= */
  const statusStyle = {
    Assigned: {
      background: "rgba(59,130,246,.15)",
      color: "#60a5fa",
    },
    Investigating: {
      background: "rgba(245,158,11,.15)",
      color: "#f59e0b",
    },
    Registered: {
      background: "rgba(234,179,8,.15)",
      color: "#facc15",
    },
    Closed: {
      background: "rgba(34,197,94,.15)",
      color: "#22c55e",
    },
    Rejected: {
      background: "rgba(239,68,68,.15)",
      color: "#ef4444",
    }
  };

  const iconStyle = {
    color: "#38bdf8",
    filter: "drop-shadow(0 0 4px rgba(56,189,248,0.4))"
  };

  const placeholderStyle = `
    .topbar-search::placeholder {
      color: #ffffff !important;
      opacity: 0.6;
    }
    .search-box {
      background: transparent;
      border: 1px solid #1e293b;
      border-radius: 6px;
      padding: 0 12px;
      height: 38px;
    }
    .search-box:hover,
    .search-box:focus-within {
      background: transparent;
      border-color: #38bdf8;
      box-shadow: 0 0 0 1px rgba(56,189,248,0.4);
    }
    .filter-btn {
      background: transparent !important;
      border: 1px solid #1e293b !important;
      color: #cbd5f5 !important;
      border-radius: 6px !important;
      padding: 0 16px !important;
      height: 38px !important;
      min-width: 150px !important;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .filter-btn:hover,
    .filter-btn:focus,
    .filter-btn.active {
      background: rgba(56, 189, 248, 0.08) !important;
      border-color: #38bdf8 !important;
      color: #38bdf8 !important;
      box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4) !important;
    }
    .dropdown-filter-item {
      color: #cbd5f5;
      transition: all 0.15s ease;
      font-size: 13px;
    }
    .dropdown-filter-item:hover {
      background: rgba(56, 189, 248, 0.12) !important;
      color: #38bdf8 !important;
    }
    .dropdown-filter-item.active {
      background: rgba(56, 189, 248, 0.2) !important;
      color: #38bdf8 !important;
      font-weight: 600;
    }
  `;

  return (
    <div className="text-light">
      <style>{placeholderStyle}</style>

      <div className="d-flex align-items-center gap-2 mb-4">

        <div className="d-flex align-items-center gap-2 flex-grow-1 search-box">
          <Search size={14} style={iconStyle} />
          <input
            className="form-control bg-transparent border-0 p-0 topbar-search"
            placeholder="Search by FIR number, complainant, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ color: "#ffffff", boxShadow: "none" }}
          />
        </div>

        <div className="position-relative" ref={filterRef}>
          <button
            className={`btn filter-btn d-flex align-items-center justify-content-center gap-2 ${openFilter ? "active" : ""}`}
            onClick={() => setOpenFilter((p) => !p)}
          >
            <Filter size={14} style={iconStyle} />
            {statusFilter === "ALL" ? "All Status" : statusFilter}
          </button>

          {openFilter && (
            <div
              className="position-absolute mt-1 rounded border shadow-lg"
              style={{
                background: "#020617",
                borderColor: "#1e293b",
                width: "100%",
                zIndex: 1030,
                right: 0,
                overflow: "hidden"
              }}
            >
              {["ALL", "Registered", "Assigned", "Investigating", "Closed", "Rejected"].map((s) => (
                <div
                  key={s}
                  className={`px-3 py-2 dropdown-filter-item ${statusFilter === s ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setStatusFilter(s);
                    setOpenFilter(false);
                  }}
                >
                  {s === "ALL" ? "All Status" : s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtered.map((fir) => (
        <div
          key={fir.id}
          className="d-flex justify-content-between align-items-center p-3 mb-3 rounded"
          style={{
            background:
              "linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.02)"
          }}
        >
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              {fir.status === "Investigating" ? (
                <Info size={14} style={iconStyle} />
              ) : (
                <Clock size={14} style={iconStyle} />
              )}

              <strong>{fir.id}</strong>

              <span
                className="badge rounded-pill"
                style={statusStyle[fir.status]}
              >
                {fir.status}
              </span>
            </div>

            <p className="mb-1">
              <strong>Complainant:</strong> {fir.complainant}
            </p>

            <p className="small text-secondary">{fir.description}</p>

            <div className="d-flex flex-wrap gap-3 small text-secondary">
              <span className="d-flex align-items-center gap-1">
                <Calendar size={14} style={iconStyle} /> {fir.date}
              </span>
              <span className="d-flex align-items-center gap-1">
                <MapPin size={14} style={iconStyle} /> {fir.location}
              </span>
              <span className="d-flex align-items-center gap-1">
                <FileText size={14} style={iconStyle} /> {fir.sections}
              </span>
            </div>
          </div>

          <button
            className="btn btn-outline-info"
            onClick={() => navigate(`/dashboard/fir/${fir.id}`)}
            style={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            View Details
          </button>
        </div>
      ))}


    </div>
  );
};

export default FIRList;