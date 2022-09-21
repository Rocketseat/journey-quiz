import { useCallback, useEffect, useState } from 'react'

let interval: NodeJS.Timer

interface CountdownParams {
  onCountdownFinish?: () => void
}

export function useCountdown({ onCountdownFinish }: CountdownParams) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [secondsToFinish, setSecondsToFinish] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  const start = useCallback((initialDate: Date, secondsToFinish: number) => {
    setStartDate(initialDate)
    setSecondsToFinish(secondsToFinish)
    setSecondsLeft(secondsToFinish)
  }, [])

  useEffect(() => {
    if (startDate && secondsToFinish) {
      interval = setInterval(() => {
        const currentDate = new Date()
        const differenceInSeconds = Math.round(
          (currentDate.getTime() - startDate.getTime()) / 1000,
        )

        setSecondsLeft(secondsToFinish - differenceInSeconds)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [startDate, secondsToFinish])

  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(interval)

      if (onCountdownFinish) {
        onCountdownFinish()
      }
    }
  }, [secondsLeft, onCountdownFinish])

  return { start, secondsLeft }
}
