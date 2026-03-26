import { render } from '@testing-library/react'
import WipeLine from '../components/WipeLine'

it('renders the line as invisible when no wipe is active', () => {
  const { container } = render(
    <WipeLine sectionProgresses={[0, 0, 0]} sectionLabels={['EXPERIENCE', 'PROJECTS', 'CONTACT']} />
  )
  const line = container.querySelector('[data-testid="wipe-line"]')
  expect(line).toBeInTheDocument()
  expect(line).toHaveStyle({ opacity: '0' })
})

it('renders the active section label during transition', () => {
  const { getByText } = render(
    <WipeLine
      sectionProgresses={[0.5, 0, 0]}
      sectionLabels={['EXPERIENCE', 'PROJECTS', 'CONTACT']}
    />
  )
  expect(getByText('EXPERIENCE')).toBeInTheDocument()
})
