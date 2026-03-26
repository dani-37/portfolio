import { render } from '@testing-library/react'
import TopoBackground from '../components/TopoBackground'

it('renders an SVG element with the topo filter', () => {
  const { container } = render(<TopoBackground />)
  const svg = container.querySelector('svg')
  expect(svg).toBeInTheDocument()
  expect(container.querySelector('#topo-flow')).toBeInTheDocument()
  expect(container.querySelector('#contours')).toBeInTheDocument()
})
