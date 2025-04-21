import { useDebug } from "./DebugProvider";

const DebugPanel = () => {
  const { messages, clearMessages } = useDebug();

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        whiteSpace: "pre-wrap",
        zIndex: 1000,
      }}
    >
      <button
        onClick={clearMessages}
        style={{
          marginBottom: 5,
          padding: "5px 10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Очистить
      </button>
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  );
};

export default DebugPanel;