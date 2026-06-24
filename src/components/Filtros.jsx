export default function Filtros({ filtros, opcoes, onChange, onReset }) {
  return (
    <section className="panel filters-panel" aria-label="Filtros do dashboard">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Filtros</p>
          <h2>Refine a análise</h2>
        </div>
        <button className="button button--ghost" type="button" onClick={onReset}>Limpar filtros</button>
      </div>

      <div className="filters-grid">
        <label>
          Consultor
          <select value={filtros.consultor} onChange={(event) => onChange('consultor', event.target.value)}>
            <option value="">Todos</option>
            {opcoes.consultores.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Tipo de disparo
          <select value={filtros.tipo} onChange={(event) => onChange('tipo', event.target.value)}>
            <option value="">Todos</option>
            {opcoes.tipos.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Pasta/status
          <select value={filtros.status} onChange={(event) => onChange('status', event.target.value)}>
            <option value="">Todos</option>
            {opcoes.status.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Busca por campanha
          <input type="search" placeholder="Digite o nome da campanha" value={filtros.busca} onChange={(event) => onChange('busca', event.target.value)} />
        </label>
      </div>
    </section>
  );
}
