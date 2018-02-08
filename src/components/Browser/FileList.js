import React, { Component } from 'react';
import { join as joinPath } from 'path';
import { encodePath } from '../../utils';
import c from 'classnames';

export default class FileList extends Component {
  state = { files: [], openFiles: {}, loading: false, open: false };
  files = {};

  async load () {
    const path = this.props.path;
    this.setState({ loading: true, open: true });
    try {
      const response = await fetch(`${this.props.config.root}/${encodePath(path)}`);
      const files = await response.json();

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
                <span onClick={this.curryOnFolderClick(file.ino)}>
                  <i className="icon">{this.state.openFiles[file.ino] ? "📂" : "📁"}</i>
                  {file.filename}
                </span>
                <div className={c("folder-contents", { open: this.state.openFiles[file.ino] })}>
                  <FileList config={this.props.config} onFileClick={this.onFileClick} open={this.state.openFiles[file.ino]} ref={r => this.files[file.ino] = r} path={joinPath(path, file.filename)} />
                </div>
              </div>
            ) : (
              <div key={file.ino} className="file">
                <span onClick={this.curryOnFileClick(file)}>
                  <i className="icon">{"📙"}</i>
                  {file.filename}
                </span>
              </div>
            )
          ))
        }
      </div>
    )
  }
}