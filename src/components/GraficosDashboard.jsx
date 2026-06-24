import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#9333ea', '#f97316', '#db2777', '#0891b2'];

function normalizeChartData(data, nameKeys, valueKeys) {
  return data.map((item, index) => ({
    name: nameKeys.map((key) => item[key]).find(Boolean) || `Item ${index + 1}`,
    value: Number(valueKeys.map((key) => item[key]).find((value) => value !== undefined && value !== null) || 0),
  }));
}

function EmptyChart() {
  return <div className="empty-state">Sem dados para exibir neste gráfico.</div>;
}

function ChartCard({ title, children }) {
  return (
    <article className="panel chart-card">
      <h3>{title}</h3>
      <div className="chart-wrapper">{children}</div>
    </article>
  );
}

export default function GraficosDashboard({ arquivos, consultores, matriculasPorMes, matriculasOrigem }) {
  const leadsPorTipo = normalizeChartData(arquivos, ['tipo', 'tipoDisparo', 'canal'], ['leads', 'disparos', 'total']);
  const matriculasMes = normalizeChartData(matriculasPorMes, ['mes', 'mês', 'periodo'], ['matriculas', 'matrículas', 'total']);
  const origem = normalizeChartData(matriculasOrigem, ['origem', 'tipo', 'canal'], ['matriculas', 'matrículas', 'total']);
  const retornosConsultor = normalizeChartData(consultores, ['consultor', 'nome'], ['retornos', 'totalRetornos', 'total']);

  return (
    <section className="charts-grid" aria-label="Gráficos do dashboard">
      <ChartCard title="Leads por tipo: ROBO x URA">
        {leadsPorTipo.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadsPorTipo}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#2563eb" /></BarChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </ChartCard>

      <ChartCard title="Matrículas por mês">
        {matriculasMes.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={matriculasMes}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </ChartCard>

      <ChartCard title="Matrículas por origem">
        {origem.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={origem} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>{origem.map((_, index) => <Cell key={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </ChartCard>

      <ChartCard title="Retornos por consultor">
        {retornosConsultor.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={retornosConsultor} layout="vertical" margin={{ left: 24 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" /><YAxis dataKey="name" type="category" width={100} /><Tooltip /><Bar dataKey="value" radius={[0, 10, 10, 0]} fill="#9333ea" /></BarChart>
          </ResponsiveContainer>
        ) : <EmptyChart />}
      </ChartCard>
    </section>
  );
}
