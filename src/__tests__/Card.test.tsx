import { render } from '@testing-library/react'
import Card from '../components/Card'

const mockRef = { current: null } as React.RefObject<HTMLDivElement>

it('renders all four section slots', () => {
  const { getByTestId } = render(
    <Card
      scrollProgress={0}
      cardRef={mockRef}
      cardTopVh={12}
      cardHeightVh={55}
    >
      <div data-testid="s0">hero</div>
      <div data-testid="s1">work</div>
      <div data-testid="s2">projects</div>
      <div data-testid="s3">contact</div>
    </Card>
  )
  expect(getByTestId('s0')).toBeInTheDocument()
  expect(getByTestId('s1')).toBeInTheDocument()
  expect(getByTestId('s2')).toBeInTheDocument()
  expect(getByTestId('s3')).toBeInTheDocument()
})

it('applies a clip-path to sections 1–3 wrappers', () => {
  const { getByTestId } = render(
    <Card
      scrollProgress={0}
      cardRef={mockRef}
      cardTopVh={12}
      cardHeightVh={55}
    >
      <div data-testid="s0">hero</div>
      <div data-testid="s1">work</div>
      <div data-testid="s2">projects</div>
      <div data-testid="s3">contact</div>
    </Card>
  )
  // s1's parent wrapper div should have clipPath set
  const s1Wrapper = getByTestId('s1').parentElement
  expect(s1Wrapper?.style.clipPath).toMatch(/inset\(/)
})
