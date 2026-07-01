import { useState, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { FIR_API_URL, AUTH_API_URL } from "../../config";

export default function CaseAssignment() {
  const { addNotification } = useNotifications();

  const [firs, setFirs] = useState([]);
  const [officers, setOfficers] = useState([]);

  useEffect(() => {

    const fetchFirs = async () => {
      try {

        const res1 = await fetch(`${FIR_API_URL}/status/REGISTERED`);
        const data1 = await res1.json();



        setFirs([...(data1 || [])]);

      } catch (err) {
        console.error("FIR fetch failed:", err);
      }
    };

    fetchFirs();

  }, []);

  useEffect(() => {

    const fetchOfficers = async () => {
      try {

        const res = await fetch(`${AUTH_API_URL}/role/OFFICER`);

        if (!res.ok) {
          console.error("Officer API not working");
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setOfficers(data);
        } else {
          setOfficers([]);
        }

      } catch (err) {
        console.error("Officer fetch failed:", err);
        setOfficers([]);
      }
    };

    fetchOfficers();

  }, []);
  const assignOfficer = async (firId, officerEmail) => {
    try {

      const res = await fetch(
        `${FIR_API_URL}/assign/${firId}?officerId=${officerEmail}`,
        { method: "PUT" }
      );

      if (!res.ok) return;

      const updatedFir = await res.json();

      const officerName = officers.find(o => o.id === officerEmail)?.fullName || officerEmail;
      addNotification({
        type: "case",
        title: "Case Assigned",
        message: `Case #${firId} assigned to Officer ${officerName} by SHO.`,
        route: "/admin/dashboard",
      });

      setFirs(prev =>
        prev.map(fir =>
          fir.id === firId ? updatedFir : fir
        )
      );

    } catch (err) {
      console.error("Assignment failed", err);
    }
  };

  return (
    <div style={{ color: "#e5e7eb" }}>

      <div
        style={{
          background:
            "linear-gradient(145deg,#0b1220,#020617)",
          border: "1px solid #1e293b",
          borderRadius: "18px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}
      >

        <div
          style={{
            padding: "18px 22px",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <h6 className="mb-0 fw-semibold text-light">
            Case Assignment
          </h6>
        </div>

        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>

            <thead>
              <tr style={{ color: "#93c5fd" }}>
                <th style={th}>FIR No</th>
                <th style={th}>Complainant</th>
                <th style={th}>Crime Type</th>
                <th style={th}>Assign Officer</th>
                <th style={th}>Status</th>
              </tr>
            </thead>

            <tbody>

              {firs.map((fir) => (

                <tr
                  key={fir.id}
                  style={rowStyle}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(56,189,248,0.06)")
                  }
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(2,6,23,0.4)")
                  }
                >

                  <td style={{ ...td, color: "#38bdf8" }}>
                    {fir.id}
                  </td>

                  <td style={td}>
                    {fir.fullName || "-"}
                  </td>

                  <td style={td}>
                    {fir.ipcSections?.length
                      ? fir.ipcSections.join(", ")
                      : "-"}
                  </td>

                  <td style={td}>
                    {(fir.status === "REGISTERED") ? (
                      <select
                        value={fir.assignedOfficerId || ""}
                        onChange={(e) =>
                          assignOfficer(
                            fir.id,
                            e.target.value
                          )
                        }
                        style={selectStyle}
                      >
                        <option value="" disabled>
                          Select Officer
                        </option>

                        {officers.length > 0 ? (
                          officers.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.fullName}
                            </option>

                          ))
                        ) : (
                          <option disabled>
                            No Officers Found
                          </option>
                        )}

                      </select>
                    ) : (
                      <span>
                        {fir.assignedOfficerId || "-"}
                      </span>
                    )}
                  </td>

                  <td style={td}>
                    <span style={{
                      padding: "5px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: "rgba(245,158,11,.15)",
                      color: "#fbbf24",
                      border: "1px solid rgba(245,158,11,.4)",
                    }}>
                      {fir.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

        <div style={{
          padding: "12px 22px",
          borderTop: "1px solid #1e293b",
        }}>
          <small className="text-secondary">
            Showing {firs.length} records
          </small>
        </div>

      </div>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "14px 18px",
  fontSize: "13px",
  fontWeight: 600,
  borderBottom: "1px solid #1e293b",
};

const td = {
  padding: "14px 18px",
  borderBottom: "1px solid #1e293b",
  color: "#e5e7eb",
};

const rowStyle = {
  background: "rgba(2,6,23,0.4)",
  transition: "0.2s",
};

const selectStyle = {
  width: "100%",
  background: "#020617",
  color: "#f8fafc",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  padding: "6px 10px",
};
