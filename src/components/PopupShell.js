export default function PopupShell({ title, onClose, children }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="main popup-window" onClick={(e) => e.stopPropagation()}>
        <div className="popup-bar top">
          <h1 className="popup-title"><u>{title}</u></h1>
        </div>

        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        <div className="pop-content">
          {children}
        </div>
      </div>
    </div>
  );
}