import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/countdown', label: 'Countdown' },
  { to: '/ofertas', label: 'Carrusel de Ofertas' },
  { to: '/promociones-bancarias', label: 'Promociones bancarias' },
]

function TabsNav() {
  return (
    <nav className="tabs" aria-label="Navegacion por componentes">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `tab-link${isActive ? ' tab-link-active' : ''}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default TabsNav
