import EmptyState from './EmptyState.jsx';

export default function ChartCard({ title, subtitle, children, empty }) {
  return (
    <article className="panel chart-card">
      <div className="chart-card__header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="chart-wrapper">{empty ? <EmptyState message="Sem dados para exibir" /> : children}</div>
    </article>
  );
}
