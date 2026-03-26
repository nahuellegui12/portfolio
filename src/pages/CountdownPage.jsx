import CountdownBanner from '../components/CountdownBanner.jsx'

const flashOffers = [
  {
    id: 'flash-1',
    name: 'Smart TV 55 4K Neo',
    price: '499.990',
    oldPrice: '699.990',
    discount: '-29%',
    imageUrl: '/images/flash-tv.svg',
    imageAlt: 'Smart TV de 55 pulgadas con interfaz de streaming',
    url: 'https://example.com/products/smart-tv-55',
  },
  {
    id: 'flash-2',
    name: 'Aspiradora Robot Home+',
    price: '189.990',
    oldPrice: '279.990',
    discount: '-32%',
    imageUrl: '/images/flash-robot.svg',
    imageAlt: 'Aspiradora robot blanca en piso de madera',
    url: 'https://example.com/products/aspiradora-robot',
  },
  {
    id: 'flash-3',
    name: 'Notebook Air 14',
    price: '729.990',
    oldPrice: '899.990',
    discount: '-19%',
    imageUrl: '/images/flash-notebook.svg',
    imageAlt: 'Notebook ultradelgada abierta sobre escritorio',
    url: 'https://example.com/products/notebook-air-14',
  },
  {
    id: 'flash-4',
    name: 'Consola GameBox S',
    price: '399.990',
    oldPrice: '529.990',
    discount: '-25%',
    imageUrl: '/images/flash-console.svg',
    imageAlt: 'Consola de videojuegos junto a dos controles',
    url: 'https://example.com/products/gamebox-s',
  },
  {
    id: 'flash-5',
    name: 'Smartwatch Pulse Fit',
    price: '129.990',
    oldPrice: '179.990',
    discount: '-28%',
    imageUrl: '/images/flash-watch.svg',
    imageAlt: 'Reloj inteligente con pantalla activa de actividad fisica',
    url: 'https://example.com/products/pulse-fit',
  },
]

const featuredCategories = [
  {
    id: 'cat-1',
    label: 'Tecnologia',
    imageUrl:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    url: 'https://example.com/collections/tecnologia',
  },
  {
    id: 'cat-2',
    label: 'Hogar',
    imageUrl:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    url: 'https://example.com/collections/hogar',
  },
  {
    id: 'cat-3',
    label: 'Moda',
    imageUrl:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    url: 'https://example.com/collections/moda',
  },
]

function getBlackFridayEndDate() {
  const getDateForYear = (year) => {
    const november = 10
    const thanksgiving = new Date(year, november, 1)
    let thursdayCount = 0

    while (thursdayCount < 4) {
      if (thanksgiving.getDay() === 4) {
        thursdayCount += 1
      }

      if (thursdayCount < 4) {
        thanksgiving.setDate(thanksgiving.getDate() + 1)
      }
    }

    const blackFridayEnd = new Date(thanksgiving)
    blackFridayEnd.setDate(blackFridayEnd.getDate() + 1)
    blackFridayEnd.setHours(23, 59, 59, 999)

    return blackFridayEnd
  }

  const year = new Date().getFullYear()
  const blackFridayEnd = getDateForYear(year)

  if (blackFridayEnd.getTime() < Date.now()) {
    return getDateForYear(year + 1).toISOString()
  }

  return blackFridayEnd.toISOString()
}

function CountdownPage() {
  return (
    <section className="panel">
      <CountdownBanner
        title="Cyber Monday termina en"
        // subtitle="Activa este bloque en homepage para reforzar urgencia y conversion."
        targetDate={getBlackFridayEndDate()}
        collectionUrl="https://example.com/collections/black-friday"
        buttonLabel="Ir a coleccion Black Friday"
        flashOffers={flashOffers}
        featuredCategories={featuredCategories}
      />
    </section>
  )
}

export default CountdownPage
