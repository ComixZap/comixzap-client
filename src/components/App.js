import React, { Component } from 'react';
import { basename, dirname } from 'path';
import { createBrowserHistory, createHashHistory } from 'history';
import c from 'classnames';
import Overlay from './Overlay';
import Toolbar from './Toolbar';
import Browser from './Browser';
import PageList from './PageList';
import Viewer from './Viewer';
import { encodePath, decodePath } from '../utils';

const supportsHistory = window.history && 'pushState' in window.history;
const history = supportsHistory ? createBrowserHistory() : createHashHistory();

export default class App extends Component {
  state = { pages: false, files: true, config: {}, activePages: [] };

  componentDidMount () {
    this.checkConfig();

    history.listen(({location, action}) => {
      if (action === "POP") {
        this.checkRoute();
      }
    });
  }

  async checkConfig () {
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
      this.checkRoot(this.state.config.root);
    } catch (err) {
      this.setState({ overlay: 'set-root', error: 'Please enter a server URL' });
    }
  }

  async checkRoot (root) {
    try {
      this.setState({ overlay: 'loading' });
      const response = await fetch(root, { method: 'HEAD' });
      if (response.statusCode > 299) {
        throw new Error('Could not get file list');
      }
      this.setState({ overlay: null });
      this.browser.load();
      this.checkRoute();
    } catch (err) {
      console.error(err);
      this.setState({ overlay: 'set-root', error: 'Could not get file list, please re-enter root' });
    }
  }

  async checkRoute () {
    const [ filepath, page ] = window.location.pathname.split('::');
    if (filepath !== '/') {
      const base = decodePath(basename(filepath));
      const dir = decodePath(dirname(filepath));
      this.pageList.load(dir, { filename: base }, +page || 0);
      this.browser.setCurrent(dir, base);
      this.setState({ drillDown: true });
    }
  }

  async checkConfigStorage () {
    try {
      const storageStr = localStorage.getItem('comixzap-config');
      if (!storageStr) {
        return;
      }
      const config = JSON.parse(storageStr);
      return config;
    } catch (err) {
      console.warn(err);
    }
  }

  async checkConfigJson () {
    this.setState({ overlay: 'loading' });
    const response = await fetch('/config.json');
    const config = await response.json();
    this.setState({ overlay: null });
    return config;
  }

  onFolderClick = (path, filename) => {
    this.setState({ drillDown: false });
    if (this.pageList.pageCount() == 0) {
      // not sure why we get double slash on root.
      // hacking this for now
      if (path == "/") {
        path = "";
      }
      this.browser.setCurrent(path, filename);
    }
  }

  onFileClick = (path, file) => {
    this.setState({ drillDown: false });
    this.pageList.load(path, file);
    this.browser.setCurrent(path, file.filename);
  }

  onPageClick = (path, file, page, index, suppressScroll) => {
    this.viewer.load(path, file, page);
    this.setState({ index });
    const newPath = encodePath(path + '/' + file.filename) + '::' + (index || 0);
    if (newPath !== window.location.pathname) {
      history.push(newPath);
    }
    if (!suppressScroll) {
      this.pageList.scroll(index);
    }
    document.title = `ComixZap Viewer - ${file.filename} Page ${index+1}`;
  }

  onPageLoad = (activePages) => {
    this.setState({ activePages });
    if (!this.state.pages) {
      this.setState({ pages: true });
    }
    if (this.state.files) {
      this.setState({ files: false });
    }
  }

  onToolbarClick = (action) => {
    if (action === 'hide-files') {
      this.setState({ files: !this.state.files, pages: false });
    }
    if (action === 'hide-pages') {
      this.setState({ pages: !this.state.pages, files: false });
    }
    if (action === 'page-prev') {
      this.pageList.prevPage();
    }
    if (action === 'page-next') {
      this.pageList.nextPage();
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
      localStorage.setItem('comixzap-config', JSON.stringify(newconfig));

      this.checkRoot(payload.root);
    }

    this.setState({ overlay: null });
  }

  onCancelOverlay = () => {
    this.setState({ overlay: null });
  }

  render() {
    const { pages, files, config, overlay, error, activePages, index, drillDown } = this.state;

    return (
      <div className="app">
        <Overlay ref={r => this.overlay = r} type={overlay} config={config} message={error} onSubmit={this.onOverlaySubmit} onCancel={this.onCancelOverlay} />
        <Toolbar config={config} onClick={this.onToolbarClick} ref={r => this.toolbar = r} activePages={activePages} index={index} />
        <div className={c("app-body", { pages, files })}>
          <Browser config={config} ref={r => this.browser = r} onFileClick={this.onFileClick} onFolderClick={this.onFolderClick} drillDown={drillDown} />
          <PageList config={config} ref={r => this.pageList = r} onPageClick={this.onPageClick} onLoad={this.onPageLoad} />
          <Viewer config={config} ref={r => this.viewer = r} />
        </div>
      </div>
    );
  }
};
