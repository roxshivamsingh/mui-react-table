import { useRef, useCallback, useEffect, useMemo } from 'react'

export const useSkipper = () => {
    const shouldSkipRef = useRef<boolean | null>(true)
    const shouldSkip = shouldSkipRef.current

    const skip = useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    useEffect(() => {
        shouldSkipRef.current = true
    })

    const result = useMemo(() => [Boolean(shouldSkip), skip] as const,
        [shouldSkip, skip]
    )

    return result
}
