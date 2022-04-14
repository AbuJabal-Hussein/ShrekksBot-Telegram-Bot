import React from 'react';
import {Admin, Page, PollResult} from "../../../types";
import {PollsPage} from "./PollsPage/PollsPage";
import {AdministrationPage} from "./AdministrationPage/AdministrationPage";
import {ProfilePage} from "./ProfilePage/ProfilePage";


export interface MainBodyProps {
    page: Page;
    admin: Admin;
    changePage: React.Dispatch<React.SetStateAction<Page>>;
    signOutAdmin: () => void;
    allAdmins: Admin[];
    adminPolls: PollResult[];
    allPolls: PollResult[];
}


export const MainBody: React.FC<MainBodyProps> = ({
    page,
    admin,
    changePage,
    signOutAdmin,
    allAdmins,
    allPolls,
    adminPolls,
}) => {

    if(page === undefined){
        return null;
    }
    switch(page.id) {
        case "PollsPage":
            return <PollsPage admin={admin} allPollsResults={allPolls} adminPollsResults={adminPolls} />;
        case "AdministrationPage":
            return <AdministrationPage allAdmins={allAdmins} admin={admin} changePage={changePage} />;
        case "ProfilePage":
            return <ProfilePage admin={admin} changePage={changePage}  signOutAdmin={signOutAdmin}/>;
        default:
            return null;

    }
};
