import { useEffect, useState } from "react";
import { User, Shield, Briefcase, CheckCircle } from "lucide-react";
import { USER_API_URL, FIR_API_URL } from "../../config";

const PersonnelPerformanceTable = () => {
    const [personnel, setPersonnel] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await fetch(`${USER_API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const users = await usersRes.json();

                const firsRes = await fetch(`${FIR_API_URL}/all`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const firs = await firsRes.json();

                if (Array.isArray(users) && Array.isArray(firs)) {
                    const perfData = users
                        .filter((u) => u.role !== "ADMIN")
                        .map((u) => {
                            // Robust matching for email or numeric ID
                            const userFirs = firs.filter((f) => {
                                const assigned = String(f.assignedOfficerId || "").toLowerCase().trim();
                                const uEmail = String(u.email || "").toLowerCase().trim();
                                const uId = String(u.id || "");
                                return assigned === uEmail || assigned === uId;
                            });

                            const active = userFirs.filter(
                                (f) => f.status === "ASSIGNED" || f.status === "IN_PROGRESS"
                            ).length;
                            const closed = userFirs.filter((f) => f.status === "CLOSED").length;
                            const total = userFirs.length;
                            const rate = total > 0 ? Math.round((closed / total) * 100) : 0;

                            return {
                                ...u,
                                activeCases: active,
                                closedCases: closed,
                                totalCases: total,
                                successRate: rate,
                            };
                        });

                    setPersonnel(perfData);
                }
            } catch (err) {
                console.error("Error fetching personnel performance:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [token]);

    const filteredPersonnel = personnel.filter(p =>
        p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.station?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-secondary p-3">Loading personnel data...</div>;

    return (
        <div style={{ width: "100%" }}>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <input
                    type="text"
                    placeholder="Search personnel by name, role or station..."
                    className="form-control"
                    style={searchInputStyle}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="text-secondary small">
                    Showing {filteredPersonnel.length} personnel
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>Personnel</th>
                            <th style={thStyle}>Role</th>
                            <th style={thStyle}>Station</th>
                            <th style={thStyle}>Active</th>
                            <th style={thStyle}>Closed</th>
                            <th style={thStyle}>Success Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPersonnel.length > 0 ? (
                            filteredPersonnel.map((p, i) => (
                                <tr key={i} style={rowStyle}>
                                    <td style={tdStyle}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={avatarStyle}>
                                                {p.role === "SHO" ? <Shield size={16} /> : <User size={16} />}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-white">{p.fullName}</div>
                                                <div style={{ fontSize: "11px", color: "#64748b" }}>{p.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={badgeStyle(p.role)}>{p.role}</span>
                                    </td>
                                    <td style={tdStyle}>{p.station || "Global"}</td>
                                    <td style={tdStyle}>
                                        <div className="d-flex align-items-center gap-2">
                                            <Briefcase size={14} className="text-primary" style={{ opacity: 0.7 }} />
                                            <span className="fw-bold">{p.activeCases}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div className="d-flex align-items-center gap-2">
                                            <CheckCircle size={14} className="text-success" style={{ opacity: 0.7 }} />
                                            <span className="fw-bold">{p.closedCases}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <div className="d-flex flex-column gap-2" style={{ width: "120px" }}>
                                            <div className="d-flex justify-content-between align-items-end" style={{ fontSize: "11px" }}>
                                                <span className="text-white fw-bold">{p.successRate}%</span>
                                                <span style={{ color: "#64748b" }}>{p.closedCases}/{p.totalCases}</span>
                                            </div>
                                            <div className="progress" style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${p.successRate}%`,
                                                        background: p.successRate > 75 ? "#22c55e" : p.successRate > 45 ? "#facc15" : "#ef4444",
                                                        boxShadow: `0 0 10px ${p.successRate > 75 ? "rgba(34,197,94,0.3)" : p.successRate > 45 ? "rgba(250,204,21,0.3)" : "rgba(239,68,68,0.3)"}`,
                                                        borderRadius: "10px"
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-secondary">
                                    No personnel found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PersonnelPerformanceTable;

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    color: "#e2e8f0",
};

const headerRowStyle = {
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#94a3b8",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
};

const thStyle = {
    padding: "16px 12px",
    textAlign: "left",
    fontWeight: "600",
};

const rowStyle = {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    transition: "0.2s",
};

const tdStyle = {
    padding: "16px 12px",
    fontSize: "14px",
};

const avatarStyle = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const badgeStyle = (role) => ({
    fontSize: "10px",
    padding: "3px 8px",
    borderRadius: "6px",
    fontWeight: "600",
    background: role === "SHO" ? "rgba(167, 139, 250, 0.1)" : "rgba(56, 189, 248, 0.1)",
    color: role === "SHO" ? "#a78bfa" : "#38bdf8",
    border: role === "SHO" ? "1px solid rgba(167, 139, 250, 0.2)" : "1px solid rgba(56, 189, 248, 0.2)",
});

const searchInputStyle = {
    background: "rgba(15, 23, 42, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#f8fafc",
    borderRadius: "10px",
    padding: "10px 16px",
    maxWidth: "400px",
    fontSize: "14px"
};
