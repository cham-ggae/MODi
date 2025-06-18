import { motion as originalMotion } from 'framer-motion'

declare module 'framer-motion' {
    export const motion: typeof originalMotion

    export interface Variants {
        [key: string]: any
    }

    export interface Transition {
        [key: string]: any
    }

    export * from 'framer-motion'
}
