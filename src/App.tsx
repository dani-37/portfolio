import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={null}>
              <ProjectPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
