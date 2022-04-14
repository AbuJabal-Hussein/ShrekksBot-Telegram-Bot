import React from 'react';
import './PollsPage.css';
import {Admin, Poll, PollResult} from "../../../../types";

import {AddPollComp} from "./AddPollComp";
import Accordion from "react-bootstrap/Accordion";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Table} from "react-bootstrap";
import {Chart} from "./Charts/Chart";
import {SERVER_HOST, SERVER_PORT} from "../../../../configs";

export interface PollsPageProps {
    admin: Admin;
    adminPollsResults: PollResult[];
    allPollsResults: PollResult[];
}


export const PollsPage: React.FC<PollsPageProps> = ({
    admin,
    adminPollsResults,
    allPollsResults,
}) => {

    const [displayedPollsResults, setDisplayedPollsResults] = React.useState<PollResult[]>(allPollsResults);

    const [allPolls, setAllPolls] = React.useState<Poll[]>([]);

    const retrieveAllPolls = () => {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
            },
            body: JSON.stringify({
                'username': admin.username,
            })
        };

        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/getAllPolls', requestOptions)
            .then(response => response.json())
            .then(data => {
                setAllPolls(data.polls);
            });
    }

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked){
            setDisplayedPollsResults(adminPollsResults);
        }
        else{
            setDisplayedPollsResults(allPollsResults);
        }
    }

    return (
        <>
            <Accordion className={'add-poll-accordion'}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <div className={'poll-creating-and-controlling-frame'}>
                            🤙new poll
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className={'poll-accordion-body'}>
                            <AddPollComp admin={admin} allPolls={allPolls} updateAllPolls={retrieveAllPolls}/>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>

            <div className='polls-page-frame'>

                <Table bsPrefix={"polls-table"}>
                    <thead/>
                    <tbody>
                    {
                        allPollsResults.map((poll) => (
                            <tr key={"tr-poll-" + poll.pollID}>
                            <td>
                                <Chart key={"chart-poll" + poll.pollID} poll={poll}/>
                            </td>
                            </tr>
                        ))
                    }
                    </tbody>
                    <tfoot/>
                </Table>

            </div>

        </>
    );

};