import React, { Component } from 'react';

export default class Toolbar extends Component {
  render () {
    return (
      <div className="toolbar">
        <div className="toolbar-browse"></div>
        <div className="toolbar-files"></div>
        <div className="toolbar-main"></div>
      </div>
    )
  }
}