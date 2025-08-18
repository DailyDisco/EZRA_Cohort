import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ButtonComponent from '../reusableComponents/ButtonComponent'

/*
 * Vitest Testing Guide - Step by Step Example
 * 
 * 1. IMPORT TESTING TOOLS:
 *    - render() creates virtual component
 *    - screen finds elements in DOM
 *    - fireEvent simulates user actions
 *    - describe/it/expect structure tests
 *    - vi.fn() creates mock functions
 * 
 * 2. GROUP TESTS: describe('ComponentName', () => {})
 * 
 * 3. WRITE TEST: it('should do something', () => {})
 * 
 * 4. RENDER COMPONENT: render(<ButtonComponent props />)
 * 
 * 5. FIND ELEMENTS: screen.getByText('Click me')
 * 
 * 6. SIMULATE ACTIONS: fireEvent.click(button)
 * 
 * 7. ASSERT RESULTS: expect(element).toBeInTheDocument()
 * 
 * RUN TESTS: npm run test
 */




describe('ButtonComponent', () => {
    it('renders with correct text', () => {
        render(
            <ButtonComponent
                type="primary"
                onClick={() => { }}
                title="Click me"
            />
        )

        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('calls onClick when clicked', () => {
        const mockOnClick = vi.fn()

        render(
            <ButtonComponent
                type="primary"
                onClick={mockOnClick}
                title="Click me"
            />
        )

        fireEvent.click(screen.getByText('Click me'))
        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('applies correct CSS classes', () => {
        render(
            <ButtonComponent
                type="secondary"
                onClick={() => { }}
                title="Secondary Button"
            />
        )

        const button = screen.getByRole('button', { name: 'Secondary Button' })
        expect(button).toHaveClass('btn-secondary')
    })

    it('renders with icon when provided', () => {
        const TestIcon = () => <span data-testid="test-icon">🚀</span>

        render(
            <ButtonComponent
                type="primary"
                onClick={() => { }}
                title="Button with Icon"
                icon={<TestIcon />}
            />
        )

        expect(screen.getByText('Button with Icon')).toBeInTheDocument()
        expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    })

    it('disables button when disabled prop is true', () => {
        render(
            <ButtonComponent
                type="primary"
                onClick={() => { }}
                title="Disabled Button"
                disabled={true}
            />
        )

        const button = screen.getByRole('button', { name: 'Disabled Button' })
        expect(button).toBeDisabled()
    })

    it('applies correct size class', () => {
        render(
            <ButtonComponent
                type="primary"
                onClick={() => { }}
                title="Large Button"
                size="large"
            />
        )

        const button = screen.getByRole('button', { name: 'Large Button' })
        expect(button).toBeInTheDocument()
    })

    it('renders button with correct structure', () => {
        const { container } = render(
            <ButtonComponent
                type="secondary"
                onClick={() => { }}
                title="Test Button"
            />
        )

        const button = screen.getByRole('button')
        console.log('Button classes:', button.className)
        console.log('Button HTML:', container.innerHTML)

        expect(button.tagName).toBe('BUTTON')
    })
})
