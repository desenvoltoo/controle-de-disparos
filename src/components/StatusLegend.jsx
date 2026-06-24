import { STATUS_LABELS } from '../constants/labels.js';

export default function StatusLegend() {
  return (
    <section className="status-legend" aria-label="Legenda operacional de siglas">
      <strong>Legenda operacional</strong>
      <div>
        {Object.entries(STATUS_LABELS).map(([key, label]) => <span key={key}><b>{key}</b>: {label}</span>)}
      </div>
    </section>
  );
}
