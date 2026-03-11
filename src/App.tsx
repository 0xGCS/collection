import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import LandingPage from '@/components/LandingPage'
import CollectionTable from '@/components/CollectionTable'

function TwitterPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary-text">Twitter</h1>
        <p className="mt-2 text-muted-text">Coming Soon</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/toooooooooools" element={<CollectionTable />} />
          <Route path="/twitter" element={<TwitterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
