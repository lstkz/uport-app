import React from 'react';
import {Switch, Route} from 'react-router';
import AppContainer from './containers/AppContainer';
import HomePage from './containers/HomePage';
import SubmitPage from './containers/SubmitPage';

export default () => (
  <AppContainer>
    <Switch>
      <Route path="/submit" component={SubmitPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </AppContainer>
);
