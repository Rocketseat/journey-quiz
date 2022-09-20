import colors from 'tailwindcss/colors'

import Chart from 'react-apexcharts'

const options = {
  fill: {
    type: 'gradient',
    colors: [colors.purple['500']],
    gradient: {
      shade: 'dark',
      type: 'vertical',
      gradientToColors: [colors.violet['500']],
      stops: [0, 300],
    },
  },
  labels: ['Resultado'],
}

interface ResultChartProps {
  score: number
}

export default function ResultChart({ score }: ResultChartProps) {
  const valueInPercent = (score * 100) / 300

  return (
    <Chart
      options={{
        plotOptions: {
          radialBar: {
            track: {
              background: colors.zinc['700'],
            },
            hollow: {
              margin: 0,
              size: '70%',
              background: colors.gray['800'],
            },
            dataLabels: {
              name: {
                offsetY: -20,
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'normal',
              },
              value: {
                color: '#fff',
                fontSize: '48px',
                show: true,
                formatter: () => String(score),
              },
            },
          },
        },
        fill: options.fill,
        labels: options.labels,
      }}
      series={[valueInPercent]}
      type="radialBar"
      width="400"
    />
  )
}
