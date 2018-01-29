import React, { Component } from 'react';
import Toolbar from './Toolbar';
import Browser from './Browser';
import PageList from './PageList';
import Viewer from './Viewer';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Toolbar />
        <div className="app-body">
          <Browser />
          <PageList />
          <Viewer />
        </div>
      </div>
    );
  }
};