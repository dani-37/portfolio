import { render } from '@testing-library/react'
import Timeline from '../sections/Timeline'

describe('Timeline', () => {
  it('renders the section header', () => {
    const { getByText } = render(<Timeline />)
    expect(getByText('Timeline')).toBeInTheDocument()
  })

  it('renders all three location markers', () => {
    const { getByText } = render(<Timeline />)
    expect(getByText('Madrid')).toBeInTheDocument()
    expect(getByText('London')).toBeInTheDocument()
    expect(getByText('Paris')).toBeInTheDocument()
  })

  it('renders all study entries', () => {
    const { getByText } = render(<Timeline />)
    expect(getByText('Imperial College')).toBeInTheDocument()
    expect(getByText('UCL')).toBeInTheDocument()
  })

  it('renders all experience entries', () => {
    const { getByText } = render(<Timeline />)
    expect(getByText('Graphext')).toBeInTheDocument()
    expect(getByText('Toolip')).toBeInTheDocument()
    expect(getByText('Klere')).toBeInTheDocument()
    expect(getByText('OECD')).toBeInTheDocument()
  })

  it('renders the legend', () => {
    const { getByText } = render(<Timeline />)
    expect(getByText('studies')).toBeInTheDocument()
    expect(getByText('experience')).toBeInTheDocument()
  })
})
