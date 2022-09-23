import colors from 'tailwindcss/colors'
import { VictoryPie, VictoryLabel } from 'victory'

interface ResultChartProps {
  score: number
}

export default function ResultChart({ score }: ResultChartProps) {
  const valueInPercent = (score * 100) / 200

  return (
    <svg viewBox="0 0 300 300" width={300} height={300}>
      <VictoryPie
        standalone={false}
        width={300}
        height={300}
        data={[
          { x: 1, y: valueInPercent },
          { x: 2, y: 100 - valueInPercent },
        ]}
        innerRadius={80}
        cornerRadius={40}
        padAngle={() => 5}
        style={{
          data: {
            fill: ({ datum }) => {
              const color = datum.y > 30 ? colors.violet[500] : 'red'

              return datum.x === 1 ? color : colors.zinc[800]
            },
          },
        }}
      />
      <VictoryLabel
        textAnchor="middle"
        verticalAnchor="middle"
        x={150}
        y={150}
        text={score}
        style={{ fontSize: 64, fill: colors.zinc[100] }}
      />
    </svg>
  )
}
