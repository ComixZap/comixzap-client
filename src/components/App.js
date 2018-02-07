import React, { Component } from 'react';
import Toolbar from './Toolbar';
import Browser from './Browser';
import PageList from './PageList';
import Viewer from './Viewer';

export default class App extends Component {
  onFileClick = (path, file) => {
    console.log(path, file);
    this.pagelist.load(path, file);
  }

  onPageClick = (path, file, page) => {
    console.log(path, file, page);
    this.viewer.load(path, file, page);
  }

  render() {
    return (
      <div className="app">
        <Toolbar ref={r => this.toolbar = r} />
        <div className="app-body">
          <Browser ref={r => this.toolbar = r} onFileClick={this.onFileClick} />
          <PageList ref={r => this.pagelist = r} onPageClick={this.onPageClick} />
          <Viewer ref={r => this.viewer = r} />
        </div>
      </div>
    );
  }
};