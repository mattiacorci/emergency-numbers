// Wrappa tutto con LocationProvider
// Renderizza HomePage
// Qui importi leaflet/dist/leaflet.css se non lo fai in MapView

import './App.css'
import 'leaflet/dist/leaflet.css'
import { HomePage } from './pages/HomePage'



function App() {
  return (
    <div class="container mx-auto px-8 py-8">
      <HomePage />
    </div>
  )
}

export default App
