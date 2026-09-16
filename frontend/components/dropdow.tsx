'use client'

import React from 'react'

/**
 * @author: @emerald-ui
 * @description: Animated Dropdown Component with smooth transitions and click-outside behavior
 * @version: 1.0.0
 * @date: 2026-02-03
 * @license: MIT
 * @website: https://emerald-ui.com
 */
import { useState, useRef, FC, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
function cn(...inputs: any[]) { return twMerge(clsx(inputs)) }

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variant === "outline" ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" :
      variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" :
      variant === "link" ? "text-primary underline-offset-4 hover:underline" :
      "bg-primary text-primary-foreground hover:bg-primary/90",
      size === "sm" ? "h-9 px-3" : size === "lg" ? "h-11 px-8" : size === "icon" ? "h-10 w-10" : "h-10 px-4 py-2",
      className
    )} {...props} />
  )
);
Button.displayName = "Button";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, handler])
}



interface DropdownItem {
  name: string
  link: string
}

interface AnimatedDropdownProps {
  items?: DropdownItem[]
  text?: string
  className?: string
}

const DEMO: DropdownItem[] = [
  { name: 'Documentation', link: '#' },
  { name: 'Components', link: '#' },
  { name: 'Examples', link: '#' },
  { name: 'GitHub', link: '#' },
]

export default function AnimatedDropdown({
  items = DEMO,
  text = 'Select Option',
  className,
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <OnClickOutside onClickOutside={() => setIsOpen(false)}>
      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={cn('group relative inline-block', className)}
      >
        <Button
          variant='outline'
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{text}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <ChevronDown className='h-5 w-5' />
          </motion.div>
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              role='listbox'
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
              className={cn(
                'absolute top-[calc(100%+0.5rem)] left-1/2 z-50 w-fit min-w-full -translate-x-1/2',
                'overflow-hidden rounded-md',
                'bg-slate-100 dark:bg-zinc-900',
                'border-2 border-slate-200 dark:border-zinc-800',
                'shadow-lg'
              )}
            >
              <motion.div
                initial='hidden'
                animate='visible'
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.03,
                    },
                  },
                }}
              >
                {items.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className={cn(
                      'inline-block w-full px-3 py-2 text-sm',
                      'border-b-2 border-slate-200 last:border-b-0 dark:border-zinc-800',
                      'bg-slate-50 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800',
                      'transition-colors duration-150',
                      'text-foreground no-underline'
                    )}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OnClickOutside>
  )
}

interface Props {
  children: ReactNode
  onClickOutside: () => void
  classes?: string
}

const OnClickOutside: FC<Props> = ({ children, onClickOutside, classes }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useClickOutside(wrapperRef, onClickOutside)

  return (
    <div ref={wrapperRef} className={cn(classes)}>
      {children}
    </div>
  )
}
