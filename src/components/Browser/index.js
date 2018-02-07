import React, { Component } from 'react';
import FileList from './FileList';

export default class Browser extends Component {

  onFileClick = (path, file) => {
    this.props.onFileClick(path, file);
  }

  render () {
    return (
      <div className="file-browser">
        <FileList onFileClick={this.onFileClick} open path="/" autoload={true} />
      </div>
    )
  }
}