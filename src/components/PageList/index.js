import React, { Component } from 'react';
import { join as joinPath } from 'path';

const ROOT = 'http://cz-api.csli.me/files';

export default class PageList extends Component {
  state = { pages: [] };

  async load (path, file) {
    this.setState({ path, file });
    try {
      this.setState({ loading: true, error: null });
      const response = await fetch(`${ROOT}/${path}/${file.filename}?action=list`)
      const pages = await response.json();
      this.setState({ loading: false, pages: pages });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  curryOnPageClick = (page) => (event) => {
    this.onPageClick(page);
  }

  onPageClick = (page) => {
    const { path, file } = this.state;
    console.log(page, path, file)
    this.props.onPageClick(path, file, page);
  }

  render () {
    const { path, file, error, loading, pages } = this.state;
    return (
      <div className="page-list">
        {file && <h1>{file.filename}</h1> }
        { error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {loading && <h1>Loading ...</h1>}
        {!pages.length ? null : (
          <ol>
            {pages.map(page => (
              <li onClick={this.curryOnPageClick(page.filename)} key={page.filename}>
                {page.filename}
              </li>
            ))}
          </ol>
        )}
      </div>
    )
  }
}