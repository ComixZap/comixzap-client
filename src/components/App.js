import React, { Component } from 'react';
import c from 'classnames';
import Toolbar from './Toolbar';
import Browser from './Browser';
import PageList from './PageList';
import Viewer from './Viewer';

export default class App extends Component {
  state = { pages: false, files: true };

  onFileClick = (path, file) => {
    this.pagelist.load(path, file);
  }

  onPageClick = (path, file, page) => {
    this.viewer.load(path, file, page);
  }

  onPageLoad = () => {
    if (!this.state.pages) {
      this.setState({ pages: true });
    }
  }

  onToolbarClick = (action) => {
    if (action === 'hide-files') {
      this.setState({ files: !this.state.files });
    }
    if (action === 'hide-pages') {
      this.setState({ pages: !this.state.pages });
    }
  }

  render() {
    const { pages, files } = this.state;
    return (
      <div className="app">
        <Toolbar onClick={this.onToolbarClick} ref={r => this.toolbar = r} />
        <div className={c("app-body", { pages, files })}>
          <Browser ref={r => this.toolbar = r} onFileClick={this.onFileClick} />
          <PageList ref={r => this.pagelist = r} onPageClick={this.onPageClick} onLoad={this.onPageLoad} />
          <Viewer ref={r => this.viewer = r} />
        </div>
      </div>
    );
  }
};