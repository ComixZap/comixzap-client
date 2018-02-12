import React, { Component } from 'react';

export default class Toolbar extends Component {
  curryOnClick = (action) => (event) => {
    this.props.onClick(action);
  }

  render () {
    return (
      <div className="toolbar">
        <div className="toolbar-browse">
          <button onClick={this.curryOnClick('hide-files')} className="btn btn-primary" title="Hide Files"><i className="fa fa-folder"></i></button>
          <button onClick={this.curryOnClick('hide-pages')} className="btn btn-primary" title="Hide Pages"><i className="fa fa-file"></i></button>
        </div>
        <div className="toolbar-files">
          <button onClick={this.curryOnClick('page-prev')} className="btn btn-primary" title="Prev Page"><i className="fa fa-arrow-left"></i></button>
          <button onClick={this.curryOnClick('page-next')} className="btn btn-primary" title="Next Page"><i className="fa fa-arrow-right"></i></button>
        </div>
        <div className="toolbar-main">
          <button onClick={this.curryOnClick('settings')} className="btn btn-primary" title="Settings"><i className="fa fa-gear"></i></button>
        </div>
      </div>
    )
  }
}