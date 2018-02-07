import React, { Component } from 'react';
import { join as joinPath } from 'path';
import { encodePath } from '../../utils';

const ROOT = 'http://cz-api.csli.me/files';

export default class PageList extends Component {
  state = { pages: [] };

  async load (path, file) {
    this.setState({ path, file });
    try {
      this.setState({ loading: true, error: null });
      const response = await fetch(`${ROOT}/${encodePath(joinPath(path, file.filename))}?action=list`);
      const pagesList = await response.json();
      const pages = pagesList.filter(page => page.usize).sort((a, b) => {
        const aname = a.filename.toLowerCase();
        const bname = b.filename.toLowerCase();
        return aname > bname ? 1 : aname < bname ? -1 : 0;
      });
      this.setState({ loading: false, pages: pages });
      this.props.onLoad();
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
        {file && <h2>{file.filename}</h2> }
        { error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {loading && <h3>Loading ...</h3>}
        {!pages.length ? null : (
          <ol>
            {pages.map(page => (
              <li className="page" onClick={this.curryOnPageClick(page.filename)} key={page.filename}>
                {page.filename}
              </li>
            ))}
          </ol>
        )}
      </div>
    )
  }
}