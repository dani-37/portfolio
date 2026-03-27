import { render } from '@testing-library/react'
import Card from '../components/Card'

const mockRef = { current: null } as React.RefObject<HTMLDivElement | null>
const mockClipRefs = { current: [null, null, null] } as React.RefObject<(HTMLDivElement | null)[]>

it('renders all five section slots', () => {
  const { getByTestId } = render(
    <Card cardRef={mockRef} clipRefs={mockClipRefs}>
      <div data-testid="s0">hero</div>
      <div data-testid="s-timeline">timeline</div>
      <div data-testid="s1">work</div>
      <div data-testid="s2">projects</div>
      <div data-testid="s3">contact</div>
    </Card>
  )
  expect(getByTestId('s0')).toBeInTheDocument()
  expect(getByTestId('s-timeline')).toBeInTheDocument()
  expect(getByTestId('s1')).toBeInTheDocument()
  expect(getByTestId('s2')).toBeInTheDocument()
  expect(getByTestId('s3')).toBeInTheDocument()
})

it('applies initial clip-path to sections 1–3 wrappers', () => {
  const { getByTestId } = render(
    <Card cardRef={mockRef} clipRefs={mockClipRefs}>
      <div data-testid="s0">hero</div>
      <div data-testid="s-timeline">timeline</div>
      <div data-testid="s1">work</div>
      <div data-testid="s2">projects</div>
      <div data-testid="s3">contact</div>
    </Card>
  )
  const s1Wrapper = getByTestId('s1').parentElement
  expect(s1Wrapper?.style.clipPath).toMatch(/inset\(/)
})
