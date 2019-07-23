import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { DailyLimit } from "../../api/dailyLimitYesterday";
import { Meteor } from "meteor/meteor";
import ReactEcharts from "echarts-for-react";

class DailyLimitChart extends Component {
    constructor(props) {
        super(props);
    }

    renderDailyLimit() {}

    componentDidMount() {}

    getOptions = () => {
        if (this.props.dailyLimit.length === 0) return null;
        const allDailyLimits = this.props.dailyLimit;

        if (allDailyLimits.length < 1) return null;
        const xData = [];
        const valueData = [];

        allDailyLimits.forEach((limit, index) => {
            const { date, preClose, trends } = limit;

            trends.forEach(item => {
                const arr = item.split(",");
                const targetValue = arr[1] * 1 < 1 ? arr[2] * 1 : arr[1] * 1;
                const value =
                    (((targetValue - preClose) / preClose) * 100).toFixed(2) *
                    1;
                valueData.push({
                    value,
                    name: arr[0],
                    itemStyle: {
                        opacity: 0
                    }
                });
            });
            for (let i = 0; i < 241; i++) {
                xData.push((date + "").slice(4));
            }
        });

        return {
            title: { text: "昨日涨停指数", x: "center" },
            tooltip: {
                trigger: "axis",
                confine: true,
                formatter: params => {
                    const {
                        data: { name, value }
                    } = params[0];
                    const color = value > 0 ? "#FF0000" : "#00FF00";
                    return `<span style="color:${color}">时间:${name}<br/>振幅:${value}</span>`;
                }
            },
            grid: {
                left: "40",
                right: "40"
            },
            xAxis: {
                splitLine: {
                    show: false
                },
                boundaryGap: true,
                axisLabel: {
                    interval: index => {
                        if ((index - 120) % 241 === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    aligh: "center"
                },
                data: xData
            },
            yAxis: {
                type: "value",
                min: -10,
                max: 10,
                boundaryGap: false,
                interval: 2,
                splitLine: {
                    show: true,
                    lineStyle: {
                        opacity: 0.3
                    }
                }
            },
            visualMap: {
                show: false,
                pieces: [
                    {
                        lte: -4,
                        color: "#00FF00"
                    },
                    {
                        gt: -4,
                        lte: -2,
                        color: "#008B00"
                    },
                    {
                        gt: -2,
                        lte: 0,
                        color: "#00FF00"
                    },
                    {
                        gt: 0,
                        lte: 2,
                        color: "#ff8629"
                    },
                    {
                        gt: 2,
                        lte: 4,
                        color: "#FF0000"
                    },
                    {
                        gt: 4,
                        color: "#d10592"
                    }
                ]
            },
            series: [
                {
                    name: "数据",
                    type: "line",
                    animation: false,
                    data: valueData
                }
            ]
        };
    };

    render() {
        return this.getOptions() ? (
            <ReactEcharts
                option={this.getOptions()}
                style={{
                    height: "600px",
                    width: `${window.innerWidth - 280}px`
                }}
                className="react_for_echarts"
            />
        ) : (
            <div />
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("dailyLimit");

    return {
        dailyLimit: DailyLimit.find({}, { sort: { date: 1 } }).fetch()
    };
})(DailyLimitChart);
