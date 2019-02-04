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
      const response = await fetch(`${this.props.config.root}${encodePath(path)}`);
      const filesList = await response.json();
      const filesFiltered = filesList.files.filter(file => file.directory || EXTENSION_WHITELIST.includes(extname(file.filename.toLowerCase())));
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

  toggleOpen (filename) {
    this.setState({
      openFiles: {
        ...this.state.openFiles,
        [filename]: !this.state.openFiles[filename]
      }
    });
  }

  curryOnFolderClick = (filename) => (event) => {
    if (!this.state.openFiles[filename]) {
      this.files[filename].load();
    }
    this.toggleOpen(filename);
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
              <div key={file.filename} className="folder">
                <div onClick={this.curryOnFolderClick(file.filename)}>
                  <i className={c('fa', this.state.openFiles[file.filename] ? 'fa-folder-open' : 'fa-folder')}></i>
                  {file.filename}
                </div>
                <div className={c("folder-contents", { open: this.state.openFiles[file.filename] })}>
                  <FileList config={this.props.config} onFileClick={this.onFileClick} open={this.state.openFiles[file.filename]} ref={r => this.files[file.filename] = r} path={joinPath(path, file.filename)} />
                </div>
              </div>
            ) : (
              <div key={file.filename} className="file">
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
