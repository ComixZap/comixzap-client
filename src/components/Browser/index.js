import React, { Component } from 'react';
import FileList from './FileList';

export default class Browser extends Component {

  state = {};

  load () {
    this.root.load();
  }

  onFileClick = (path, file) => {
    this.props.onFileClick(path, file);
  }

  onFolderClick = (path, filename) => {
    this.props.onFolderClick(path, filename);
  }

  setCurrent = (dir, filename) => {
    const path = [dir, filename].join('/');
    this.setState({ selected: path })
  }

  render () {
    return (
      <div className="file-browser">
        <FileList ref={r => this.root = r} selected={this.state.selected} config={this.props.config} onFolderClick={this.onFolderClick} onFileClick={this.onFileClick} open path="/" drillDown={this.props.drillDown}/>
      </div>
    )
  }
}
