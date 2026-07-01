import React from "react";
import {
    Clock,
    MapPin,
    User,
    Phone,
    Home,
    FileText,
    Shield,
    Calendar,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Briefcase
} from "lucide-react";

const FIRDetails = ({ fir, onAction, actionLabel, actionColor }) => {
    if (!fir) return null;

    const statusColors = {
        REGISTERED: { color: "#facc15", bg: "rgba(250, 204, 21, 0.1)", border: "rgba(250, 204, 21, 0.2)" },
        ASSIGNED: { color: "#38bdf8", bg: "rgba(56, 189, 248, 0.1)", border: "rgba(56, 189, 248, 0.2)" },
        IN_PROGRESS: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)" },
        CLOSED: { color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)" },
        REJECTED: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)" },
    };

    const currentStatus = statusColors[fir.status] || statusColors.REGISTERED;

    return (
        <div style={containerStyle}>
            {/* 🔹 Header Banner */}
            <div style={headerBanner(currentStatus.color)}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <div style={badge(currentStatus)}>
                            {fir.status}
                        </div>
                        <h2 className="mt-2 mb-1" style={{ fontWeight: 700, letterSpacing: "-0.5px" }}>
                            FIR #{fir.id}
                        </h2>
                        <div className="d-flex align-items-center gap-3 text-secondary small">
                            <span className="d-flex align-items-center gap-1">
                                <Calendar size={14} /> Registered: {fir.createdAt ? new Date(fir.createdAt).toLocaleDateString() : "N/A"}
                            </span>
                            <span className="d-flex align-items-center gap-1">
                                <Shield size={14} /> {fir.policeStation || "N/A"}
                            </span>
                        </div>
                    </div>
                    {onAction && (
                        <button
                            className="btn px-4 py-2 fw-bold"
                            style={actionBtn(actionColor || currentStatus.color)}
                            onClick={() => onAction(fir.id)}
                        >
                            {actionLabel || "Take Action"}
                        </button>
                    )}
                </div>
            </div>

            <div className="row g-4 mt-2">
                {/* 🔹 Left Column: Victim & Incident */}
                <div className="col-lg-8">
                    <div className="d-flex flex-column gap-4">

                        {/* Complainant Card */}
                        <div style={cardStyle}>
                            <SectionHeader icon={<User size={18} />} title="Complainant Information" />
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <DetailField label="Full Name" value={fir.fullName} />
                                </div>
                                <div className="col-md-6">
                                    <DetailField label="Contact Number" value={fir.phoneNumber || fir.contactNumber} icon={<Phone size={14} />} />
                                </div>
                                <div className="col-12">
                                    <DetailField label="Permanent Address" value={fir.address} icon={<Home size={14} />} />
                                </div>
                            </div>
                        </div>

                        {/* Incident Card */}
                        <div style={cardStyle}>
                            <SectionHeader icon={<AlertCircle size={18} />} title="Incident Details" />
                            <div className="mb-4">
                                <DetailField label="Crime Category" value={fir.crimeType} highlight />
                            </div>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <DetailField
                                        label="Incident Date"
                                        value={fir.incidentDate ? new Date(fir.incidentDate).toLocaleDateString() : "N/A"}
                                        icon={<Calendar size={14} />}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <DetailField label="Incident Location" value={fir.incidentLocation} icon={<MapPin size={14} />} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <small style={labelStyle}>Description of Event</small>
                                <p style={descriptionStyle}>{fir.description}</p>
                            </div>
                        </div>

                        {/* Witnesses Section */}
                        <div style={cardStyle}>
                            <SectionHeader icon={<UsersIcon size={18} />} title="Witnesses & Evidence" />
                            {fir.witnesses?.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {fir.witnesses.map((w, i) => (
                                        <div key={i} style={witnessItemStyle}>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="fw-bold text-white">{w.witnessName}</span>
                                                <span className="small text-secondary">{w.witnessContactNumber}</span>
                                            </div>
                                            <p className="small mb-0 text-secondary" style={{ fontStyle: "italic" }}>
                                                "{w.witnessStatement}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-secondary small py-3 text-center border rounded" style={{ borderStyle: "dashed !important", borderColor: "rgba(255,255,255,0.1) !important" }}>
                                    No witnesses recorded for this FIR
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔹 Right Column: Legal & Officer */}
                <div className="col-lg-4">
                    <div className="d-flex flex-column gap-4">

                        {/* Legal Sections */}
                        <div style={cardStyle}>
                            <SectionHeader icon={<FileText size={18} />} title="Legal Classification" />
                            <div className="d-flex flex-wrap gap-2">
                                {fir.ipcSections?.map((section, idx) => (
                                    <span key={idx} style={sectionBadgeStyle}>
                                        IPC {section}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Assigned Officer */}
                        <div style={cardStyle}>
                            <SectionHeader icon={<Briefcase size={18} />} title="Investigation Team" />
                            <div className="d-flex align-items-center gap-3">
                                <div style={officerAvatarStyle}>
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <div className="text-white fw-bold">{fir.assignedOfficerId || "Pending Assignment"}</div>
                                    <div className="small text-secondary">
                                        {fir.assignedOfficerId ? "Primary Investigating Officer" : "Waiting for SHO Approval"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Metadata */}
                        <div style={cardStyle}>
                            <SectionHeader icon={<InfoIcon size={18} />} title="System Activity" />
                            <div className="d-flex flex-column gap-3 small">
                                <div className="d-flex justify-content-between">
                                    <span style={labelStyle}>Created</span>
                                    <span className="text-white">{fir.createdAt ? new Date(fir.createdAt).toLocaleDateString() : "N/A"}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span style={labelStyle}>Last Modified</span>
                                    <span className="text-white">{fir.updatedAt || fir.lastUpdated ? new Date(fir.updatedAt || fir.lastUpdated).toLocaleDateString() : "Syncing Records..."}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span style={labelStyle}>Station ID</span>
                                    <span className="text-white">{fir.id?.substring(0, 4).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* 🔹 Support Components */

const SectionHeader = ({ icon, title }) => (
    <div className="d-flex align-items-center gap-2 mb-4">
        <div style={iconContainerStyle}>{icon}</div>
        <h6 className="mb-0 text-white fw-bold text-uppercase" style={{ letterSpacing: "1px", fontSize: "13px" }}>{title}</h6>
    </div>
);

const DetailField = ({ label, value, icon, highlight }) => (
    <div className="d-flex flex-column">
        <small style={labelStyle}>{label}</small>
        <div className="d-flex align-items-center gap-2">
            {icon && <span style={{ color: "rgba(56, 189, 248, 0.6)" }}>{icon}</span>}
            <span className={highlight ? "fw-bold text-info" : "text-white"}>
                {value || "Not specified"}
            </span>
        </div>
    </div>
);

const UsersIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const InfoIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
);

/* 🔹 Styles */

const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    color: "#e2e8f0"
};

const headerBanner = (color) => ({
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderLeft: `4px solid ${color}`,
    padding: "24px 30px",
    borderRadius: "16px",
    marginBottom: "30px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
});

const badge = (status) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: status.color,
    background: status.bg,
    border: `1px solid ${status.border}`
});

const cardStyle = {
    background: "rgba(15, 23, 42, 0.3)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "24px",
    borderRadius: "20px",
    height: "100%"
};

const iconContainerStyle = {
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.1)",
    padding: "8px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const labelStyle = {
    color: "#64748b",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
    fontWeight: 600
};

const descriptionStyle = {
    lineHeight: "1.6",
    color: "#cbd5e1",
    fontSize: "14px",
    background: "rgba(0,0,0,0.1)",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.02)"
};

const witnessItemStyle = {
    padding: "12px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.05)"
};

const sectionBadgeStyle = {
    background: "rgba(255,255,255,0.05)",
    color: "#94a3b8",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.08)"
};

const officerAvatarStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(59, 130, 246, 0.2))",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(56, 189, 248, 0.3)"
};

const actionBtn = (color) => ({
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    boxShadow: `0 0 15px ${color}44`,
    transition: "0.2s"
});

export default FIRDetails;
