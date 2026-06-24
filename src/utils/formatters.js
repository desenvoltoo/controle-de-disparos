import { friendlyLabel } from '../constants/labels.js';

export function getFirstValue(row, keys) {
  return keys.map((key) => row?.[key]).find((value) => value !== undefined && value !== null && value !== '') ?? '';
}

export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined || value === '') return 0;
  const text = String(value).trim().replace('%', '');
  const normalized = text.includes(',') ? text.replace(/\./g, '').replace(',', '.') : text.replace(/,/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizePercent(value) {
  if (value === null || value === undefined || value === '') return 0;
  const numeric = toNumber(value);
  if (String(value).includes('%')) return numeric;
  return Math.abs(numeric) > 0 && Math.abs(numeric) <= 1 ? numeric * 100 : numeric;
}

export function formatNumber(value, options = {}) {
  return toNumber(value).toLocaleString('pt-BR', { maximumFractionDigits: 0, ...options });
}

export function formatPercent(value) {
  return `${normalizePercent(value).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = typeof value === 'number' ? new Date(value < 10000000000 ? value * 1000 : value) : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function formatMonthLabel(value) {
  if (!value) return 'Sem identificação';
  const text = String(value).trim();
  let match = text.match(/^(\d{4})[-/](\d{1,2})/);
  if (match) return `${MONTHS[Number(match[2]) - 1] || match[2]}/${match[1]}`;
  match = text.match(/^(\d{1,2})[-/](\d{4})$/);
  if (match) return `${MONTHS[Number(match[1]) - 1] || match[1]}/${match[2]}`;
  const date = new Date(text);
  if (!Number.isNaN(date.getTime())) return `${MONTHS[date.getMonth()]}/${date.getFullYear()}`;
  return text || 'Sem identificação';
}

export function formatCell(value, column = '') {
  if (value === null || value === undefined || value === '') return '—';
  const key = String(column).toLowerCase();
  if (key.includes('taxa') || String(value).includes('%')) return formatPercent(value);
  if (key.includes('data') || key.includes('iniciado') || key.includes('finalizado') || key.includes('atualizado')) return formatDateTime(value);
  if (['number'].includes(typeof value) || ['total','leads','retorno','positivo','negativo','matricula','mat','disparos','qtd','quantidade'].some((h) => key.includes(h))) return formatNumber(value, { maximumFractionDigits: 2 });
  return String(value);
}

export function labelFor(key) { return friendlyLabel(key); }
