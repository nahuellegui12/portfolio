import { useEffect, useMemo, useRef, useState } from 'react'

function getCardsPerView(width) {
  if (width < 700) {
    return 1
  }

  if (width < 1040) {
    return 2
  }

  return 3
}

function OffersCarousel({ items = [] }) {
  const safeItems = items
  const carouselRef = useRef(null)
  const [current, setCurrent] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(3)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)

  const goTo = (nextIndex) => {
    if (safeItems.length === 0) {
      return
    }

    const wrappedIndex = ((nextIndex % safeItems.length) + safeItems.length) % safeItems.length
    setCurrent(wrappedIndex)
  }

  useEffect(() => {
    const updateCardsPerView = () => {
      if (!carouselRef.current) {
        return
      }

      setCardsPerView(getCardsPerView(carouselRef.current.clientWidth))
    }

    updateCardsPerView()

    let resizeObserver
    if (typeof ResizeObserver !== 'undefined' && carouselRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateCardsPerView()
      })
      resizeObserver.observe(carouselRef.current)
    }

    window.addEventListener('resize', updateCardsPerView)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateCardsPerView)
    }
  }, [])

  useEffect(() => {
    if (isPaused || safeItems.length === 0) {
      return undefined
    }

    const autoplayId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % safeItems.length)
    }, 5200)

    return () => clearInterval(autoplayId)
  }, [isPaused, safeItems.length])

  const visibleCount = Math.min(cardsPerView, safeItems.length)

  const visibleItems = useMemo(
    () =>
      Array.from({ length: visibleCount }, (_, index) => {
        const itemIndex = (current + index) % safeItems.length
        return safeItems[itemIndex]
      }),
    [current, safeItems, visibleCount],
  )

  if (safeItems.length === 0) {
    return (
      <section className="offers-carousel empty-state">
        <p>No hay ofertas para mostrar por ahora.</p>
      </section>
    )
  }

  return (
    <section
      ref={carouselRef}
      className="offers-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchStartX === null) {
          return
        }

        const delta = event.changedTouches[0].clientX - touchStartX
        const threshold = 45

        if (delta > threshold) {
          goTo(current - 1)
        }

        if (delta < -threshold) {
          goTo(current + 1)
        }

        setTouchStartX(null)
      }}
    >
      <aside className="slider-banner">
        <p className="slider-banner-kicker">Coleccion destacada</p>
        <h3>Semana de Ofertas</h3>
        <p>
          Slider de productos para ecommerce: muestra lo esencial al inicio y al
          pasar el cursor expande informacion de valor.
        </p>
        <a href="https://example.com/collections/destacados" target="_blank" rel="noreferrer">
          Ver toda la coleccion
        </a>
      </aside>

      <div className="slider-content">
        <div
          className="products-grid"
          style={{ '--cards-per-view': visibleCount }}
        >
          {visibleItems.map((item) => (
            <article className="product-card" key={item.id} style={{ '--offer-tint': item.tint }}>
              <div className="product-media">
                <img src={item.imageUrl} alt={item.imageAlt} loading="lazy" decoding="async" />
              </div>

              <div className="product-info">
                <p className="product-brand">{item.brand ?? item.tag}</p>
                <h4>{item.name ?? item.title}</h4>

                <p className="product-prices">
                  <strong>${item.price}</strong>
                </p>

                <div className="product-info-extra">
                  <p className="product-summary">{item.shortDescription}</p>
                  <p className="product-description">{item.hoverDescription}</p>

                  <p className="product-prices product-prices-secondary">
                    <span>${item.oldPrice}</span>
                    <em>{item.discount}</em>
                  </p>

                  <div className="product-meta-row">
                    <span>{item.badge}</span>
                    <span>{item.shipping}</span>
                  </div>

                  <a href={item.ctaUrl} target="_blank" rel="noreferrer">
                    Ver producto
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="carousel-controls">
          <div className="carousel-dots" role="tablist" aria-label="Selector de ofertas">
            {safeItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={current === index}
                className={current === index ? 'dot active' : 'dot'}
                onClick={() => goTo(index)}
                aria-label={`Ir a oferta ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-nav">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => goTo(current - 1)}
              aria-label="Oferta anterior"
            >
              {'<'}
            </button>

            <button
              type="button"
              className="carousel-arrow"
              onClick={() => goTo(current + 1)}
              aria-label="Siguiente oferta"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OffersCarousel
