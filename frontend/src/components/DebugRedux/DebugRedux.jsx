// src/components/DebugRedux/DebugRedux.jsx
import { useDispatch, useSelector } from "react-redux";
import { debugThunk } from "../../redux/operations/authOperations";

const DebugRedux = () => {
  const dispatch = useDispatch();
  const lastDebug = useSelector((state) => state.auth.lastDebug);

  return (
    <div style={{ padding: 12, fontSize: 14 }}>
      <button
        type="button"
        onClick={() => dispatch(debugThunk())}
        style={{
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Test Redux
      </button>
      <p>lastDebug: {String(lastDebug)}</p>
    </div>
  );
};

export default DebugRedux;
