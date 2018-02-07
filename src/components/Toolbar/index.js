import React, { Component } from 'react';

export default class Toolbar extends Component {
  curryOnClick = (action) => (event) => {
    this.props.onClick(action);
  }

  render () {
    return (
      <div className="toolbar">
        <div className="toolbar-browse">
          <button onClick={this.curryOnClick('hide-files')} className="btn btn-primary">Hide Files</button>
          <button onClick={this.curryOnClick('hide-pages')} className="btn btn-primary">Hide Pages</button>
        </div>
        <div className="toolbar-files"></div>
        <div className="toolbar-main"></div>
      </div>
    )
  }
}