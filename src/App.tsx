import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './index.css';
import 'rc-time-picker/assets/index.css';
import './utils/AxiosConfig';
import { Main } from './pages/main/main';
import { ListResult } from './pages/listResults/ListResults';
import { Soon } from './pages/comingSoon/Soon';
import { useGlobalState } from './state';

function App() {

    const [loading, setLoading] = useGlobalState('loading');
    let routes = [
        { path: '/results', component: <ListResult /> },
        { path: '/', component: <Main /> }
    ]

    if (process.env.REACT_APP_SOON) {
        routes = [
            { path: '/', component: <Soon /> }
        ]
    }

    return (
        <BrowserRouter>
            {loading && (
                <div className="loader-wrap">
                    <div className="pin"></div>
                    <div className="pulse"></div>
                </div>
            )}
            <div id="main">

                <Switch>
                    {routes.map(r => {
                        return (
                            <Route key={r.path} path={r.path}>
                                {r.component}
                            </Route>
                        );
                    })}
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
