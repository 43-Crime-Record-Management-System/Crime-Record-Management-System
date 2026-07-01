import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import FIRList from "./FIRList";
import FIRRegister from "./FIRRegister";

const FIRPortal = () => {
  const location = useLocation();
  const [mode, setMode] = useState("LIST"); 

  useEffect(() => {
    if (location.state?.openRegister === true) {
      setTimeout(() => setMode("REGISTER"), 0);
    }
  }, [location.state?.openRegister]);

  return (
    <div className="mt-4 pt-2">
      <div className="d-flex gap-3 mb-4">

        <button
          onClick={() => setMode("LIST")}
          className={`btn ${
            mode === "LIST"
              ? "btn-outline-info"
              : "btn-outline-secondary"
          }`}
          style={{ borderRadius: "10px" }}
        >
          All FIRs
        </button>

        <button
          onClick={() => setMode("REGISTER")}
          className={`btn ${
            mode === "REGISTER"
              ? "btn-outline-info"
              : "btn-outline-secondary"
          }`}
          style={{ borderRadius: "10px" }}
        >
          + Register New
        </button>

      </div>

      <div>
        {mode === "LIST" && <FIRList />}
        {mode === "REGISTER" && <FIRRegister />}
      </div>

    </div>
  );
};

export default FIRPortal;