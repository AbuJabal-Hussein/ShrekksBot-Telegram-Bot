import React, {useState} from 'react';
import '../../../App.css';
import {Admin, PageLayout} from "../../../types";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {SERVER_HOST, SERVER_PORT} from "../../../configs";


export interface SignInProps {
    setAdmin: React.Dispatch<React.SetStateAction<Admin>>;
    changePage: React.Dispatch<React.SetStateAction<PageLayout>>;
    updateAllPolls: (username: string) => void;
    updateAdminPolls: (username: string) => void;
}

export const SignInPage: React.FC<SignInProps> = ({
    setAdmin,
    changePage,
    updateAllPolls,
    updateAdminPolls,
}) => {
    const [usernameInput, setUsernameInput] = React.useState<string>('');
    const [passwordInput, setPasswordInput] = React.useState<string>('');

    const handle_username_change =  (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setUsernameInput(String(e.target.value));
    }

    const handle_password_change =  (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPasswordInput(String(e.target.value));
    }


    const sign_in_successful = (data: { admin: React.SetStateAction<Admin>; }) => {
        // successful log-in
        // get the admin details from the server
        setAdmin(data.admin);
        // retrieve admin polls
        updateAllPolls(usernameInput);
        // navigate to polls page
        changePage({id: "MainPage"});
    }

    const sign_in_failed = () => {
        return;
    }

    const handle_sign_in = (e: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        if (usernameInput.length === 0 || passwordInput.length === 0) {
            return;
        }
        // prevent submitting
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
            },
            body: JSON.stringify({
                'username': usernameInput,
                'password': passwordInput
            })
        };

        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.length !== 0) {
                    sign_in_successful(data);
                } else {
                    sign_in_failed();
                }
            });
    }



    const [signInValidated, setSignInValidated] = useState(false);

    const validateSignIn = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setSignInValidated(true);
    };

    return (
        <>
            <div className={'sign-in-page'}>
                <div className='sign-in-frame'>
                    <Form noValidate validated={signInValidated} onSubmit={validateSignIn}>
                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col} controlId="validationSignInUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend1">@</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        aria-describedby="inputGroupPrepend1"
                                        onChange={handle_username_change}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your username.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group className="mb-3" as={Col}  controlId="ValidationSignInPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={handle_password_change} required/>
                                <Form.Control.Feedback type="invalid">
                                    Please enter your password
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Row>
                        <Button variant={"primary"} type={"submit"} onClick={handle_sign_in}>
                            sign in
                        </Button>
                    </Form>
                </div>
            </div>

        </>
    );
}
