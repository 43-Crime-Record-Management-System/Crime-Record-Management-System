import PersonnelPerformanceTable from "./PersonnelPerformanceTable";

const PersonnelOverview = () => {
    return (
        <div style={pageBackground}>
            <div style={pageContent}>
                <div style={panelCard}>
                    <h5 style={panelTitle}>Personnel Management & Performance</h5>
                    <PersonnelPerformanceTable />
                </div>
            </div>
        </div>
    );
};

export default PersonnelOverview;

const pageBackground = {
    minHeight: "100vh",
    background: "transparent",
};

const pageContent = {
    padding: "30px",
};

const panelCard = {
    background: "linear-gradient(145deg, #0b1220, #020617)",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 35px 80px rgba(0,0,0,0.85)",
};

const panelTitle = {
    color: "#e2e8f0",
    marginBottom: "18px",
    fontWeight: "600",
};
