import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

// Interface for the graph data
export interface GraphData {
  title: string; // Title of the graph
  xData: string[]; // Labels for the X-axis
  yData: number[]; // Values for the Y-axis
  color?: string; // Optional color for the bars
}

const BarChart: React.FC<GraphData> = ({ title, xData, yData, color = "#1E40AF" }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      title: {
        text: title,
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
          color: "#FFFFFF",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        type: "category",
        data: xData,
        axisLabel: {
          rotate: 30,
          color: "#FFFFFF",
        },
      },
      yAxis: {
        type: "value",
        name: "Value",
        nameTextStyle: {
          color: "#FFFFFF",
        },
        axisLabel: {
          color: "#FFFFFF",
        },
        splitLine: {
          lineStyle: {
            type: "dotted",
            color: "#FFFFFF",
          },
        },
      },
      series: [
        {
          data: yData,
          type: "bar",
          itemStyle: {
            color: color,
            shadowColor: color,
            shadowBlur: 20,
            shadowOffsetX: 2,
            shadowOffsetY: 0,
            borderRadius: [10, 10, 0, 0],
          },
          barWidth: "50%",
        },
      ],
    };

    chartInstance.setOption(option);

    const resizeObserver = new ResizeObserver(() => chartInstance.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      chartInstance.dispose();
      resizeObserver.disconnect();
    };
  }, [title, xData, yData, color]);

  return (
    <div
      ref={chartRef}
      style={{ width: "90%", height: "350px" }}
      className="rounded-2xl"
    />
  );
};

export default BarChart;
