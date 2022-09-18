import { useCallback, useEffect } from 'react'
import { useCountdown } from '../hooks/useCountdown'

interface CountdownProps {
  remainingTimeInSeconds?: number
}

export function Countdown({ remainingTimeInSeconds }: CountdownProps) {
  const { start, secondsLeft } = useCountdown({
    onCountdownFinish: useCallback(() => {
      console.log('Finalizou')
    }, []),
  })

  useEffect(() => {
    if (remainingTimeInSeconds) {
      start(new Date(), remainingTimeInSeconds)
    }
  }, [start, remainingTimeInSeconds])

  const minutes = secondsLeft ? Math.floor(secondsLeft / 60) : 0
  const seconds = secondsLeft ? secondsLeft % 60 : 0

  return (
    <span className="font-bold py-1 px-2 ml-1 bg-violet-500 text-white">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  )
}
