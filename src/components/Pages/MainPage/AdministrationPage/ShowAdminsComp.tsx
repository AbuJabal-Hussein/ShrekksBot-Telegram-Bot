import React from 'react';
import '../../../../App.css';
import './Administration.css';
import {Admin, Page} from "../../../../types";
import {Table} from "react-bootstrap";

export interface ShowAdminsCompProps {
    admin:Admin;
    allAdmins: Admin[];
}

export const ShowAdminsComp: React.FC<ShowAdminsCompProps> = ({
    admin,
    allAdmins,
}) => {


    return (
        <>
            <h2 className={'show-admins-h2'}>Admins:</h2>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                </tr>
                </thead>
                <tbody>
                {
                    allAdmins.map( (admin) => (
                        <tr key={'show-admins-admin' + admin.username}>
                            <td>
                                {admin.username}
                            </td>
                            <td>
                                {admin.email}
                            </td>
                            <td>
                                {admin.phoneNumber}
                            </td>
                        </tr>
                    ))
                }
                </tbody>
                <tfoot/>
            </Table>
        </>
    );
}