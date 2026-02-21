import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateAgentModal } from './CreateAgentModal'

const mockAddAgent = vi.fn()
const mockAddToast = vi.fn()

vi.mock('@store/index', () => ({
  useAppStore: () => ({
    addAgent: mockAddAgent,
  }),
}))

vi.mock('./ui/Toast', () => ({
  useToast: () => ({
    addToast: mockAddToast,
  }),
}))

describe('CreateAgentModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when closed', () => {
    render(<CreateAgentModal isOpen={false} onClose={() => {}} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(<CreateAgentModal isOpen={true} onClose={() => {}} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Create New Agent')).toBeInTheDocument()
  })

  it('should have name and description fields', () => {
    render(<CreateAgentModal isOpen={true} onClose={() => {}} />)
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument()
  })

  it('should have optional model field', () => {
    render(<CreateAgentModal isOpen={true} onClose={() => {}} />)
    
    expect(screen.getByLabelText(/Model Override/i)).toBeInTheDocument()
  })

  it('should close on Cancel button click', () => {
    const handleClose = vi.fn()
    render(<CreateAgentModal isOpen={true} onClose={handleClose} />)
    
    fireEvent.click(screen.getByText('Cancel'))
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should show validation error for empty name', async () => {
    render(<CreateAgentModal isOpen={true} onClose={() => {}} />)
    
    fireEvent.click(screen.getByText('Create Agent'))
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })
  })

  it('should show validation error for empty description', async () => {
    render(<CreateAgentModal isOpen={true} onClose={() => {}} />)
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test Agent' } })
    fireEvent.click(screen.getByText('Create Agent'))
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })
  })

  it('should create agent with valid data', async () => {
    const handleClose = vi.fn()
    render(<CreateAgentModal isOpen={true} onClose={handleClose} />)
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Agent' } })
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A new agent' } })
    fireEvent.click(screen.getByText('Create Agent'))
    
    await waitFor(() => {
      expect(mockAddAgent).toHaveBeenCalledTimes(1)
      expect(mockAddToast).toHaveBeenCalledTimes(1)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })

  it('should create agent with model override', async () => {
    const handleClose = vi.fn()
    render(<CreateAgentModal isOpen={true} onClose={handleClose} />)
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Agent' } })
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A new agent' } })
    fireEvent.change(screen.getByLabelText(/Model Override/i), { target: { value: 'gpt-4' } })
    fireEvent.click(screen.getByText('Create Agent'))
    
    await waitFor(() => {
      expect(mockAddAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Agent',
          description: 'A new agent',
          model: 'gpt-4',
        })
      )
    })
  })

  it('should trim whitespace from inputs', async () => {
    render(<CreateAgentModal isOpen={true} onClose={() => {}} />)
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: '  Trimmed Name  ' } })
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: '  Trimmed description  ' } })
    fireEvent.click(screen.getByText('Create Agent'))
    
    await waitFor(() => {
      expect(mockAddAgent).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Trimmed Name',
          description: 'Trimmed description',
        })
      )
    })
  })

  it('should close on Escape key', () => {
    const handleClose = vi.fn()
    render(<CreateAgentModal isOpen={true} onClose={handleClose} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should close on backdrop click', () => {
    const handleClose = vi.fn()
    render(<CreateAgentModal isOpen={true} onClose={handleClose} />)
    
    fireEvent.click(screen.getByRole('dialog'))
    
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should have proper aria attributes', () => {
    render(<CreateAgentModal isOpen={true} onClose={() => {}} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })
})
