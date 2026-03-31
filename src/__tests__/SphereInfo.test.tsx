import { render, screen } from '@testing-library/react'
import SphereInfo from '../components/SphereInfo'

it('renders "shaped by live data" as the resting label', () => {
  render(<SphereInfo />)
  expect(screen.getByText('shaped by live data')).toBeInTheDocument()
})
