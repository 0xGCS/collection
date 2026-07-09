import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'
import LandingPage from '@/components/LandingPage'
import CollectionGrid from '@/components/CollectionGrid'
import CollectionDetailPage from '@/components/CollectionDetailPage'
import TopicsPage from '@/components/TopicsPage'
import TagsPage from '@/components/TagsPage'
import TagDetailPage from '@/components/TagDetailPage'

// Redirect legacy detail URLs (/toooooooooools/:itemId) to the new /tools/item/:itemId path.
function LegacyDetailRedirect() {
  const { itemId } = useParams<{ itemId: string }>()
  return <Navigate to={`/tools/item/${itemId}`} replace />
}

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
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Legacy redirects: preserve old /toooooooooools links */}
            <Route path="/toooooooooools" element={<Navigate to="/tools" replace />} />
            <Route path="/toooooooooools/:itemId" element={<LegacyDetailRedirect />} />
            {/* Tools */}
            <Route path="/tools" element={<CollectionGrid />} />
            <Route path="/tools/topics" element={<TopicsPage />} />
            <Route path="/tools/item/:itemId" element={<CollectionDetailPage />} />
            <Route path="/tools/category/:categorySlug" element={<CollectionGrid />} />
            <Route path="/tools/:category" element={<CollectionGrid />} />
            {/* Tags */}
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/tags/:tagSlug" element={<TagDetailPage />} />
            <Route path="/twitter" element={<TwitterPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
