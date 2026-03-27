import { render } from '@testing-library/react'
import WipeLine from '../components/WipeLine'

const lineRef = { current: null } as React.RefObject<HTMLDivElement | null>
const labelRef = { current: null } as React.RefObject<HTMLDivElement | null>

it('renders the line element', () => {
  const { container } = render(
    <WipeLine wipeLineRef={lineRef} wipeLabelRef={labelRef} />
  )
  const line = container.querySelector('[data-testid="wipe-line"]')
  expect(line).toBeInTheDocument()
})

it('starts invisible', () => {
  const { container } = render(
    <WipeLine wipeLineRef={lineRef} wipeLabelRef={labelRef} />
  )
  const line = container.querySelector('[data-testid="wipe-line"]')
  expect(line).toHaveStyle({ opacity: '0' })
})
