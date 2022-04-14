import React from 'react';
import '../../App.css';
import {Admin, EmptyAdmin, PageLayout, PollResult} from '../../types';
import {SignInPage} from './SignInPage/SignIn';
import {MainPage} from "./MainPage/MainPage";
import {SERVER_HOST, SERVER_PORT} from "../../configs";


export interface PageLayoutProps {
    page: PageLayout;
    changePageLayout: React.Dispatch<React.SetStateAction<PageLayout>>;
}


export const AppPageLayout: React.FC<PageLayoutProps> = ({
    page,
    changePageLayout
}) => {

    const [currentAdmin, setCurrentAdmin] = React.useState<Admin>(EmptyAdmin);
    const [adminPollsResults, setAdminPollsResults] = React.useState<PollResult[]>([]);
    const [allPollsResults, setAllPollsResults] = React.useState<PollResult[]>([]);


    const requestOptions = (username: string) => ({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache',
        },
        body: JSON.stringify({
            'username': username,
        })
    });

    const retrieveAdminPolls = (username: string) => {
        if (username.length === 0) {
            username = currentAdmin.username;
        }
        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/adminPollsResults', requestOptions(username))
            .then(response => response.json())
            .then(data => {
                setAdminPollsResults(data.pollsResults)
            });
    }

    const retrieveAllPollsResults = (username: string) => {
        if (username.length === 0) {
            username = currentAdmin.username;
        }
        fetch('http://' + SERVER_HOST + ':' + SERVER_PORT +'/getAllPollsResults', requestOptions(username))
            .then(response => response.json())
            .then(data => {
                setAllPollsResults(data.pollsResults);
            });
    }

    if (page === undefined) {
        return null;
    }
    switch (page.id) {
        case "SignInPage":
            return <SignInPage setAdmin={setCurrentAdmin} changePage={changePageLayout}
                               updateAllPolls={retrieveAllPollsResults} updateAdminPolls={retrieveAdminPolls}/>
        case "MainPage":
            return <MainPage admin={currentAdmin} setAdmin={setCurrentAdmin} changePageLayout={changePageLayout}
                             adminPolls={adminPollsResults} updateAdminPolls={retrieveAdminPolls}
                             allPollsResults={allPollsResults} updateAllPollsResults={retrieveAllPollsResults}/>
        default:
            return null;

    }
}
