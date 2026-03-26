import { useEffect, useMemo, useRef, useState } from 'react'

function getTimeLeft(targetDate) {
  const now = Date.now()
  const distance = new Date(targetDate).getTime() - now

  if (distance <= 0) {
    return { isFinished: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    isFinished: false,
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  }
}

function CountdownBanner({
  title,
  subtitle,
  targetDate,
  collectionUrl,
  buttonLabel,
  flashOffers = [],
  featuredCategories = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))
  const panelId = 'countdown-collection-panel'
  const flashSliderRef = useRef(null)

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timerId)
  }, [targetDate])

  const countdownItems = useMemo(
    () => [
      { label: 'Dias', value: timeLeft.days },
      { label: 'Horas', value: timeLeft.hours },
      { label: 'Min', value: timeLeft.minutes },
      { label: 'Seg', value: timeLeft.seconds },
    ],
    [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds],
  )

  const scrollFlashSlider = (direction) => {
    if (!flashSliderRef.current) {
      return
    }

    const amount = flashSliderRef.current.clientWidth * 0.82
    flashSliderRef.current.scrollBy({
      left: amount * direction,
      behavior: 'smooth',
    })
  }

  return (
    <article className="countdown-card">
      <div className="countdown-head">
        <img src="/images/logo-cyber.png" alt="Cyber" className="countdown-badge-logo" />
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {timeLeft.isFinished ? (
        <p className="finished-pill">La promo ya finalizo</p>
      ) : (
        <div className="countdown-grid" aria-live="polite">
          {countdownItems.map((item) => (
            <div key={item.label} className="time-box">
              <span>{item.value.toString().padStart(2, '0')}</span>
              <small>{item.label}</small>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className={`disclosure-trigger${isExpanded ? ' is-open' : ''}`}
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
      >
        <span>{isExpanded ? 'Ocultar ofertas y categorias' : 'Ver ofertas y categorias'}</span>
        <span className="disclosure-trigger-icon" aria-hidden="true">
          <svg viewBox="0 0 12 12" focusable="false">
            <path d="M2 4.25 6 8l4-3.75" />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        className={`disclosure-panel${isExpanded ? ' is-open' : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className="disclosure-inner">
          <section className="countdown-extra-block">
            <div className="block-title-row">
              <h3>Ofertas flash</h3>
              <div className="flash-slider-controls" aria-label="Navegacion ofertas flash">
                <button type="button" onClick={() => scrollFlashSlider(-1)} aria-label="Oferta anterior">
                  {'<'}
                </button>
                <button type="button" onClick={() => scrollFlashSlider(1)} aria-label="Siguiente oferta">
                  {'>'}
                </button>
              </div>
            </div>

            <div className="flash-slider" ref={flashSliderRef}>
              {flashOffers.map((offer) => (
                <a
                  key={offer.id}
                  href={offer.url}
                  className="flash-offer-slide"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flash-offer-media">
                    <img src={offer.imageUrl} alt={offer.imageAlt} loading="lazy" decoding="async" />
                  </div>
                  <p className="flash-offer-name">{offer.name}</p>
                  <p className="flash-offer-price-row">
                    <strong>${offer.price}</strong>
                    <span>${offer.oldPrice}</span>
                    <em>{offer.discount}</em>
                  </p>
                </a>
              ))}
            </div>
          </section>

          <section className="countdown-extra-block">
            <h3>Categorias destacadas</h3>
            <div className="category-grid">
              {featuredCategories.map((category) => (
                <a
                  key={category.id}
                  href={category.url}
                  className="category-banner"
                  style={{ '--category-image': `url(${category.imageUrl})` }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="category-banner-label">{category.label}</span>
                </a>
              ))}
            </div>
          </section>

          <a href={collectionUrl} className="collection-cta" target="_blank" rel="noreferrer">
            {buttonLabel}
          </a>
        </div>
      </div>
    </article>
  )
}

export default CountdownBanner
