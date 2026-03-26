import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import TabsNav from './components/TabsNav.jsx'
import BankPromosPage from './pages/BankPromosPage.jsx'
import CountdownPage from './pages/CountdownPage.jsx'
import HomePage from './pages/HomePage.jsx'
import OffersCarouselPage from './pages/OffersCarouselPage.jsx'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [previewMode, setPreviewMode] = useState('desktop')
  const [showStage, setShowStage] = useState(!isHome)
  const wasHomeRef = useRef(isHome)

  useEffect(() => {
    let stageTimerId

    if (isHome) {
      wasHomeRef.current = true
      stageTimerId = setTimeout(() => {
        setShowStage(false)
      }, 0)

      return () => clearTimeout(stageTimerId)
    }

    if (wasHomeRef.current) {
      stageTimerId = setTimeout(() => {
        setShowStage(true)
        wasHomeRef.current = false
      }, 340)

      return () => clearTimeout(stageTimerId)
    }

    wasHomeRef.current = false
    stageTimerId = setTimeout(() => {
      setShowStage(true)
    }, 0)

    return () => clearTimeout(stageTimerId)
  }, [isHome, location.pathname])

  const renderInStage = (element) => (
    <section className={`component-stage ${showStage ? 'is-visible' : 'is-hidden'}`}>
      <div className="component-preview-tabs" role="tablist" aria-label="Vista del componente">
        <button
          type="button"
          role="tab"
          aria-selected={previewMode === 'desktop'}
          className={`preview-tab ${previewMode === 'desktop' ? 'preview-tab-active' : ''}`}
          onClick={() => setPreviewMode('desktop')}
        >
          Desktop
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={previewMode === 'mobile'}
          className={`preview-tab ${previewMode === 'mobile' ? 'preview-tab-active' : ''}`}
          onClick={() => setPreviewMode('mobile')}
        >
          Mobile
        </button>
      </div>

      <div className={`component-preview ${previewMode === 'mobile' ? 'is-mobile' : 'is-desktop'}`}>
        <div className="component-stage-enter" key={`${location.pathname}-${previewMode}`}>
          {element}
        </div>
      </div>
    </section>
  )

  return (
    <>
      <div className="app-shell">
        <header className="app-header">
          <p className="kicker">Portfolio de Componentes eCommerce</p>
          <h1>Demo UI de componentes en<p className="vtex-logo">VTEX IO</p></h1>
          <p className="subtitle">
            Navega por pestañas y revisa cada bloque como una pieza independiente.
          </p>
        </header>

        <TabsNav />

        <main className={`app-content ${isHome ? 'show-home' : 'hide-home'}`}>
          <div className={`home-info-shell ${isHome ? 'is-open' : 'is-collapsed'}`}>
            <HomePage />
          </div>
        </main>
      </div>

      <Routes>
        <Route path="/" element={null} />
        <Route path="/countdown" element={renderInStage(<CountdownPage />)} />
        <Route path="/ofertas" element={renderInStage(<OffersCarouselPage />)} />
        <Route path="/promociones-bancarias" element={renderInStage(<BankPromosPage />)} />
        <Route path="/comparador" element={<Navigate to="/promociones-bancarias" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
