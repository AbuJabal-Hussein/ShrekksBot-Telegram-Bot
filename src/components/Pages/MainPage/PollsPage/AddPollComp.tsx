import React, {useLayoutEffect, useState} from 'react';
import './PollsPage.css';
import {Admin, Page, NewPoll, PollResult, Poll, PollParticipant} from "../../../../types";
import {Alert, Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {ChoosePollAudienceModal} from "./ChoosePollAudienceModal";
import {ShowChosenParticipants} from "./ShowChosenParticipants";
import {SERVER_HOST, SERVER_PORT} from "../../../../configs";
import {wait} from "@testing-library/user-event/dist/utils";


export interface AddPollCompProps {
    admin: Admin;
    allPolls: Poll[];
    updateAllPolls: () => void;
}


export const AddPollComp: React.FC<AddPollCompProps> = ({
    admin,
    allPolls,
    updateAllPolls,
}) => {

    const [PollValidated, setPollValidated] = useState(false);

    const validateAddPoll = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setPollValidated(true);
    };

    const [sliderValue, setSliderValue] = React.useState(2);

    const [pollTitleInput, setPollTitleInput] = React.useState<string>('');
    const [pollDescInput, setPollDescInput] = React.useState<string>('');

    const [showModal, setShowModal] = React.useState<boolean>(false);


    const options = new Array(10);
    for (let id in Array.from({length: 10},)) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        options[id] = React.useState<string>('');
    }

    const [participantsInput, setParticipantsInput] = React.useState<PollParticipant[]>([]);

    const handle_pollTitle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPollTitleInput(e.target.value);
    }

    const handle_pollDesc_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPollDescInput(e.target.value);
    }

    const handle_pollOptions_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        let optionID: number = +(e.target.id.split('option')[1].trim())
        options[optionID][1](e.target.value);
    }

    const optionsAreValid = () => {
        for (let op of options.slice(0, sliderValue)) {
            if (op[0].length === 0) {
                return false;
            }
        }
        //check if the poll options are unique among the same poll
        for(let op1 in options.slice(0, sliderValue)){
            for (let op2 in options.slice(0, sliderValue)) {
                if(op1 !== op2 && options[op1][0] === options[op2][0]){
                    return false;
                }
            }
        }
        return true
    }

    const handleAddNewPoll = (e: React.MouseEvent<HTMLButtonElement>) => {
        // retrieveAllPolls();
        if (pollTitleInput.length === 0 || pollDescInput.length === 0 || !optionsAreValid()) {
            wait(2000).then(() => e.preventDefault());
            return;
        }
        e.preventDefault();

        const new_poll: NewPoll = {
            title: pollTitleInput,
            description: pollDescInput,
            options: options.slice(0, sliderValue).map((op) => op[0]),
            participants: participantsInput,
        };
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
            },
            body: JSON.stringify({
                'username': admin.username,
                'new_poll': new_poll,
            })
        };
        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/poll', requestOptions)
            .then(response => response.status === 200 ? alert('poll added successfully!') : alert('There was an error adding the poll!'))

    }

    const updateModalStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(!showModal) {
            updateAllPolls();
            setShowModal(true);
        }
    }

    return (
        <>
            <Form noValidate validated={PollValidated} onSubmit={validateAddPoll}>
                <Row className={"mb-3"}>
                    <Form.Group className="mb-3" as={Col} controlId={"validationPollTitle"}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type={"text"} maxLength={120} placeholder={"Title"}
                                      onChange={handle_pollTitle_change} required/>
                        <Form.Control.Feedback type={"invalid"}>
                            Please enter a title
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className={"mb-3"}>
                    <Form.Group className={"mb-3"} as={Col} controlId={"validationPollDescription"}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as={"textarea"} rows={3} maxLength={255} placeholder={"Description"}
                                      onChange={handle_pollDesc_change} required/>
                        <Form.Control.Feedback type={"invalid"}>
                            Please enter a description for the poll
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className={"mb-3"}>
                    <Form.Group className={"mb-3"} as={Col} controlId={"validationPollDescription"}>
                        <Form.Label>
                            Poll Participants:&nbsp;&nbsp;
                            <Button variant={"primary"} onClick={updateModalStatus}>choose</Button>
                        </Form.Label>

                        <br/>
                        <ChoosePollAudienceModal admin={admin} polls={allPolls} pollParticipants={participantsInput}
                                                 setPollParticipants={setParticipantsInput} showModal={showModal}
                                                 setShowModal={setShowModal}/>
                        <ShowChosenParticipants polls={allPolls} pollParticipants={participantsInput} setPollParticipants={setParticipantsInput}/>

                    </Form.Group>
                </Row>

                <Row className={"mb-3"}>
                    <Form.Group className={"mb-3"} as={Row}>
                        <Form.Label>Select the number of options:</Form.Label>
                        <Col xs="9">
                            <Form.Range min={2} max={10} onChange={e => setSliderValue(+(e.target.value))}
                                        defaultValue={2}/>
                        </Col>
                        <Col xs="3">
                            <Form.Control value={sliderValue} readOnly={true}/>
                        </Col>
                    </Form.Group>
                </Row>

                <Row className={"mb-3"}>
                    <Form.Label>options:</Form.Label>
                    <Form.Group className="mb-3" as={Col}>
                        {
                            Array.from({length: sliderValue}, (_, i) => i).map(optionID =>
                                <Form.Control key={"option" + optionID} id={"option" + optionID} className="mb-3"
                                              type={"text"} maxLength={100} placeholder={"option " + (optionID + 1)}
                                              onChange={handle_pollOptions_change} required/>
                            )
                        }
                        <Form.Control.Feedback type={"invalid"}>
                            Please enter all {sliderValue} options
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>


                <Row>
                    <Button className={"mb-3"} variant={"success"} type={"submit"} onClick={handleAddNewPoll}>
                        Add
                    </Button>
                    <Button className={"mb-3"} variant={"success"} type={"reset"}>
                        Clear
                    </Button>
                </Row>
            </Form>

        </>
    );

}