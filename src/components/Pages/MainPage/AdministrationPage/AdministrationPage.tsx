import React from 'react';
import '../../../../App.css';
import './Administration.css';
import {Admin, Page} from "../../../../types";
import Accordion from "react-bootstrap/Accordion";
import {SignUpComp} from "./SignUpComp";
import {ShowAdminsComp} from "./ShowAdminsComp";

export interface AdministrationPageProps {
    admin: Admin;
    changePage: React.Dispatch<React.SetStateAction<Page>>;
    allAdmins: Admin[];
}

export const AdministrationPage: React.FC<AdministrationPageProps> = ({
    admin,
    changePage,
    allAdmins,
}) => {


    return (
        <>

            <div className={'administration-page-frame'}>
                <Accordion className={'sign-up-accordion'}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div className={'admin-registration-accordion-header'}>
                                Register new admin
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className={'sign-up-accordion-body'}>
                                <SignUpComp admin={admin}/>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <div className={'show-admins-frame'}>
                    <ShowAdminsComp allAdmins={allAdmins} admin={admin}/>
                </div>
            </div>

        </>
    );

};