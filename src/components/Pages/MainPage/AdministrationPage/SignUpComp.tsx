import React, {useState} from 'react';
import '../../../../App.css';
import {Admin, Page} from "../../../../types";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {SERVER_HOST, SERVER_PORT} from "../../../../configs";

export interface SignUpCompProps {
    admin: Admin;
}

export const SignUpComp: React.FC<SignUpCompProps> = ({
  admin,
}) => {

    const [signUpValidated, setSignUpValidated] = useState(false);

    const [usernameInput, setUsernameInput] = React.useState<string>('');
    const [emailInput, setEmailInput] = React.useState<string>('');
    const [phoneNumberInput, setPhoneNumberInput] = React.useState<string>('');
    const [passwordInput, setPasswordInput] = React.useState<string>('');


    const handle_input_change =  (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        switch (e.target.id){
            case "username": setUsernameInput(e.target.value); return;
            case "email": setEmailInput(e.target.value); return;
            case "phoneNumber": setPhoneNumberInput('05' + e.target.value); return;
            case "password": setPasswordInput(e.target.value); return;
            default: return;
        }
    }


    const validateSignUp = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setSignUpValidated(true);
    };

    const handleAddNewAdmin = (e: React.MouseEvent<HTMLButtonElement>) => {

        if(usernameInput.length === 0 || emailInput.length === 0 || phoneNumberInput.length === 0 || passwordInput.length === 0){
            return;
        }
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
            },
            body: JSON.stringify({
                'username': admin.username,
                'new_admin': {
                    'username': usernameInput,
                    'password': passwordInput,
                    'email': emailInput,
                    'phoneNumber': phoneNumberInput,
                }
            })
        };
        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/signup', requestOptions)
            .then(response => response.status === 200  ? alert('admin registered successfully!') : alert('There was an error registering the new admin!'))
    }



    return (
        <>
            <div className={'sign-up-frame'}>
                <Form noValidate validated={signUpValidated} onSubmit={validateSignUp}>
                    <Row className={"mb-3"}>
                        <Form.Group className={"mb-3"} as={Col}>
                            <Form.Label>Username</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text id={"inputGroupPrepend"}>@</InputGroup.Text>
                                <Form.Control
                                    id={'username'}
                                    type={"text"}
                                    placeholder={"Username"}
                                    aria-describedby={"inputGroupPrepend"}
                                    maxLength={100}
                                    onChange={handle_input_change}
                                    required
                                />
                                <Form.Control.Feedback type={"invalid"}>
                                    Please enter a username.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className={"mb-3"}>
                        <Form.Group className={"mb-3"} as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control id={"email"} type={"email"} maxLength={100} placeholder={"email@example.com"} onChange={handle_input_change} required/>
                            <Form.Control.Feedback type={"invalid"}>
                                Please enter a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className={"mb-3"} as={Col} >
                            <Form.Label>Phone Number</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text id={"inputGroupPrepend"}>05</InputGroup.Text>
                                <Form.Control
                                    id={"phoneNumber"}
                                    type={"text"}
                                    placeholder={"00000000"}
                                    aria-describedby={"inputGroupPrepend"}
                                    minLength={8}
                                    maxLength={8}
                                    onChange={handle_input_change}
                                    required
                                />
                                <Form.Control.Feedback type={"invalid"}>
                                    Please enter a phone number.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row className={"mb-3"}>

                    </Row>
                    <Row className={"mb-3"}>
                        <Form.Group className={"mb-3"} as={Col}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control id={"password"} type={"password"} maxLength={100} placeholder={"Password"} onChange={handle_input_change} required/>
                            <Form.Control.Feedback type={"invalid"}>
                                Please enter a password.
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Row>
                    <Button variant={"primary"} type={"submit"} onClick={handleAddNewAdmin}>
                        Register Admin
                    </Button>
                </Form>
            </div>
        </>
    );
}
