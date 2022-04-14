
export interface Admin {
    username: string;
    email: string;
    phoneNumber: string;
}

export const EmptyAdmin : Admin = {
    username: "",
    email: "",
    phoneNumber: ""
}

export interface PageLayout {
    id: "SignInPage" | "MainPage";
}

export interface Page {
    id: "PollsPage" | "AdministrationPage" | "ProfilePage";
}

export interface PollResultOption {
    option: string;
    votesCount: number;
}

export interface PollResult {
    pollID: number;
    title: string;
    description: string;
    data: PollResultOption[];
}


export interface PollParticipant {
    pollID: number;
    option: string;
}

export interface NewPoll {
    title: string;
    description: string;
    options: string[];
    participants: PollParticipant[];
}

export interface Poll {
    pollID: number;
    title: string;
    description: string;
    options: string[];
}


export interface ChartType{
    type: "XYChart" | "PieChart";
}
