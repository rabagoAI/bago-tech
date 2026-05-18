import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    hover?: boolean
    glass?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, hover = false, glass = false, className = '', ...props }, ref) => {
        const baseStyles = 'rounded-xl p-6 transition-all duration-300'
        const glassStyles = glass
            ? 'glass-effect'
            : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg'
        const hoverStyles = hover ? 'card-hover cursor-pointer' : ''

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'
