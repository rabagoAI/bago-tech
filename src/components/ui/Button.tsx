import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            children,
            className = '',
            disabled,
            onClick,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'relative overflow-hidden inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

        const variants = {
            primary:
                'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl focus:ring-primary-500',
            secondary:
                'bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white shadow-lg hover:shadow-xl focus:ring-accent-500',
            outline:
                'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 focus:ring-primary-500',
            ghost:
                'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-base',
            lg: 'px-7 py-3.5 text-lg',
        }

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            const button = e.currentTarget
            const rect = button.getBoundingClientRect()
            const diameter = Math.max(button.clientWidth, button.clientHeight)
            const radius = diameter / 2

            const ripple = document.createElement('span')
            ripple.className = 'ripple-wave'
            ripple.style.width = ripple.style.height = `${diameter}px`
            ripple.style.left = `${e.clientX - rect.left - radius}px`
            ripple.style.top = `${e.clientY - rect.top - radius}px`

            button.querySelector('.ripple-wave')?.remove()
            button.appendChild(ripple)
            setTimeout(() => ripple.remove(), 600)

            onClick?.(e)
        }

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || isLoading}
                onClick={handleClick}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
