import { formatNumber, formatPercent, getFirstValue, toNumber } from '../utils/formatters.js';

function getMetric(resumo, keys) {
  if (Array.isArray(resumo)) {
    const direct = resumo.find((item) => keys.some((key) => Object.prototype.hasOwnProperty.call(item || {}, key)));
    if (direct) return getFirstValue(direct, keys);
    const byLabel = resumo.find((item) => keys.some((key) => String(item?.indicador || item?.nome || item?.label || item?.metrica || '').toLowerCase().includes(key.toLowerCase())));
    return byLabel?.valor ?? byLabel?.total ?? 0;
  }
  return getFirstValue(resumo || {}, keys);
}

export default function CardsResumo({ resumo }) {
  const totalDisparos = getMetric(resumo, ['total_disparos', 'totalDisparos', 'disparos', 'total_leads', 'total de disparos']);
  const totalRetornos = getMetric(resumo, ['total_retornos', 'totalRetornos', 'retornos', 'retorno', 'total de retornos']);
  const totalMatriculas = getMetric(resumo, ['total_matriculas', 'totalMatriculas', 'matriculas', 'matrículas', 'MAT', 'total de matrículas']);
  const taxaRetorno = getMetric(resumo, ['taxa_retorno', 'taxaRetornoGeral', 'taxa de retorno geral', 'taxaRetorno']) || (toNumber(totalDisparos) ? (toNumber(totalRetornos) / toNumber(totalDisparos)) : 0);
  const taxaMatricula = getMetric(resumo, ['taxa_matricula', 'taxaMatricula', 'taxa de matrícula']) || (toNumber(totalDisparos) ? (toNumber(totalMatriculas) / toNumber(totalDisparos)) : 0);

  const cards = [
    { label: 'Total de disparos', desc: 'Leads enviados no período', value: formatNumber(totalDisparos), accent: 'blue' },
    { label: 'Total de retornos', desc: 'Contatos que retornaram', value: formatNumber(totalRetornos), accent: 'green' },
    { label: 'Total de matrículas', desc: 'Matrículas registradas', value: formatNumber(totalMatriculas), accent: 'purple' },
    { label: 'Taxa de retorno', desc: 'Retornos sobre disparos', value: formatPercent(taxaRetorno), accent: 'orange' },
    { label: 'Taxa de matrícula', desc: 'Matrículas sobre disparos', value: formatPercent(taxaMatricula), accent: 'pink' },
  ];

  return <section className="summary-grid" aria-label="Resumo do dashboard">{cards.map((card) => <article className={`summary-card summary-card--${card.accent}`} key={card.label}><span>{card.label}</span><small>{card.desc}</small><strong>{card.value}</strong></article>)}</section>;
}
