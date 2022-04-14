import React from 'react';
import '../../../../App.css';
import {Admin, Page} from "../../../../types";
import {stringify} from "querystring";
import {Button} from "react-bootstrap";

export interface ProfilePageProps {
    admin: Admin;
    changePage: React.Dispatch<React.SetStateAction<Page>>;
    signOutAdmin: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
    admin,
    changePage,
    signOutAdmin
}) => {


    return (
        <>
            <div className={"sign-out-button"}>
                <Button variant={'warning'} onClick={signOutAdmin}>Sign Out</Button>
            </div>
            <div className={"profile-frame"}>
                <table className={"profile-table"}>
                    <thead/>
                    <tbody>
                    {
                        Object.entries(admin).map((k) => (
                            <tr key={'show-profile-' + k[0]}>
                                <td>{k[0]} </td>
                                <td>{k[1]}</td>
                            </tr>)
                        )
                    }
                    </tbody>
                    <tfoot/>
                </table>
            </div>

        </>
    );

};