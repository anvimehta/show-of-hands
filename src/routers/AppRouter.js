import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import LoginPage from '../components/LoginPage';
import WelcomePage from '../components/WelcomePage';
import DashboardPage from '../components/DashboardPage';
import ViewPage from '../components/ViewPage';
import ViewPollPage from '../components/ViewPollPage';
import CreatePage from '../components/CreatePage';
import AnswerPollPage from '../components/AnswerPollPage';
import EditPollPage from '../components/EditPollPage';
import NotFoundPage from '../components/NotFoundPage';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import LoadingPage from '../components/LoadingPage';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <PrivateRoute path="/welcome" component={WelcomePage} exact={true} />
        <PrivateRoute path="/dashboard" component={DashboardPage} exact={true} />
        
        <PrivateRoute path="/polls" component={ViewPage} exact={true} />
        <PrivateRoute path="/add-poll" component={CreatePage} exact={true} />
        <PrivateRoute path="/polls/edit" component={EditPollPage} exact={true} />
        <PrivateRoute path="/polls/:id" component={ViewPollPage} exact={true} />
        <PrivateRoute path="/polls/:id/edit" component={EditPollPage} exact={true} />
        <PrivateRoute path="/polls/:id/answer" component={AnswerPollPage} exact={true} />
        <PrivateRoute path="/loading" component={LoadingPage} exact={true} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
