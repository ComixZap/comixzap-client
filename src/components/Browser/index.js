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

  setCurrent = (dir, filename) => {
    this.setState({ selected: [dir, filename].join('/') })
  }

  render () {
    return (
      <div className="file-browser">
        <FileList ref={r => this.root = r} selected={this.state.selected} config={this.props.config} onFileClick={this.onFileClick} open path="/" />
      </div>
    )
  }
}