import React, {Component} from 'react';
import Register from "./Register";
import Login from "./Login"
import { Route, Switch } from "react-router-dom";

class Main extends Component {
    render() {
        return (
            <div className="main">
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                </Switch>

            </div>
        );
    }
}

export default Main;