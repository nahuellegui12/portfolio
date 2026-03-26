import { useMemo, useState } from 'react'

const FILTERS = ['Todos', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

function BankPromosLanding({ promos = [] }) {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const visiblePromos = useMemo(() => {
    if (activeFilter === 'Todos') {
      return promos
    }

    return promos.filter((promo) => promo.day === activeFilter)
  }, [activeFilter, promos])

  return (
    <section className="bank-promos" aria-label="Landing de promociones bancarias">
      <header className="bank-promos-head">
        <p className="bank-promos-kicker">Beneficios semanales</p>
        <h2>Landing de promociones bancarias</h2>
        <p>
          Filtra por dia para revisar beneficios vigentes y descubre cada detalle al
          pasar el cursor por las tarjetas.
        </p>
      </header>

      <div className="bank-promos-filters" role="tablist" aria-label="Filtrar promociones por dia">
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter

          return (
            <button
              type="button"
              key={filter}
              role="tab"
              aria-selected={isActive}
              className={`promo-filter-btn${isActive ? ' is-active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          )
        })}
      </div>

      <div className="bank-promos-grid">
        {visiblePromos.map((promo) => (
          <article
            className="bank-promo-card"
            key={promo.id}
            style={{ '--bank-color': promo.color }}
          >
            <div className="bank-promo-main">
              <div className="bank-promo-brand-row">
                <span className="bank-logo-placeholder">{promo.bankShort}</span>
                  <div>
                    <p className="bank-name">{promo.bank}</p>
                    <span className="bank-day-pill">{promo.day}</span>
                  </div>
              </div>

              <p className="bank-promo-copy">{promo.promo}</p>
            </div>

            <div className="bank-promo-details">
              <p>{promo.details}</p>
            </div>
          </article>
        ))}
      </div>

      {visiblePromos.length === 0 ? (
        <p className="bank-promos-empty">No hay promociones para este dia.</p>
      ) : null}
    </section>
  )
}

export default BankPromosLanding
