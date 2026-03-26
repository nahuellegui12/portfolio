import OffersCarousel from '../components/OffersCarousel.jsx'
import offers from '../data/offers.js'

function OffersCarouselPage() {
  return (
    <section className="panel">
      <div className="section-copy">
        <h2>Carrusel de ofertas para ecommerce</h2>
        <p>
          Componente orientado a campañas: destaca productos con descuento y CTA
          directo para acelerar el paso a compra.
        </p>
      </div>
      <OffersCarousel items={offers} />
    </section>
  )
}

export default OffersCarouselPage
