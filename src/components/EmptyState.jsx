export default function EmptyState({ message = 'Sem dados para exibir.', compact = false }) {
  return <div className={`empty-state${compact ? ' empty-state--compact' : ''}`}>{message}</div>;
}
