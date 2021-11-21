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
      if (this.props.drillDown) {
        const { selected, path } = this.props;
        const selectedChild = this.getSelectedChild(path, selected);
        const file = this.files[selectedChild];
        if (file) {
          file.load();
        }
      }
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
    this.onFolderClick(this.props.path, filename);
  }

  curryOnFileClick = (file) => (event) => {
    this.onFileClick(this.props.path, file);
  }

  onFileClick = (path, file) => {
    this.props.onFileClick(path, file);
  }

  onFolderClick = (path, file) => {
    this.props.onFolderClick(path, file);
  }

  getSelectedChild (path, selected) {
    if (!selected) {
      return null;
    }
    const selectedParts = selected.replace(/^\//, '').split("/");
    if (path == '' || path == '/') {
      return  selectedParts[0];
    }
    const pathParts = path.replace(/^\//, '').split("/");
    for (let i = 0 ; i < pathParts.length ; i++) {
      if (pathParts[i] != selectedParts[i]) {
        return null;
      }
    }
    return selectedParts[pathParts.length];
  }

  render () {
    const { path, children, selected } = this.props;
    const { loading, files } = this.state;
    const selectedChild = this.getSelectedChild(path, selected);
    return (
      <div className="file-list">
        {loading && <div>Loading ...</div>}
        {children}
        {
          files.map(file => (
            file.directory ? (
              <div key={file.filename} className="folder">
                <div onClick={this.curryOnFolderClick(file.filename)} className={c("folder", selectedChild == file.filename && "highlighted")}>
                  <i className={c('fa', this.state.openFiles[file.filename] ? 'fa-folder-open' : 'fa-folder')}></i>
                  <span className="filename">{file.filename}</span>
                </div>
                <div className={c("folder-contents", { open: this.state.openFiles[file.filename] })}>
                  <FileList selected={this.props.selected} config={this.props.config} onFileClick={this.onFileClick} onFolderClick={this.onFolderClick} open={this.state.openFiles[file.filename]} ref={r => this.files[file.filename] = r} path={joinPath(path, file.filename)} drillDown={this.props.drillDown} />
                </div>
              </div>
            ) : (
              <div key={file.filename} className={c("file", selectedChild == file.filename && "highlighted")}>
                <div onClick={this.curryOnFileClick(file)}>
                  <i className="fa fa-file"></i>
                  <span className="filename">{file.filename}</span>
                </div>
              </div>
            )
          ))
        }
      </div>
    )
  }
}
