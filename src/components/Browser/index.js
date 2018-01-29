import React, { Component } from 'react';
import FileList from './FileList';

export default class Browser extends Component {

  render () {
    return (
      <div className="file-browser">
        <FileList path="/" autoload={true} />
      </div>
    )
  }
}