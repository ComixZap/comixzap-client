import React, { Component } from 'react';
import c from 'classnames';

export default class Overlay extends Component {
  state = {};

  onSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const values = {};
    for (const element of form.elements) {
      if (!element.name) {
        continue;
      }

      // TODO: handle different input types
      values[element.name] = element.value;
    }

    this.props.onSubmit(this.props.type, values);
  }

  onCancelClick = () => {
    this.props.onCancel();
  }

  renderSetRoot (message) {
    const { config } = this.props;
    return (
      <form onSubmit={this.onSubmit}>
        <h1>{message}</h1>
        <div>
          <label htmlFor="root">Api Root</label>
          <input name="root" value={config.root} className="form-control" placeholder="http://..." />
        </div>
        <input className="btn btn-primary" type="submit" value="Submit" />
        <button className="btn btn-danger" onClick={this.onCancelClick}>Cancel</button>
      </form>
    );
  }

  renderLoading () {
    return (
      <div>
        <h1>Loading ...</h1>
      </div>
    );
  }

  render () {
    const { type, message } = this.props;

    return !type ? null : (
      <div className="overlay">
        <div className={c("modal fade", { show: !!type })} style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content"> 
              <div className="modal-body"> 
                {type === 'loading' && this.renderLoading() }
                {type === 'set-root' && this.renderSetRoot(message)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}