import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FIRDetails from "../../components/FIRDetails";
import { FIR_API_URL } from "../../config";

const FirFullView = () => {

  const { firId } = useParams();
  const navigate = useNavigate();

  const [fir, setFir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);


  useEffect(() => {

    const fetchFir = async () => {
      try {
        const response = await fetch(
          `${FIR_API_URL}/${firId}`
        );

        if (!response.ok) {
          throw new Error("FIR not found");
        }

        const data = await response.json();
        setFir(data);

      } catch (error) {
        console.error("Failed to fetch FIR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (firId) {
      fetchFir();
    }

  }, [firId]);


  if (loading) {
    return <div style={{ color: "#fff" }}>Loading FIR details...</div>;
  }

  if (!fir) {
    return <div style={{ color: "red" }}>FIR not found</div>;
  }

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

      <FIRDetails fir={fir} />
    </div>
  );
};

export default FirFullView;

