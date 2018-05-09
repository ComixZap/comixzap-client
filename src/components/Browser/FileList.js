import React, { Component } from 'react';
import { join as joinPath, extname } from 'path';
import { encodePath } from '../../utils';
import sortBy from 'lodash/sortBy';
import c from 'classnames';

const EXTENSION_WHITELIST = ['.cbz', '.cbr', '.rar', '.zip'];

export default class FileList extends Component {
  state = { files: [], openFiles: {}, loading: false, open: false };
  files = {};

  async load () {
    const path = this.props.path;
    this.setState({ loading: true, open: true });
    try {
      await new Promise(r => setTimeout(r, 5000));
      const response = await fetch(`${this.props.config.root}/files/${encodePath(path)}`);
      const filesList = await response.json();
      const filesFiltered = filesList.filter(file => file.directory || EXTENSION_WHITELIST.includes(extname(file.filename.toLowerCase())));
      const files = sortBy(filesFiltered, (file) => [!file.directory, file.filename.toLowerCase()]);
      this.setState({ files, loading: false });
    } catch (err) {
      this.setState({loading: false, error: err });
    }
  }

  onClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.load();
  }

  toggleOpen (ino) {
    this.setState({
      openFiles: {
        ...this.state.openFiles,
        [ino]: !this.state.openFiles[ino]
      }
    });
  }

  curryOnFolderClick = (ino) => (event) => {
    if (!this.state.openFiles[ino]) {
      this.files[ino].load();
    }
    this.toggleOpen(ino);
  }

  curryOnFileClick = (file) => (event) => {
    this.onFileClick(this.props.path, file);
  }

  onFileClick = (path, file) => {
    this.props.onFileClick(path, file);
  }

  render () {
    const { path, children } = this.props;
    const { loading, files } = this.state;
    return (
      <div className="file-list">
        {loading && <div>Loading ...</div>}
        {children}
        {
          files.map(file => (
            file.directory ? (
              <div key={file.ino} className="folder">
                <div onClick={this.curryOnFolderClick(file.ino)}>
                  <i className={c('fa', this.state.openFiles[file.ino] ? 'fa-folder-open' : 'fa-folder')}></i>
                  {file.filename}
                </div>
                <div className={c("folder-contents", { open: this.state.openFiles[file.ino] })}>
                  <FileList config={this.props.config} onFileClick={this.onFileClick} open={this.state.openFiles[file.ino]} ref={r => this.files[file.ino] = r} path={joinPath(path, file.filename)} />
                </div>
              </div>
            ) : (
              <div key={file.ino} className="file">
                <div onClick={this.curryOnFileClick(file)}>
                  <i className="fa fa-file"></i>
                  {file.filename}
                </div>
              </div>
            )
          ))
        }
      </div>
    )
  }
}