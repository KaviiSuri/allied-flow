import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
export const LineChartExample = () => {
  return (
    <LineChart
      data={{
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            data: [
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
              Math.random() * 100,
            ],
          },
        ],
      }}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisLabel="$"
      yAxisSuffix="k"
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />
  );
};

import React, { useState } from "react";
import { View } from "react-native";

const screenWidth = Dimensions.get("window").width;

// Revenue data for this year and last year (in lakhs)
const dataThisYear = [5, 15, 25, 10, 30, 45, 20, 35, 50, 40, 30, 20];
const dataLastYear = [10, 20, 30, 25, 35, 50, 40, 45, 55, 50, 40, 30];

// Dynamically calculate y-axis max
const maxYValue =
  Math.ceil(Math.max(...dataThisYear, ...dataLastYear) / 20) * 20;

export const ChartComponent = () => {
  const [chartWidth, setChartWidth] = useState(
    Dimensions.get("window").width - 40,
  );

  return (
    <View
      style={{ width: "100%", maxWidth: "100%" }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setChartWidth(width); // Update chart width based on parent size
      }}
    >
      <LineChart
        data={{
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              data: dataThisYear,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue for this year
              strokeWidth: 2,
            },
            {
              data: dataLastYear,
              color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red for last year
              strokeWidth: 2,
            },
          ],
        }}
        width={chartWidth} // Responsive width
        height={chartWidth * 0.25} // Keeps aspect ratio (16:9)
        yAxisSuffix="L"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#ffffff",
          },
        }}
        bezier
        fromZero
        style={{ marginVertical: 10, borderRadius: 8 }}
      />
    </View>
  );
};
