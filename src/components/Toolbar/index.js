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
        <div className="toolbar-files">
          <button onClick={this.curryOnClick('page-prev')} className="btn btn-primary">Prev Page</button>
          <button onClick={this.curryOnClick('page-next')} className="btn btn-primary">Next Page</button>
        </div>
        <div className="toolbar-main">
          <button onClick={this.curryOnClick('settings')} className="btn btn-primary">Settings</button>
        </div>
      </div>
    )
  }
}