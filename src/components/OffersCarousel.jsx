import { useEffect, useMemo, useRef, useState } from 'react'

const PAGE_SLIDE_DURATION_MS = 380

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
  const productsViewportRef = useRef(null)
  const [current, setCurrent] = useState(0)
  const [transition, setTransition] = useState(null)
  const [transitionHeight, setTransitionHeight] = useState(null)
  const [cardsPerView, setCardsPerView] = useState(3)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)

  const goTo = (nextIndex, directionHint = 0) => {
    if (safeItems.length === 0) {
      return
    }

    const wrappedIndex = ((nextIndex % safeItems.length) + safeItems.length) % safeItems.length

    if (wrappedIndex === current || transition) {
      return
    }

    const inferredDirection =
      directionHint !== 0 ? directionHint : wrappedIndex > current ? 1 : -1

    const isSingleCardView = cardsPerView <= 1
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isSingleCardView) {
      setCurrent(wrappedIndex)
      setTransition(null)
      setTransitionHeight(null)
      return
    }

    if (productsViewportRef.current) {
      setTransitionHeight(productsViewportRef.current.getBoundingClientRect().height)
    }

    setTransition({ from: current, to: wrappedIndex, direction: inferredDirection })
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
    if (!transition) {
      return undefined
    }

    const animationId = window.setTimeout(() => {
      setCurrent(transition.to)
      setTransition(null)
      setTransitionHeight(null)
    }, PAGE_SLIDE_DURATION_MS)

    return () => window.clearTimeout(animationId)
  }, [transition])

  useEffect(() => {
    if (isPaused || safeItems.length === 0 || transition) {
      return undefined
    }

    const autoplayId = window.setTimeout(() => {
      goTo(current + 1, 1)
    }, 5200)

    return () => window.clearTimeout(autoplayId)
  }, [isPaused, safeItems.length, current, transition])

  useEffect(() => {
    if (safeItems.length === 0) {
      return
    }

    if (current >= safeItems.length) {
      setCurrent(0)
      setTransition(null)
    }
  }, [current, safeItems.length])

  const visibleCount = Math.min(cardsPerView, safeItems.length)

  const getVisibleItems = (startIndex) =>
    Array.from({ length: visibleCount }, (_, index) => {
      const itemIndex = (startIndex + index) % safeItems.length
      return safeItems[itemIndex]
    })

  const visibleItems = useMemo(() => getVisibleItems(current), [current, safeItems, visibleCount])

  const transitionFromItems = useMemo(
    () => (transition ? getVisibleItems(transition.from) : []),
    [transition, safeItems, visibleCount],
  )

  const transitionToItems = useMemo(
    () => (transition ? getVisibleItems(transition.to) : []),
    [transition, safeItems, visibleCount],
  )

  const renderProductCard = (item) => (
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
          goTo(current - 1, -1)
        }

        if (delta < -threshold) {
          goTo(current + 1, 1)
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
          ref={productsViewportRef}
          className="products-viewport"
          style={{
            '--cards-per-view': visibleCount,
            height: transition && transitionHeight ? `${transitionHeight}px` : undefined,
          }}
        >
          {transition ? (
            <>
              <div
                className={`products-grid products-grid-layer products-grid-out ${
                  transition.direction > 0 ? 'is-next' : 'is-prev'
                }`}
              >
                {transitionFromItems.map(renderProductCard)}
              </div>

              <div
                className={`products-grid products-grid-layer products-grid-in ${
                  transition.direction > 0 ? 'is-next' : 'is-prev'
                }`}
              >
                {transitionToItems.map(renderProductCard)}
              </div>
            </>
          ) : (
            <div className="products-grid">{visibleItems.map(renderProductCard)}</div>
          )}
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
              onClick={() => goTo(current - 1, -1)}
              aria-label="Oferta anterior"
            >
              {'<'}
            </button>

            <button
              type="button"
              className="carousel-arrow"
              onClick={() => goTo(current + 1, 1)}
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
