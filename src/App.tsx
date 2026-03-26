import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/projects/:slug" element={<div>project</div>} />
      </Routes>
    </BrowserRouter>
  )
}
