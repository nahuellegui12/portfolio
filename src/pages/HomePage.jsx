import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="panel home-panel">
      <h2>Componentes disponibles</h2>
      <p>
        Esta pagina funciona como vitrina: cada tab abre un componente de ecommerce
        listo para adaptar en una tienda real.
      </p>

      <div className="home-grid">
        <article>
          <h3>Countdown de evento</h3>
          <p>
            Banner de Black Friday con reloj en vivo y desplegable que redirige a
            una coleccion.
          </p>
          <Link to="/countdown">Abrir componente</Link>
        </article>

        <article>
          <h3>Carrusel de ofertas</h3>
          <p>
            Slider para destacar promos con navegacion por flechas, dots y soporte
            para gestos touch.
          </p>
          <Link to="/ofertas">Abrir componente</Link>
        </article>

        <article>
          <h3>Landing de promociones bancarias</h3>
          <p>
            Landing con filtros por dia para mostrar beneficios de bancos en
            tarjetas con informacion expandible.
          </p>
          <Link to="/promociones-bancarias">Abrir componente</Link>
        </article>
      </div>
    </section>
  )
}

export default HomePage
