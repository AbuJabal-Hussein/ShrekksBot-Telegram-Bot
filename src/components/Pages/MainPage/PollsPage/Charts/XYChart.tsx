import React, {useLayoutEffect} from 'react';
import './Charts.css';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {PollResult} from "../../../../../types";

export interface XYChartProps {
    poll: PollResult;
}


export const XYChart: React.FC<XYChartProps> = ({
    poll
}) => {

    useLayoutEffect(() => {

        let root = am5.Root.new("XYChartDiv" + poll.pollID);

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout,

            })
        );


        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                categoryField: "option"
            })
        );
        xAxis.data.setAll(poll.data);

        // Create series
        let series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: poll.title,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "votesCount",
                categoryXField: "option"
            })
        );
        series.data.setAll(poll.data);
        // Add legend
        // let legend = chart.children.push(am5.Legend.new(root, {
        //     clickTarget: "none"
        // }));
        // legend.data.setAll(chart.series.values);

        // let title = chart.children.push(am5.ti)
        // Add cursor
        // chart.set("cursor", am5xy.XYCursor.new(root, {}));

        return () => {
            root.dispose();
        };
    }, [poll]);

    return (
        <>
            <div className={"chart-title"}>{poll.title}</div>
            <div id={"XYChartDiv" + poll.pollID} className={"some-chart"}/>
        </>
    );

};