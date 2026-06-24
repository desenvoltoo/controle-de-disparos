import { useMemo, useState } from 'react';
import { formatHeader, formatValue, isNumericColumn } from './tableUtils.jsx';
import { getFirstValue, toNumber } from '../utils/formatters.js';

const SUMMARY_COLUMNS = ['consultor', 'total_leads', 'retorno', 'positivo', 'negativo', 'matriculas', 'taxa_retorno', 'taxa_matricula'];
const KEYS = { consultor: ['consultor_disparo', 'consultor', 'nome', 'nomeConsultor'], total_leads: ['total_leads', 'totalLeads', 'leads', 'total'], retorno: ['retorno', 'retornos', 'totalRetornos'], positivo: ['positivo', 'positivos'], negativo: ['negativo', 'negativos'], matriculas: ['matriculas', 'MAT', 'matrículas'], taxa_retorno: ['taxa_retorno', 'taxaRetorno'], taxa_matricula: ['taxa_matricula', 'taxaMatricula'] };

function value(row, col) { return getFirstValue(row, KEYS[col] || [col]); }
function groupRows(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const name = String(value(row, 'consultor') || 'Sem identificação');
    const current = map.get(name) || { consultor: name, total_leads: 0, retorno: 0, positivo: 0, negativo: 0, matriculas: 0, detalhes: [] };
    current.total_leads += toNumber(value(row, 'total_leads')); current.retorno += toNumber(value(row, 'retorno')); current.positivo += toNumber(value(row, 'positivo')); current.negativo += toNumber(value(row, 'negativo')); current.matriculas += toNumber(value(row, 'matriculas')); current.detalhes.push(row);
    map.set(name, current);
  });
  return Array.from(map.values()).map((row) => ({ ...row, taxa_retorno: row.total_leads ? row.retorno / row.total_leads : 0, taxa_matricula: row.total_leads ? row.matriculas / row.total_leads : 0 })).sort((a, b) => b.retorno - a.retorno);
}

export default function TabelaConsultores({ dados }) {
  const [open, setOpen] = useState({});
  const grupos = useMemo(() => groupRows(dados), [dados]);
  const detailColumns = useMemo(() => Array.from(new Set(dados.flatMap((row) => Object.keys(row || {})))).slice(0, 12), [dados]);
  return <section className="panel table-card consultants-card"><div className="section-heading section-heading--compact"><div><p className="eyebrow">Consultores</p><h2>Resumo por consultor</h2><span>Todos começam recolhidos. Clique na linha para ver campanhas e detalhes disponíveis.</span></div><strong className="table-count">{grupos.length.toLocaleString('pt-BR')} consultores</strong></div>{grupos.length ? <div className="consultants-list"><div className="consultants-header">{SUMMARY_COLUMNS.map((c) => <span key={c} className={isNumericColumn(c) ? 'cell-number' : undefined}>{formatHeader(c)}</span>)}</div>{grupos.map((row) => <div className="consultant-row" key={row.consultor}><button type="button" className="consultant-summary" onClick={() => setOpen((cur) => ({ ...cur, [row.consultor]: !cur[row.consultor] }))}><span className="chevron">{open[row.consultor] ? '▼' : '▶'}</span>{SUMMARY_COLUMNS.map((c) => <span key={c} className={isNumericColumn(c, row[c]) ? 'cell-number' : undefined}>{formatValue(row[c], c)}</span>)}</button>{open[row.consultor] && <div className="consultant-details"><strong>Campanhas/arquivos do consultor</strong>{row.detalhes.map((detail, index) => <div className="detail-grid" key={index}>{detailColumns.map((c) => <div className="detail-item" key={c}><span>{formatHeader(c)}</span><b className={isNumericColumn(c, detail?.[c]) ? 'cell-number' : undefined}>{formatValue(detail?.[c], c)}</b></div>)}</div>)}</div>}</div>)}</div> : <div className="empty-state empty-state--table">Nenhum consultor encontrado para os filtros selecionados.</div>}</section>;
}
