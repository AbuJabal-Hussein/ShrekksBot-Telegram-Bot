import React from 'react';
import './App.css';
import {AppPageLayout} from "./components/Pages/AppPageLayout";
import {Admin, EmptyAdmin, PageLayout} from "./types";


function App() {
  const [pageLayout, setPageLayout] = React.useState<PageLayout>({id: "SignInPage"});


  return (

      <>
          <div className={"App"}>
              <div className="main-app">
                  <AppPageLayout page={pageLayout} changePageLayout={setPageLayout}/>
              </div>
          </div>

      </>
  );
}

export default App;
