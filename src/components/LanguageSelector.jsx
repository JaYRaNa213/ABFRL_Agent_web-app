export default function LanguageSelector({ language, setLanguage }) {
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid var(--border-glass)",
        background: "rgba(0,0,0,0.5)",
        color: "white",
        cursor: "pointer",
        outline: "none"
      }}
    >
      <option value="en-IN">English</option>
      <option value="hi-IN">हिंदी</option>
    </select>
  );
}
