import React, {useState} from 'react';
import './Charts.css';
import {ChartType, PollResult} from "../../../../../types";


import 'bootstrap/dist/css/bootstrap.min.css';
import {Form} from "react-bootstrap";
import {XYChart} from "./XYChart";
import {PieChart} from "./PieChart";


export interface ChartProps {
    poll: PollResult;
}


export const Chart: React.FC<ChartProps> = ({
    poll
}) => {

    const [chartType, setChartType] = React.useState<ChartType>({type: "XYChart"});


    const handleChangeChartType =  (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        let val = e.target.value;
        if(["XYChart", "PieChart"].includes(val)){
            // @ts-ignore
            setChartType({type: val});
        }
    }

    return (
        <>
            <div className={'chart-frame'}>
                <Form>
                <Form.Select id={"select-chart-" + poll.pollID} onChange={handleChangeChartType}>
                    <option id={"select-chart-optionXY-" + poll.pollID} value={"XYChart"}>XY Chart</option>
                    <option id={"select-chart-optionPie-" + poll.pollID} value={"PieChart"}>Pie Chart</option>
                </Form.Select>
                </Form>
                <div id={"chart-" + poll.pollID}>
                    {
                        chartType.type === "XYChart" ? <XYChart poll={poll}/> : <PieChart poll={poll}/>
                    }
                </div>
            </div>
        </>
    )
}