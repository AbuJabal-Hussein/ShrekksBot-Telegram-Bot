import React, {Component, MouseEventHandler} from 'react';
import '../../App.css';
import {Admin, Page} from '../../types';



export interface MainHeaderProps {
    page: Page; // we need this to highlight the current page in the header
    admin: Admin;
    changePage: React.Dispatch<React.SetStateAction<Page>>;
    updateAdmins: () => void;
    updateAdminPolls: (username: string) => void;
    updateAllPolls: (username: string) => void;
}


export const MainHeader: React.FC<MainHeaderProps> = ({
    page,
    admin,
    changePage,
    updateAdmins,
    updateAdminPolls,
    updateAllPolls
}) => {


    const handle_navigation = (nextPage: Page) => {
        if(page === undefined){
            return;
        }
        switch (nextPage.id){
            case "AdministrationPage": updateAdmins(); break;
            case "PollsPage": updateAllPolls(admin.username); break;
        }

        changePage(nextPage);
    }
    return (
        <>
            <div className={"header-buttons"}>
                Hello <span color={"blue"}>{admin.username}! </span> &emsp;&emsp;
                <button className={"header-button"} onClick={((e) => handle_navigation({id: "PollsPage"}))}>Polls</button>
                <button className={"header-button"} onClick={((e) => handle_navigation({id: "AdministrationPage"}))}>Administration</button>
                <button className={"header-button"} onClick={((e) => handle_navigation({id: "ProfilePage"}))}>Profile</button>
            </div>
        </>
    );

};
