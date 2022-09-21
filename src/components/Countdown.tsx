import { useEffect } from 'react'
import colors from 'tailwindcss/colors'
import { useCountdown } from '../hooks/useCountdown'

interface CountdownProps {
  id: string
  remainingTimeInSeconds?: number
  onCountdownFinish?: () => void
}

export function getColorBySecondsRemaining(seconds: number) {
  if (seconds > 60) {
    return colors.emerald[500]
  } else if (seconds > 30) {
    return colors.amber[500]
  } else {
    return colors.red[500]
  }
}

export function Countdown({
  id,
  remainingTimeInSeconds,
  onCountdownFinish,
}: CountdownProps) {
  const { start, secondsLeft } = useCountdown({
    onCountdownFinish,
  })

  useEffect(() => {
    if (remainingTimeInSeconds) {
      start(new Date(), remainingTimeInSeconds)
    }
  }, [start, remainingTimeInSeconds, id])

  const minutes = secondsLeft ? Math.floor(secondsLeft / 60) : 0
  const seconds = secondsLeft ? secondsLeft % 60 : 0

  return (
    <span
      className="font-bold py-1 px-2 ml-1 text-white"
      style={{
        backgroundColor: getColorBySecondsRemaining(secondsLeft ?? 0),
      }}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  )
}
