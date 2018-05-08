import React, { Component } from 'react';
import c from 'classnames';

export default class Toolbar extends Component {
  curryOnClick = (action) => (event) => {
    this.props.onClick(action);
  }

  render () {
    const { activePages } = this.props;
    
    return (
      <div className="toolbar">
        <div className="toolbar-browse">
          <button onClick={this.curryOnClick('hide-files')} className="btn btn-primary" title="Hide Files"><i className="fa fa-folder"></i></button>
          <button onClick={this.curryOnClick('hide-pages')} className="btn btn-primary" title="Hide Pages"><i className="fa fa-file"></i></button>
        </div>
        <div className="toolbar-files">
          <button onClick={this.curryOnClick('page-prev')} className={c("btn btn-primary")} disabled={activePages.length <= 0} title="Prev Page"><i className="fa fa-arrow-left"></i></button>
          <button onClick={this.curryOnClick('page-next')} className={c("btn btn-primary")} disabled={activePages.length <= 0} title="Next Page"><i className="fa fa-arrow-right"></i></button>
        </div>
        <div className="toolbar-main">
          <button onClick={this.curryOnClick('settings')} className="btn btn-primary" title="Settings"><i className="fa fa-gear"></i></button>
        </div>
      </div>
    )
  }
}