HTMLCanvasElement.prototype.getContext = () => null as any

import { render, screen } from '@testing-library/react'
import Hero from '../sections/Hero'

describe('Hero', () => {
  it('renders the name wordmark', () => {
    render(<Hero />)
    expect(screen.getByText('daniel')).toBeInTheDocument()
    expect(screen.getByText(/Vegara/)).toBeInTheDocument()
  })

  it('renders the role line', () => {
    render(<Hero />)
    expect(screen.getByText(/Data Scientist/i)).toBeInTheDocument()
    expect(screen.getByText(/OECD, Paris/i)).toBeInTheDocument()
  })

  it('renders the tagline without OECD mention', () => {
    render(<Hero />)
    const tagline = screen.getByText(/I build data tools for teams working on climate, nature, and policy\./)
    expect(tagline).toBeInTheDocument()
    expect(tagline.textContent).not.toContain('Currently at the OECD')
  })

  it('renders the education line', () => {
    render(<Hero />)
    expect(screen.getByText(/Imperial College/i)).toBeInTheDocument()
    expect(screen.getByText(/UCL/i)).toBeInTheDocument()
  })

  it('renders footer links', () => {
    render(<Hero />)
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('CV')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('renders mobile variant without entrance animations', () => {
    render(<Hero mobile />)
    const name = screen.getByText('daniel')
    expect(name.closest('h1')?.className).not.toContain('animate-hero-in')
  })
})
