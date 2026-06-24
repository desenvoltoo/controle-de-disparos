export default function Filtros({ filtros, opcoes, onChange, onReset }) {
  return (
    <section className="panel filters-panel" aria-label="Filtros do dashboard">
      <div className="section-heading section-heading--compact"><div><p className="eyebrow">Filtros</p><h2>Refine a análise</h2><span>Selecione opções reais da API para ajustar tabelas e gráficos compatíveis.</span></div><button className="button button--ghost" type="button" onClick={onReset}>Limpar filtros</button></div>
      <div className="filters-grid">
        <label><span>Consultor</span><select value={filtros.consultor} onChange={(e) => onChange('consultor', e.target.value)}><option value="">Todos os consultores</option>{opcoes.consultores.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>Tipo de disparo</span><select value={filtros.tipo} onChange={(e) => onChange('tipo', e.target.value)}><option value="">Todos os tipos</option>{opcoes.tipos.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>Pasta/status</span><select value={filtros.status} onChange={(e) => onChange('status', e.target.value)}><option value="">Todos os status</option>{opcoes.status.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span>Campanha</span><input type="search" placeholder="Buscar campanha..." value={filtros.busca} onChange={(e) => onChange('busca', e.target.value)} /></label>
      </div>
    </section>
  );
}
