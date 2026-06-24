export default function Filtros({ filtros, opcoes, onChange, onReset }) {
  return (
    <section className="panel filters-panel" aria-label="Filtros do dashboard">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Filtros</p>
          <h2>Refine a análise</h2>
        </div>
        <button className="button button--ghost" type="button" onClick={onReset}>Limpar filtros</button>
      </div>

      <div className="filters-grid">
        <label>
          <span>Consultor</span>
          <select value={filtros.consultor} onChange={(event) => onChange('consultor', event.target.value)}>
            <option value="">Todos</option>
            {opcoes.consultores.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Tipo de disparo</span>
          <select value={filtros.tipo} onChange={(event) => onChange('tipo', event.target.value)}>
            <option value="">Todos</option>
            {opcoes.tipos.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Pasta/status</span>
          <select value={filtros.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="">Todos</option>
            {opcoes.status.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Busca por campanha</span>
          <input type="search" placeholder="Nome da campanha" value={filtros.busca} onChange={(event) => onChange('busca', event.target.value)} />
        </label>
      </div>
    </section>
  );
}
