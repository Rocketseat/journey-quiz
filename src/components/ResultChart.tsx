import colors from 'tailwindcss/colors'

import Chart from 'react-apexcharts'

const options = {
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
          formatter: (val: number) => '180',
        },
      },
    },
  },
  fill: {
    type: 'gradient',
    colors: [colors.purple['500']],
    gradient: {
      shade: 'dark',
      type: 'vertical',
      gradientToColors: [colors.violet['500']],
      stops: [0, 360],
    },
  },
  labels: ['Resultado'],
}

export default function ResultChart() {
  const valueInPercent = (180 * 100) / 360

  return (
    <Chart
      options={{
        plotOptions: options.plotOptions,
        fill: options.fill,
        labels: options.labels,
      }}
      series={[valueInPercent]}
      type="radialBar"
      width="400"
    />
  )
}
