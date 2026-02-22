import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillsSection } from './SkillsSection'

describe('SkillsSection', () => {
  it('renders section title', () => {
    render(<SkillsSection />)
    expect(screen.getByRole('heading', { level: 2, name: /^Skills$/i })).toBeInTheDocument()
  })

  it('renders coming soon message', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('renders description about skills', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/specialized capabilities/i)).toBeInTheDocument()
  })
})
