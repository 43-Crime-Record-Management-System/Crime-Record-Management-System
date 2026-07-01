import { useState } from "react";
import CriminalProfile from "./CriminalProfile";
import AddCriminalModal from "./AddCriminalModal";
import { Search, Filter } from "lucide-react";
import { useRecords } from "../../context/RecordsContext";

const CriminalRecords = () => {
  const {
  criminals: criminalList,
  setCriminals,
  isLoadingCriminals: isLoading
} = useRecords();

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  /* ================= HANDLERS ================= */

const handleAddCriminal = (criminal) => {
  const formatted = {
    id: criminal.id,
    name: criminal.fullName,
    alias: criminal.aliases || [],
    gender: criminal.gender,
    dob: criminal.dateOfBirth,
    status: criminal.status,
    physical: criminal.physicalDescription,
    crimes: criminal.crimeTypes || [],
    mugshot: criminal.mugshot,
    fingerprint: criminal.fingerprint,
    linkedCases: [],
    arrests: [],
  };

  const newList = [formatted, ...criminalList];

  setCriminals(newList);

  localStorage.setItem(
    "crim_list_cache",
    JSON.stringify(newList)
  );
};
const handleUpdateCriminal = (updated) => {
  const newList = criminalList.map((c) =>
    c.id === updated.id
      ? {
          ...c,
          mugshot: updated.mugshot,
          fingerprint: updated.fingerprint,
          name: updated.fullName,
          alias: updated.aliases || [],
          status: updated.status,
          crimes: updated.crimeTypes || [],
          physical: updated.physicalDescription,
        }
      : c
  );

  setCriminals(newList);

  localStorage.setItem(
    "crim_list_cache",
    JSON.stringify(newList)
  );

  if (selected && selected.id === updated.id) {
    setSelected(
      newList.find((i) => i.id === updated.id)
    );
  }
};

  /* ================= FILTER ================= */

  const filteredCriminals = criminalList.filter((c) => {
    const term = search.toLowerCase();

    const matchesSearch =
      (c.name || "").toLowerCase().includes(term) ||
      (c.alias || []).join(" ").toLowerCase().includes(term) ||
      (c.physical || "").toLowerCase().includes(term) ||
      (c.crimes || []).join(" ").toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusStyle = {
    WANTED: { background: "rgba(220,38,38,.12)", color: "#f87171", border: "1px solid rgba(220,38,38,.2)" },
    ARRESTED: { background: "rgba(245,158,11,.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,.2)" },
    CONVICTED: { background: "rgba(34,197,94,.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,.2)" },
  };

  /* 🔹 Skeleton Component */
  const SkeletonCard = () => (
    <div className="d-flex gap-3 p-3 rounded-3 border mb-3 animate-pulse" style={{ background: "#0f172a", borderColor: "#1e293b" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#1e293b" }}></div>
      <div className="flex-grow-1">
        <div style={{ width: "120px", height: "14px", background: "#1e293b", borderRadius: "4px", marginBottom: "8px" }}></div>
        <div style={{ width: "200px", height: "10px", background: "#1e293b", borderRadius: "4px", marginBottom: "6px" }}></div>
        <div style={{ width: "160px", height: "10px", background: "#1e293b", borderRadius: "4px" }}></div>
      </div>
    </div>
  );

  const iconStyle = {
    color: "#38bdf8",
    filter: "drop-shadow(0 0 4px rgba(56,189,248,0.4))"
  };

  return (
    <div className="text-light mt-4 pt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>
        {`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          .search-input::placeholder {
            color: #ffffff !important;
            opacity: 0.6;
          }
          .crim-card { transition: all 0.2s ease; border: 1px solid #1e293b !important; }
          .crim-card:hover { transform: translateX(4px); border-color: #3b82f6 !important; background: #0f172a !important; }
          .crim-card.active { border-color: #3b82f6 !important; background: rgba(59,130,246,0.1) !important; }
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
          .details-panel::-webkit-scrollbar {
            display: none !important;
          }
          .details-panel {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}
      </style>

      {/* 🔹 HEADER BARS */}
      <div className="row g-2 mb-4 align-items-center">
        <div className="col">
          <div className="d-flex align-items-center gap-2 flex-grow-1 search-box">
            <Search size={14} style={iconStyle} />
            <input
              className="form-control bg-transparent border-0 p-0 text-light search-input"
              placeholder="Instant Search by name, crimes, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ color: "#ffffff", boxShadow: "none" }}
            />
          </div>
        </div>

        <div className="col-auto position-relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`btn filter-btn d-flex align-items-center justify-content-center gap-2 ${showStatusDropdown ? "active" : ""}`}
          >
            <Filter size={14} style={iconStyle} />
            {statusFilter === "ALL" ? "All Records" : statusFilter}
          </button>

          {showStatusDropdown && (
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
              {["ALL", "WANTED", "ARRESTED", "CONVICTED"].map((s) => (
                <div
                  key={s}
                  onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }}
                  className={`px-3 py-2 dropdown-filter-item ${statusFilter === s ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  {s === "ALL" ? "All Records" : s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-auto">
          <button
            className="btn px-4 fw-bold d-flex align-items-center justify-content-center"
            style={{
              height: "38px",
              borderRadius: "6px",
              fontSize: "14px",
              background: "#38bdf8",
              color: "#020617",
              border: "none",
              transition: "all 0.15s ease"
            }}
            onClick={() => setShowAdd(true)}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#22d3ee";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(56, 189, 248, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#38bdf8";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            + NEW RECORD
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* 🔹 LIST VIEW */}
        <div className="col-lg-8 no-print">
          <div className="mb-3 d-flex justify-content-end align-items-center">
            {isLoading && <span className="small text-info animate-pulse fw-bold">Syncing Records...</span>}
          </div>

          {isLoading && criminalList.length === 0 ? (
            Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <div style={{ paddingRight: "8px" }}>
              {filteredCriminals.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`d-flex gap-3 p-3 rounded-3 crim-card mb-2 position-relative ${selected?.id === c.id ? 'active' : ''}`}
                  style={{ background: "#0b1220", cursor: "pointer" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "#020617", border: "1px solid #1e293b", flexShrink: 0 }}>
                    {c.mugshot ? (
                      <img src={c.mugshot} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-secondary" style={{ fontSize: "20px" }}>👤</div>
                    )}
                  </div>

                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1 text-white fw-bold">{c.name}</h6>
                      <span className="small px-2 py-0.5 rounded-pill" style={statusStyle[c.status] || { background: "#1e293b", color: "#94a3b8", fontSize: "10px" }}>
                        {c.status}
                      </span>
                    </div>

                    <div className="small text-info fw-bold mb-1" style={{ fontSize: "10px" }}>
                      ALIAS: {c.alias?.length > 0 ? c.alias.join(", ") : "NONE"}
                    </div>

                    <p className="small text-secondary text-truncate mb-2" style={{ fontSize: "12px" }}>{c.physical || "No physical description provided."}</p>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-wrap gap-1">
                        {c.crimes?.slice(0, 3).map((crime) => (
                          <span key={crime} className="px-2 py-0.5 rounded" style={{ background: "rgba(56,189,248,0.08)", color: "#38bdf8", fontSize: "10px", fontWeight: "600" }}>
                            {crime}
                          </span>
                        ))}
                        {c.crimes?.length > 3 && <span className="text-secondary small">+{c.crimes.length - 3}</span>}
                      </div>
                      <div className="small text-secondary fw-bold" style={{ fontSize: "11px" }}>
                        {c.linkedCases?.length || 0} CASES • {c.arrests?.length || 0} ARRESTS
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 DETAIL VIEW */}
        <div className="col-lg-4">
          <div className="p-4 rounded-4 sticky-top shadow-lg d-flex flex-column details-panel" style={{ background: "#020617", border: "1px solid #1e293b", top: "85px", height: "calc(100vh - 200px)", overflowY: "auto" }}>
            {selected ? (
              <CriminalProfile criminal={{ ...selected, onUpdate: handleUpdateCriminal }} />
            ) : (
              <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: "90px", height: "90px", background: "rgba(59,130,246,0.03)", border: "1px dashed #1e293b" }}>
                  <Search size={36} className="text-secondary opacity-20" />
                </div>
                <h6 className="text-white fw-bold">Individual Record View</h6>
                <p className="text-secondary small px-4">Select a profile from the database to view full biometric data and criminal history summary.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <AddCriminalModal
          onClose={() => setShowAdd(false)}
          onAddCriminal={handleAddCriminal}
        />
      )}

    </div>
  );
};

export default CriminalRecords;
