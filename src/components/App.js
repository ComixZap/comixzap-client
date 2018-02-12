import React, { Component } from 'react';
import c from 'classnames';
import Overlay from './Overlay';
import Toolbar from './Toolbar';
import Browser from './Browser';
import PageList from './PageList';
import Viewer from './Viewer';

export default class App extends Component {
  state = { pages: false, files: true, config: {} };

  componentDidMount () {
    this.checkConfig();
  }

  async checkConfig () {
    console.log(this.state.config)
    try {
      if (this.state.config && this.state.config.root) {
        return this.checkRoot(this.state.config.root);
      }
      let config = await this.checkConfigStorage();
      if (!config) {
        config = await this.checkConfigJson();
      }
      if (!config || !config.root) {
        throw new Error('No API root found');
      }
      this.setState({ config });
    } catch (err) {
      console.log(err);
      this.setState({ overlay: 'set-root', error: 'Please enter a server URL' });
    }

    this.checkRoot(this.state.config.root);
  }

  async checkRoot (root) {
    try {
      const response = await fetch(root);
      const files = await response.json();
      if (!Array.isArray(files)) {
        throw new Error('Could not get file list');
      }
      this.browser.load();
    } catch (err) {
      this.setState({ overlay: 'set-root', error: 'Could not get file list, please re-enter root' });
    }
  }

  async checkConfigStorage () {
    try {
      const storageStr = localStorage.getItem('comixzap-config');
      if (!storageStr) {
        return;
      }
      const config = JSON.parse(storageStr);
      console.log(config);
      return config;
    } catch (err) {
      console.warn(err);
    }
  }

  async checkConfigJson () {
    const response = await fetch('/config.json');
    const config = await response.json();
    return config;
  }

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
    if (action === 'page-prev') {
      this.pagelist.prevPage();
    }
    if (action === 'page-next') {
      this.pagelist.nextPage();
    }
    if (action === 'settings') {
      this.setState({ overlay: 'set-root', error: 'Settings' });
    }
  }

  onOverlaySubmit = (action, payload) => {
    if (action === 'set-root') {
      const newconfig = {
        ...this.state.config,
        root: payload.root
      };
      this.setState({
        config: newconfig
      });
      console.log(this.state.config);
      localStorage.setItem('comixzap-config', JSON.stringify(newconfig));

      this.checkRoot(payload.root);
    }

    this.setState({ overlay: null });
  }

  onCancelOverlay = () => {
    this.setState({ overlay: null });
  }

  render() {
    const { pages, files, config, overlay, error } = this.state;

    return (
      <div className="app">
        <Overlay ref={r => this.overlay = r} type={overlay} message={error} onSubmit={this.onOverlaySubmit} onCancel={this.onCancelOverlay} />
        <Toolbar config={config} onClick={this.onToolbarClick} ref={r => this.toolbar = r} />
        <div className={c("app-body", { pages, files })}>
          <Browser config={config} ref={r => this.browser = r} onFileClick={this.onFileClick} />
          <PageList config={config} ref={r => this.pagelist = r} onPageClick={this.onPageClick} onLoad={this.onPageLoad} />
          <Viewer config={config} ref={r => this.viewer = r} />
        </div>
      </div>
    );
  }
};