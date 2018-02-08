import React, { Component } from 'react';
import FileList from './FileList';

export default class Browser extends Component {

  load () {
    this.root.load();
  }

  onFileClick = (path, file) => {
    this.props.onFileClick(path, file);
  }

  render () {
    return (
      <div className="file-browser">
        <FileList ref={r => this.root = r} config={this.props.config} onFileClick={this.onFileClick} open path="/" />
      </div>
    )
  }
}