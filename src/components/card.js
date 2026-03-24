export default function Card({ title, description, color }) {
  const hasDescription = description && description.trim() !== '';

  return (
    <div
      className={`task-card ${!hasDescription ? 'no-description' : ''}`}
      style={{ outline: `2px solid var(--${color})` }}
    >
      <h1 className={`block-heading card-heading ${!hasDescription ? 'large-title' : ''}`}>
        {title.toUpperCase()}
      </h1>

      {hasDescription && (
        <p className="body-text">{description}</p>
      )}
    </div>
  );
}