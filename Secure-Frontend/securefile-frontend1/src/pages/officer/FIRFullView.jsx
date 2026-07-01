import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FIRDetails from "../../components/FIRDetails";
import { useNotifications } from "../../context/NotificationContext";
import { FIR_API_URL } from "../../config";

const OfficerFIRFullView = () => {
    const { firId } = useParams();
    const navigate = useNavigate();
    const { showAlert, showConfirm } = useNotifications();

    const [fir, setFir] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hover, setHover] = useState(false);

    const fetchFir = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${FIR_API_URL}/${firId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("FIR not found");
            const data = await res.json();

            // Ensure ID field is present for the component
            const formatted = {
                ...data,
                id: data.id || data._id || firId
            };

            setFir(formatted);
        } catch (err) {
            console.error("Error fetching FIR:", err);
            showAlert("Could not find the requested FIR or database connection failed.", "Error", "error");
            navigate("/dashboard/fir");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (firId) fetchFir();
    }, [firId]);

    const handleCloseCase = async (id) => {
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
                showAlert("Failed to close case.", "Error", "error");
                return;
            }

            showAlert("Case Closed Successfully ✅", "Success", "success");
            fetchFir();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-5 text-secondary">Loading official record...</div>;
    if (!fir) return null;

    return (
        <div className="py-2">
            <button
                onClick={() => navigate(-1)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="btn btn-link p-0 mb-4 d-flex align-items-center gap-2 text-decoration-none"
                style={{
                    color: hover ? "#7dd3fc" : "#38bdf8",
                    textDecoration: hover ? "underline" : "none",
                    fontWeight: "500",
                    fontSize: "14px",
                    border: "none",
                    background: "none",
                    transition: "all 0.2s ease"
                }}
            >
                ← Return to Portal
            </button>

            <FIRDetails
                fir={fir}
                onAction={fir.status === "ASSIGNED" || fir.status === "IN_PROGRESS" ? handleCloseCase : null}
                actionLabel="Close Investigation"
                actionColor="#22c55e"
            />
        </div>
    );
};

export default OfficerFIRFullView;
