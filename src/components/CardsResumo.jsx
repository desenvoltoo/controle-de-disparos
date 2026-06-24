const numberFormatter = new Intl.NumberFormat('pt-BR');

function toNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value.replace('%', '').replace(',', '.')) || 0;
  return 0;
}

function getMetric(resumo, keys) {
  if (!Array.isArray(resumo)) return 0;

  const direct = resumo.find((item) => keys.some((key) => Object.prototype.hasOwnProperty.call(item, key)));
  if (direct) {
    const key = keys.find((candidate) => Object.prototype.hasOwnProperty.call(direct, candidate));
    return toNumber(direct[key]);
  }

  const byLabel = resumo.find((item) => {
    const label = String(item.indicador || item.nome || item.label || item.metrica || '').toLowerCase();
    return keys.some((key) => label.includes(key.toLowerCase()));
  });

  return toNumber(byLabel?.valor ?? byLabel?.total ?? 0);
}

function formatPercent(value) {
  const numericValue = toNumber(value);
  return `${numericValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;
}

export default function CardsResumo({ resumo }) {
  const totalDisparos = getMetric(resumo, ['totalDisparos', 'disparos', 'total de disparos']);
  const totalRetornos = getMetric(resumo, ['totalRetornos', 'retornos', 'total de retornos']);
  const totalMatriculas = getMetric(resumo, ['totalMatriculas', 'matriculas', 'matrículas', 'total de matrículas']);
  const taxaRetorno = getMetric(resumo, ['taxaRetornoGeral', 'taxa de retorno geral', 'taxaRetorno']);
  const taxaMatricula = getMetric(resumo, ['taxaMatricula', 'taxa de matrícula', 'taxaMatriculas']);

  const cards = [
    { label: 'Total de disparos', value: numberFormatter.format(totalDisparos), accent: 'blue' },
    { label: 'Total de retornos', value: numberFormatter.format(totalRetornos), accent: 'green' },
    { label: 'Total de matrículas', value: numberFormatter.format(totalMatriculas), accent: 'purple' },
    { label: 'Taxa de retorno geral', value: formatPercent(taxaRetorno), accent: 'orange' },
    { label: 'Taxa de matrícula', value: formatPercent(taxaMatricula), accent: 'pink' },
  ];

  return (
    <section className="summary-grid" aria-label="Resumo do dashboard">
      {cards.map((card) => (
        <article className={`summary-card summary-card--${card.accent}`} key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
