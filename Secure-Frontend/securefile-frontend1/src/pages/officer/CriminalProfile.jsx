import { useState, useEffect } from "react";
import { CRIMINAL_API_URL } from "../../config";

const CriminalProfile = ({ criminal }) => {

  const [mugshot, setMugshot] = useState(criminal?.mugshot || "");
  const [fingerprint, setFingerprint] = useState(criminal?.fingerprint || "");

  // Sync local state when the selected criminal changes
  useEffect(() => {
    setMugshot(criminal?.mugshot || "");
    setFingerprint(criminal?.fingerprint || "");
  }, [criminal?.id, criminal?.mugshot, criminal?.fingerprint]);


  /* ================= STYLES ================= */

  const statusColors = {
    WANTED: { bg: "rgba(239, 68, 68, 0.12)", text: "#f87171", border: "rgba(239, 68, 68, 0.25)" },
    ARRESTED: { bg: "rgba(245, 158, 11, 0.12)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.25)" },
    CONVICTED: { bg: "rgba(34, 197, 94, 0.12)", text: "#4ade80", border: "rgba(34, 197, 94, 0.25)" },
    default: { bg: "rgba(148, 163, 184, 0.12)", text: "#94a3b8", border: "rgba(148, 163, 184, 0.25)" }
  };

  const status = statusColors[criminal.status?.toUpperCase()] || statusColors.default;

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      if (type === "mugshot") setMugshot(base64);
      else setFingerprint(base64);

      try {
        const response = await fetch(`${CRIMINAL_API_URL}/update/${criminal.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [type]: base64 }),
        });

        if (response.ok) {
          const updated = await response.json();
          if (criminal.onUpdate) criminal.onUpdate(updated);
        }
      } catch (err) {
        console.error("Failed to persist image update:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <style>
        {`
/* 🔹 SCREEN UI (PREMIUM DASHBOARD) */
.profile-view {
  font-family: 'Inter', -apple-system, sans-serif;
  color: #e2e8f0;
}

.data-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
  margin-bottom: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.data-field-label {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.data-field-value {
  font-size: 13px;
  font-weight: 500;
  color: #f1f5f9;
}

.crime-pill {
  background: rgba(56, 189, 248, 0.08);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.stats-card-premium {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.image-frame {
  position: relative;
  background: #020617;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 25px -10px rgba(0,0,0,1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-frame:hover {
  border-color: rgba(56, 189, 248, 0.3);
  transform: translateY(-2px);
}

.image-tag-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 800;
  color: #38bdf8;
  border: 1px solid rgba(56,189,248,0.3);
  letter-spacing: 0.5px;
  z-index: 10;
}

.biometric-btn-glass {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  background: linear-gradient(to top, rgba(2, 6, 23, 0.9), transparent);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(2px);
}

.biometric-btn-glass:hover {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
}

  /* 🔹 PREMIUM DOSSIER PRINT LAYOUT 🔹 */
  @media print {
    @page { margin: 8mm; size: A4; }
    
    body * { visibility: hidden !important; }
    #print-profile, #print-profile * { visibility: visible !important; }
    
    #print-profile {
      position: absolute !important;
      left: 0 !important; top: 0 !important;
      width: 100% !important;
      display: block !important;
      background: #fff !important;
      color: #000 !important;
      z-index: 9999 !important;
      font-family: 'Inter', 'Segoe UI', serif !important;
    }

    body, #root, #root > div, .d-flex, .flex-grow-1, .sticky-top, .row, .col-lg-5, .col-lg-7 {
      background: #fff !important;
      visibility: visible !important;
      display: block !important;
      position: static !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
      width: 100% !important;
    }

    button, .no-print, .btn-action, label, input, aside, nav, header { display: none !important; }

    /* Layout Components */
    .dossier-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
    .dossier-section { border-top: 1.5pt solid #000; margin-top: 10pt; padding-top: 5pt; }
    .dossier-header { font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3pt; font-size: 10pt; background: #eee; padding: 2pt 6pt; }
    
    .data-row { display: flex; border-bottom: 0.5pt solid #ddd; padding: 3pt 0; }
    .data-label { font-weight: 800; font-size: 7.5pt; width: 90pt; text-transform: uppercase; color: #444; }
    .data-value { font-weight: 500; font-size: 9pt; flex: 1; color: #000; }

    .image-box { border: 2pt solid #000; height: 110pt; position: relative; background: #f9f9f9; }
    .image-box-label { position: absolute; bottom: 0; width: 100%; background: #000; color: #fff; text-align: center; font-size: 7pt; font-weight: 900; padding: 2pt 0; }
    
    .seal-container { position: absolute; top: 60pt; right: 20pt; width: 80pt; height: 80pt; border: 2pt double #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg); opacity: 0.6; }
    .seal-text { font-size: 6pt; font-weight: 900; text-align: center; line-height: 1.1; color: #333; text-transform: uppercase; }

    .signature-area { margin-top: 30pt; display: flex; justify-content: space-between; align-items: flex-end; }
    .sig-line { border-top: 1pt solid #000; width: 160pt; text-align: center; font-size: 8pt; padding-top: 3pt; font-weight: bold; }
  }

.print-banner-official, .print-section-header { display: none; }
`}
      </style>

      <div id="print-profile" className="profile-view">

        {/* 🏢 PREMIUM PRINT HEADER (ONLY FOR PRINT) */}
        <div className="d-print-flex d-none justify-content-between align-items-center pb-2 border-bottom border-dark border-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '40pt', height: '40pt', border: '2pt solid #000', borderRadius: '4pt', fontWeight: '900', fontSize: '20pt', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SF</div>
            <div>
              <h3 className="m-0 fw-black" style={{ letterSpacing: '-0.5pt', fontSize: '16pt' }}>SECUREFILE CENTRAL RECORDS</h3>
              <div className="fw-bold" style={{ fontSize: '8pt' }}>FEDERAL CRIMINAL IDENTIFICATION & BIOMETRIC SERVICES</div>
            </div>
          </div>
          <div className="text-end">
            <div className="fw-bold" style={{ fontSize: '9pt' }}>FILE INDEX: {criminal.id.substring(0, 12).toUpperCase()}</div>
            <div className="small fw-medium" style={{ fontSize: '8pt' }}>ISSUE DATE: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* 👤 SCREEN HEADER SECTION (ONLY VISIBLE ON SCREEN) */}
        <div className="d-flex justify-content-between align-items-center mb-4 no-print">
          <div>
            <h2 className="mb-0 fw-bold text-white mb-1" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>{criminal.name}</h2>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-1">
                <span className="text-secondary opacity-50 small fw-bold">ALIAS:</span>
                <span className="text-info small fw-bold">{criminal.alias?.length > 0 ? criminal.alias.join(", ") : "NONE"}</span>
              </div>
              <div className="vr opacity-25" style={{ height: '12px' }}></div>
              <div className="d-flex align-items-center gap-1">
                <span className="text-secondary opacity-50 small fw-bold">ID:</span>
                <span className="text-secondary small font-monospace">{criminal.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>
          <div
            className="px-3 py-2 rounded-3 border fw-bold text-uppercase"
            style={{
              background: status.bg,
              color: status.text,
              borderColor: status.border,
              fontSize: '11px',
              letterSpacing: '1px'
            }}
          >
            {criminal.status}
          </div>
        </div>

        {/* 📄 MAIN DOSSIER BODY (ONLY FOR PRINT) */}
        <div className="d-print-block d-none">
          <div className="dossier-grid" style={{ gridTemplateColumns: '120pt 1fr 120pt' }}>
            <div className="image-box">
              {mugshot ? (
                <img src={mugshot} alt="Mugshot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted small">NO PHOTO</div>
              )}
              <div className="image-box-label">FACIAL SCAN (PRIMARY)</div>
            </div>

            <div className="px-3 d-flex flex-column">
              <div className="mb-2">
                <span style={{ fontSize: '8pt', fontWeight: '900', color: '#666' }}>SUBJECT FULL NAME:</span>
                <h2 className="m-0 fw-black p-0 border-bottom border-dark border-2 mb-1" style={{ fontSize: '22pt' }}>{criminal.name}</h2>
              </div>
              <div className="data-row">
                <div className="data-label">Identity Alias</div>
                <div className="data-value fw-bold text-uppercase">{criminal.alias?.length > 0 ? criminal.alias.join(", ") : "NO OFFICIAL ALIAS"}</div>
              </div>
              <div className="data-row">
                <div className="data-label">Date of Birth</div>
                <div className="data-value">{criminal.dob || "NOT RECORDED"}</div>
              </div>
              <div className="data-row">
                <div className="data-label">Subject Gender</div>
                <div className="data-value">{criminal.gender || "UNKNOWN"}</div>
              </div>
              <div className="data-row">
                <div className="data-label">Current Status</div>
                <div className="data-value fw-black text-danger">{criminal.status.toUpperCase()}</div>
              </div>
            </div>

            <div className="image-box">
              {fingerprint ? (
                <img src={fingerprint} alt="Fingerprint" style={{ width: "100%", height: "100%", objectFit: "contain", filter: 'contrast(1.5) grayscale(1)' }} />
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted small">NO SCAN</div>
              )}
              <div className="image-box-label">BIOMETRIC PRINT ID</div>
            </div>
          </div>

          <div className="seal-container">
            <div className="seal-text">
              CERTIFIED RECORD<br />SECUREFILE SYSTEM<br />★ ★ ★<br />DEPT. OF JUSTICE
            </div>
          </div>
        </div>

        {/* 📸 VISUAL DATA SECTION (ONLY VISIBLE ON SCREEN) */}
        <div className="row g-3 mb-4 no-print">
          <div className="col-auto">
            <div className="image-frame" style={{ width: 140, height: 180 }}>
              <div className="image-tag-overlay">MUGSHOT</div>
              {mugshot ? (
                <img src={mugshot} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-secondary bg-dark opacity-50">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <span className="mt-2" style={{ fontSize: '9px' }}>NO PHOTO</span>
                </div>
              )}
              <label className="biometric-btn-glass">
                UPDATE PHOTO
                <input type="file" accept="image/*" hidden onChange={(e) => handleImageChange(e, "mugshot")} />
              </label>
            </div>
          </div>

          <div className="col-auto">
            <div className="image-frame" style={{ width: 140, height: 180 }}>
              <div className="image-tag-overlay">BIOMETRIC</div>
              {fingerprint ? (
                <img src={fingerprint} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: 'brightness(1.2) contrast(1.1)' }} />
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center bg-dark" style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                    <path d="M2 12c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                    <path d="M5 12c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                    <path d="M8 12c0-1.1.9-2 2-2s2 .9 2 2" />
                    <path d="M10 20v-4" />
                    <path d="M14 20v-7" />
                    <path d="M18 20v-9" />
                  </svg>
                  <span className="mt-2 text-info opacity-50" style={{ fontSize: '9px', fontWeight: '800' }}>SCAN READY</span>
                </div>
              )}
              <label className="biometric-btn-glass">
                SCAN BIOMETRIC
                <input type="file" accept="image/*" hidden onChange={(e) => handleImageChange(e, "fingerprint")} />
              </label>
            </div>
          </div>

          <div className="col no-print">
            <div className="d-flex flex-column h-100 gap-2">
              <div className="stats-card-premium flex-grow-1 d-flex flex-column justify-content-center">
                <div className="data-field-label">Linked Cases</div>
                <div className="h2 mb-0 text-white fw-bold">{criminal.linkedCases?.length || 0}</div>
              </div>
              <div className="stats-card-premium flex-grow-1 d-flex flex-column justify-content-center">
                <div className="data-field-label">Total Arrests</div>
                <div className="h2 mb-0 text-white fw-bold">{criminal.arrests?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-print-block d-none">
          <div className="dossier-section">
            <div className="dossier-header">Criminal Metrics & Case History</div>
            <div className="d-flex gap-4 px-2">
              <div className="text-center border border-2 border-dark p-2" style={{ width: '80pt' }}>
                <div style={{ fontSize: '18pt', fontWeight: '900' }}>{criminal.linkedCases?.length || 0}</div>
                <div style={{ fontSize: '7pt', fontWeight: '900' }}>Linked Cases</div>
              </div>
              <div className="text-center border border-2 border-dark p-2" style={{ width: '80pt' }}>
                <div style={{ fontSize: '18pt', fontWeight: '900' }}>{criminal.arrests?.length || 0}</div>
                <div style={{ fontSize: '7pt', fontWeight: '900' }}>Arrest Records</div>
              </div>
              <div className="flex-grow-1 border border-dark p-2">
                <div className="data-label" style={{ width: '100%', marginBottom: '2pt' }}>Primary Classifications</div>
                <div className="d-flex flex-wrap gap-1">
                  {criminal.crimes?.slice(0, 8).map(c => <span key={c} className="crime-pill text-uppercase border-dark" style={{ border: '0.5pt solid black', padding: '1pt 4pt', fontSize: '8pt', color: 'black' }}>{c}</span>)}
                </div>
              </div>
            </div>
          </div>

          <div className="dossier-section">
            <div className="dossier-header">Physical Description & Distinctive Markers</div>
            <div style={{ fontSize: '9pt', lineHeight: '1.4', padding: '5pt 10pt', background: '#f5f5f5', border: '0.5pt solid #ccc' }}>
              {criminal.physical || "Subject has no distinctive physical markers or identifiers recorded in the system. Routine identification procedures apply."}
            </div>
          </div>

          <div className="dossier-section">
            <div className="dossier-header">Full System Audit Track</div>
            <div className="data-row">
              <div className="data-label">Permanent Record ID</div>
              <div className="data-value font-monospace" style={{ fontSize: '8pt' }}>{criminal.id}</div>
            </div>
            <div className="data-row">
              <div className="data-label">Last Sync</div>
              <div className="data-value">{criminal.lastUpdated || "SYSTEM DEFAULT TIME"}</div>
            </div>
          </div>

          <div className="signature-area">
            <div>
              <p style={{ fontSize: '7pt', color: '#666', maxWidth: '280pt', margin: 0 }}>This dossier is a confidential legal document. Unauthorized dissemination is subject to federal prosecution under the Crime Records Protection Act. End of official record.</p>
            </div>
            <div className="sig-line">
              Authorizing Officer Signature
            </div>
          </div>
        </div>

        {/* 📄 CORE INFORMATION SECTION (ONLY VISIBLE ON SCREEN) */}
        <div className="no-print">
          <div className="data-section-title">Biographical Profile</div>
          <div className="row g-4 mb-4">
            <div className="col-6">
              <div className="data-field-label">Date of Birth</div>
              <div className="data-field-value">{criminal.dob || "Unknown"}</div>
            </div>
            <div className="col-6">
              <div className="data-field-label">Gender</div>
              <div className="data-field-value">{criminal.gender || "Not Specified"}</div>
            </div>
            <div className="col-6">
              <div className="data-field-label">Full Record ID</div>
              <div className="data-field-value text-info font-monospace" style={{ fontSize: '11px' }}>{criminal.id}</div>
            </div>
            <div className="col-6">
              <div className="data-field-label">Last Sync</div>
              <div className="data-field-value">{criminal.lastUpdated || "System Default"}</div>
            </div>
          </div>

          <div className="data-field-label mb-2">Physical Description</div>
          <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
            {criminal.physical || "No specialized physical markers recorded."}
          </div>

          <div className="data-field-label mb-2">Classification Tags</div>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {criminal.crimes?.length > 0 ? (
              criminal.crimes.map(c => <span key={c} className="crime-pill text-uppercase">{c}</span>)
            ) : (
              <span className="text-secondary small fst-italic">No criminal history tags.</span>
            )}
          </div>
        </div>
      </div>

      {/* 🧾 BUTTONS */}
      <div className="mt-3 no-print">
        <button
          className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg"
          onClick={() => window.print()}
          style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', border: 'none', letterSpacing: '1px' }}
        >
          GENERATE OFFICIAL DOSSIER
        </button>
      </div>
    </>
  );
};

export default CriminalProfile;