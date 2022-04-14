import React from 'react';
import {Admin, PageLayout, Page, EmptyAdmin, PollResult} from "../../../types";
import {MainHeader} from "../../Header/MainHeader";
import {MainBody} from "./MainBody";
import {SERVER_HOST, SERVER_PORT} from "../../../configs";


export interface MainPageProps {
    admin: Admin;
    setAdmin: React.Dispatch<React.SetStateAction<Admin>>;
    changePageLayout: React.Dispatch<React.SetStateAction<PageLayout>>; // we need this to allow signing out.
    adminPolls: PollResult[];
    updateAdminPolls: (username: string) => void;
    allPollsResults: PollResult[];
    updateAllPollsResults: (username: string) => void;
}


export const MainPage: React.FC<MainPageProps> = ({
    admin,
    setAdmin,
    changePageLayout,
    adminPolls,
    updateAdminPolls,
    allPollsResults,
    updateAllPollsResults,
}) => {

    const [page, setPage] = React.useState<Page>({id: "PollsPage"});

    const [allAdmins, setAllAdmins] = React.useState<Admin[]>([]);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache',
        },
        body: JSON.stringify({
            'username': admin.username,
        })
    }

    const retrieveAdmins = () => {
        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/allAdmins', requestOptions)
            .then(response => response.json())
            .then(data => {
                setAllAdmins(data.admins);
            });
    }



    const signOutAdmin = () => {
        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/logout', requestOptions)
            .then(response => {
                if(response.status === 200){
                    alert('Signed out successfully!');
                }
                else{
                    alert('Error: failed sign out!');
                }
            } );
        setAdmin(EmptyAdmin);
        changePageLayout({id: "SignInPage"});
    }

    return (
        <>
            <div className={"main-page"}>
                <div className={"main-header"}>
                    <MainHeader updateAdmins={retrieveAdmins} updateAdminPolls={updateAdminPolls} updateAllPolls={updateAllPollsResults} page={page} admin={admin} changePage={setPage}/>
                </div>
                <br/>
                <div className={"main-body"}>
                    <MainBody allAdmins={allAdmins} adminPolls={adminPolls} allPolls={allPollsResults} page={page} admin={admin} changePage={setPage} signOutAdmin={signOutAdmin}/>
                </div>
            </div>
        </>
    );


}


