import { formatCell, labelFor, toNumber } from '../utils/formatters.js';

const NUMERIC_HINTS = ['total', 'leads', 'retorno', 'positivo', 'negativo', 'matricula', 'mat', 'disparos', 'quantidade', 'qtd', 'taxa'];

export function formatHeader(key) { return labelFor(key); }
export function formatValue(value, column = '') { return formatCell(value, column); }
export function isNumericColumn(column, value) { return typeof value === 'number' || NUMERIC_HINTS.some((hint) => String(column).toLowerCase().includes(hint)); }

function sortRows(rows, columns) {
  const sortKey = ['total_leads', 'totalLeads', 'retorno', 'retornos'].find((key) => columns.includes(key));
  return sortKey ? [...rows].sort((a, b) => toNumber(b?.[sortKey]) - toNumber(a?.[sortKey])) : rows;
}

export function DataTable({ eyebrow = 'Tabela', title, description, rows, columns: preferredColumns, emptyMessage, maxHeight = 340 }) {
  const availableColumns = Array.from(new Set(rows.flatMap((row) => Object.keys(row || {}))));
  const columns = (preferredColumns || availableColumns).filter((column) => availableColumns.includes(column));
  const visibleRows = sortRows(rows, columns);

  return (
    <section className="panel table-card">
      <div className="section-heading section-heading--compact">
        <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><span>{description}</span></div>
        <strong className="table-count">{rows.length.toLocaleString('pt-BR')} registros</strong>
      </div>
      {visibleRows.length && columns.length ? (
        <div className="table-scroll" style={{ '--table-max-height': `${maxHeight}px` }}>
          <table><thead><tr>{columns.map((column) => <th key={column} className={isNumericColumn(column) ? 'cell-number' : undefined}>{formatHeader(column)}</th>)}</tr></thead>
          <tbody>{visibleRows.map((row, rowIndex) => <tr key={`${title}-${rowIndex}`}>{columns.map((column) => <td key={column} className={isNumericColumn(column, row?.[column]) ? 'cell-number' : undefined}>{formatValue(row?.[column], column)}</td>)}</tr>)}</tbody></table>
        </div>
      ) : <div className="empty-state empty-state--table">{emptyMessage}</div>}
    </section>
  );
}
