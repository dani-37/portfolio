import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Suspense } from 'react'
import ProjectPage from '../pages/ProjectPage'

function renderAtSlug(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/projects/${slug}`]}>
      <Routes>
        <Route path="/projects/:slug" element={
          <Suspense fallback={<div>loading</div>}>
            <ProjectPage />
          </Suspense>
        } />
      </Routes>
    </MemoryRouter>
  )
}

it('renders a back link', () => {
  const { getByText } = renderAtSlug('odi')
  expect(getByText(/back/i)).toBeInTheDocument()
})

it('renders a 404 message for unknown slugs', async () => {
  const { findByText } = renderAtSlug('not-a-real-project')
  expect(await findByText(/not found/i)).toBeInTheDocument()
})
