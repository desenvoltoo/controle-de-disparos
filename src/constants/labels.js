export const STATUS_LABELS = {
  AC: 'Atendimento concluído',
  EC: 'Em contato',
  NT: 'Não teve retorno',
  IF: 'Inscrição feita',
  MAT: 'Matrícula',
  NI: 'Não interessado',
  COU: 'Contato útil',
};

export const FIELD_LABELS = {
  campanha: 'Campanha', nome_campanha: 'Campanha', nomeCampanha: 'Campanha', arquivo: 'Campanha', nomeArquivo: 'Campanha',
  total_leads: 'Total de leads', totalLeads: 'Total de leads', leads: 'Total de leads', disparos: 'Disparos',
  retorno: 'Retornos', retornos: 'Retornos', totalRetornos: 'Retornos',
  positivo: 'Positivos', positivos: 'Positivos', negativo: 'Negativos', negativos: 'Negativos',
  matriculas: 'Matrículas', matriculas_total: 'Matrículas', MAT: 'Matrículas', mat: 'Matrículas',
  retorno_positivo: 'Retorno positivo', taxa_retorno: 'Taxa de retorno', taxaRetorno: 'Taxa de retorno', taxa_matricula: 'Taxa de matrícula', taxaMatricula: 'Taxa de matrícula',
  consultor_disparo: 'Consultor', consultor: 'Consultor', nomeConsultor: 'Consultor', nome: 'Nome',
  tipo_disparo: 'Tipo', tipoDisparo: 'Tipo', tipo: 'Tipo', canal: 'Tipo', origem: 'Origem',
  pasta_status: 'Status/Pasta', status: 'Status/Pasta', pasta: 'Status/Pasta', situacao: 'Situação',
  disparo_iniciado: 'Início do disparo', disparo_finalizado: 'Fim do disparo', atualizado_em: 'Atualizado em', atualizadoEm: 'Atualizado em',
  planilhas: 'Planilhas', mes: 'Mês', ym: 'Mês', periodo: 'Período', graduacao: 'Graduação', pos_graduacao: 'Pós-graduação', tecnico: 'Técnico',
};

export function friendlyLabel(key = '') {
  return FIELD_LABELS[key] || String(key).replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (l) => l.toUpperCase());
}
