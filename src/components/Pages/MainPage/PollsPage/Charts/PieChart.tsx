import React, {useLayoutEffect} from 'react';
import './Charts.css';

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {PollResult} from "../../../../../types";

export interface PieChartProps {
    poll: PollResult;
}


export const PieChart: React.FC<PieChartProps> = ({
    poll
}) => {

    useLayoutEffect(() => {

        let root = am5.Root.new("PieChartDiv" + poll.pollID);

        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        let chart = root.container.children.push(
            am5percent.PieChart.new(root, {})
        );


        // Create series
        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                name: poll.title,
                valueField: "votesCount",
                categoryField: "option"
            })
        );
        series.data.setAll(poll.data);

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50),
            y: am5.percent(3),
            layout: root.horizontalLayout,
        }));

        legend.data.setAll(series.dataItems);
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
            <div id={"PieChartDiv" + poll.pollID} className={"some-chart"}/>
        </>
    );

};