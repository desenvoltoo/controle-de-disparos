import { Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard.jsx';
import { formatMonthLabel, formatNumber, getFirstValue, toNumber } from '../utils/formatters.js';

function aggregate(data, nameKeys, valueKeys, extraKeys = []) {
  const map = new Map();
  data.forEach((item) => {
    const name = String(getFirstValue(item, nameKeys) || 'Sem identificação');
    const current = map.get(name) || { name, value: 0 };
    current.value += toNumber(getFirstValue(item, valueKeys));
    extraKeys.forEach((key) => { current[key] = (current[key] || 0) + toNumber(item?.[key]); });
    map.set(name, current);
  });
  return Array.from(map.values()).filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
}

function CustomTooltip({ active, payload, label, description }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};
  return <div className="chart-tooltip"><strong>{label || row.name}</strong>{payload.map((entry) => <span key={entry.dataKey}>{entry.name}: {formatNumber(entry.value)}</span>)}{row.positivo !== undefined && <span>Positivos: {formatNumber(row.positivo)}</span>}{row.negativo !== undefined && <span>Negativos: {formatNumber(row.negativo)}</span>}{row.matriculas !== undefined && <span>Matrículas: {formatNumber(row.matriculas)}</span>}<small>{description}</small></div>;
}

export default function GraficosDashboard({ arquivos = [], consultores = [], ranking = [], matriculasPorMes = [], matriculasOrigem = [] }) {
  const baseDisparos = arquivos.length ? arquivos : ranking;
  const leadsPorTipo = aggregate(baseDisparos, ['tipo_disparo', 'tipoDisparo', 'tipo', 'canal'], ['total_leads', 'totalLeads', 'leads', 'disparos', 'total']);
  const origem = aggregate(matriculasOrigem, ['tipo_disparo', 'origem', 'tipo', 'canal'], ['matriculas', 'matrículas', 'MAT', 'total']);
  const retornosConsultor = aggregate(consultores.length ? consultores : ranking, ['consultor_disparo', 'consultor', 'nome', 'nomeConsultor'], ['retorno', 'retornos', 'totalRetornos', 'total'], ['positivo', 'negativo', 'matriculas']).slice(0, 10);
  const matriculasMes = matriculasPorMes.map((item) => ({ ...item, name: formatMonthLabel(getFirstValue(item, ['mes', 'mês', 'ym', 'periodo', 'data'])), total: toNumber(getFirstValue(item, ['matriculas', 'matrículas', 'total', 'MAT'])), graduacao: toNumber(getFirstValue(item, ['graduacao', 'Graduação'])), pos_graduacao: toNumber(getFirstValue(item, ['pos_graduacao', 'posGraduacao', 'Pós-graduação'])), tecnico: toNumber(getFirstValue(item, ['tecnico', 'Técnico'])) })).filter((item) => item.total || item.graduacao || item.pos_graduacao || item.tecnico);
  const hasSeries = matriculasMes.some((item) => item.graduacao || item.pos_graduacao || item.tecnico);

  return (
    <section className="charts-grid" aria-label="Gráficos do dashboard">
      <ChartCard title="Leads por tipo de disparo" subtitle="Compara o volume total de leads enviados em cada tipo de disparo." empty={!leadsPorTipo.length}><ResponsiveContainer width="100%" height="100%"><BarChart data={leadsPorTipo} margin={{ top: 18, right: 10, left: 0, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} /><Tooltip content={<CustomTooltip description="Volume total de leads neste tipo de disparo" />} /><Bar name="Total de leads" dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb"><LabelList dataKey="value" position="top" formatter={formatNumber} fontSize={11} /></Bar></BarChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Matrículas por mês" subtitle="Mostra a evolução das matrículas registradas ao longo dos meses." empty={!matriculasMes.length}><ResponsiveContainer width="100%" height="100%"><LineChart data={matriculasMes} margin={{ top: 18, right: 16, left: 0, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} /><Tooltip content={<CustomTooltip description="Matrículas registradas no mês selecionado" />} />{hasSeries && <Legend />}{hasSeries ? <><Line name="Graduação" type="monotone" dataKey="graduacao" stroke="#2563eb" strokeWidth={2} dot /><Line name="Pós-graduação" type="monotone" dataKey="pos_graduacao" stroke="#9333ea" strokeWidth={2} dot /><Line name="Técnico" type="monotone" dataKey="tecnico" stroke="#f97316" strokeWidth={2} dot /></> : <Line name="Matrículas" type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }}><LabelList dataKey="total" position="top" formatter={formatNumber} fontSize={11} /></Line>}</LineChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Matrículas por origem" subtitle="Mostra a quantidade de matrículas atribuídas a cada origem ou tipo de disparo." empty={!origem.length}><ResponsiveContainer width="100%" height="100%"><BarChart data={origem} margin={{ top: 18, right: 10, left: 0, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tickFormatter={formatNumber} tick={{ fontSize: 11 }} /><Tooltip content={<CustomTooltip description="Matrículas atribuídas a esta origem ou tipo" />} /><Bar name="Matrículas" dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]}><LabelList dataKey="value" position="top" formatter={formatNumber} fontSize={11} /></Bar></BarChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Retornos por consultor" subtitle="Compara o volume de retornos gerados por cada consultor. Exibindo os 10 consultores com maior retorno." empty={!retornosConsultor.length}><ResponsiveContainer width="100%" height="100%"><BarChart data={retornosConsultor} layout="vertical" margin={{ top: 4, right: 18, left: 20, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tickFormatter={formatNumber} tick={{ fontSize: 11 }} /><YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} /><Tooltip content={<CustomTooltip description="Retornos gerados pelo consultor" />} /><Bar name="Retornos" dataKey="value" radius={[0, 8, 8, 0]} fill="#9333ea"><LabelList dataKey="value" position="right" formatter={formatNumber} fontSize={11} /></Bar></BarChart></ResponsiveContainer></ChartCard>
    </section>
  );
}
