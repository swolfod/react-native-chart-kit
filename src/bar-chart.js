import React from "react";
import { View } from "react-native";
import { Svg, Rect, G, Text } from "react-native-svg";
import AbstractChart from "./abstract-chart";

const globalBarWidth = 24;

class BarChart extends AbstractChart {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  renderBars = config => {
    const { data, width, height, paddingTop, paddingRight } = config;
    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = globalBarWidth * this.getBarPercentage();
      return (
        <Rect
          key={Math.random()}
          // paddingRight +
          //   (i * (width - paddingRight)) / data.length +
          //   barWidth / 2
          x={this.calcXPos(data.length, config, i)}
          y={
            ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
            paddingTop
          }
          width={barWidth}
          height={(Math.abs(barHeight) / 4) * 3}
          fill="url(#fillShadowGradient)"
        />
      );
    });
  };

  renderBarTops = config => {
    // const { data, width, height, paddingTop, paddingRight } = config;
    const {
      count,
      data,
      height,
      paddingTop,
      paddingRight,
      horizontalLabelRotation = 0,
      width,
      formatYLabel = yLabel => yLabel,
    } = config;
    const {
      yAxisLabel = "",
      yAxisSuffix = "",
      yLabelsOffset = 12,
      chartConfig
    } = this.props;
    const { decimalPlaces = 2, usePercentage, total } = chartConfig;

    const baseHeight = this.calcBaseHeight(data, height);
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = globalBarWidth * this.getBarPercentage();
      let posX = this.calcXPos(data.length, config, i);
      //  paddingRight +
      //       (i * (width - paddingRight)) / data.length +
      //       barWidth / 2;
      let posY = ((baseHeight - barHeight) / 4) * 3 + paddingTop;

      let yLabel;

      if (usePercentage) {
        yLabel = `${yAxisLabel}${formatYLabel(
          (data[i] / total * 100).toFixed(decimalPlaces)
        )}${yAxisSuffix}`;
      } 

      return (
        // <Rect
        //   key={Math.random()}
        //   x={
        //     paddingRight +
        //     (i * (width - paddingRight)) / data.length +
        //     barWidth / 2
        //   }
        //   y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
        //   width={barWidth}
        //   height={2}
        //   fill={this.props.chartConfig.color(0.6)}
        // />

        <Text
          rotation={horizontalLabelRotation}
          origin={`${posX }, ${posY}`}
          key={Math.random()}
          x={posY > 0 ? posX + 24 : posX + 58}
          textAnchor="end"
          y={posY > 0 ? posY - 4 : posY + Math.abs(((baseHeight - barHeight) / 4) * 3)}
          {...this.getPropsForLabels()}
        >
          {yLabel}
        </Text>
      );
    });
  };

  render() {
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      withInnerLines = true,
      count,
    } = this.props;
    const { borderRadius = 0, paddingTop = 16, paddingRight = 64 } = style;
    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation
    };
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {withInnerLines
              ? this.renderHorizontalLines({
                  ...config,
                  count: 4,
                  paddingTop
                })
              : null}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: 3,
                  data: data.datasets[0].data,
                  paddingTop,
                  paddingRight
                })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight,
                  paddingTop,
                  horizontalOffset: globalBarWidth * this.getBarPercentage()
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
          </G>
          <G>
            {this.renderBarTops({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight,
              ...this.props.chartConfig
            })}
          </G>
        </Svg>
      </View>
    );
  }
}

export default BarChart;
