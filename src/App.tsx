import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { MODULES } from './modules/registry'
import { useHashRoute } from './hooks/useHashRoute'
import './App.css'

function App() {
  const route = useHashRoute()
  const activeModule = MODULES.find((module) => module.id === route && module.status === 'available')

  return (
    <div className="site">
      <SiteHeader moduleTitle={activeModule?.title} moduleIcon={activeModule?.icon} />
      <main className="site-main">{activeModule?.Component ? <activeModule.Component /> : <HomePage />}</main>
      <footer className="site-footer">🔬 수학 탐구 놀이터 · 수업과 자기주도학습을 위한 시뮬레이션</footer>
    </div>
  )
}

export default App
