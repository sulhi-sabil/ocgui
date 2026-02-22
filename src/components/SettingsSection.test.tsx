import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SettingsSection } from './SettingsSection'

describe('SettingsSection', () => {
  it('renders section title', () => {
    render(<SettingsSection />)
    expect(screen.getByRole('heading', { level: 2, name: /^Settings$/i })).toBeInTheDocument()
  })

  it('renders coming soon message', () => {
    render(<SettingsSection />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('renders description about settings', () => {
    render(<SettingsSection />)
    expect(screen.getByText(/configure application preferences/i)).toBeInTheDocument()
  })
})
