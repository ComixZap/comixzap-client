import React, { Component } from 'react';
import { join as joinPath } from 'path';
import c from 'classnames';
import sortBy from 'lodash/sortBy';
import { encodePath } from '../../utils';

export default class PageList extends Component {
  state = { pages: [] };

  async load (path, file) {
    this.setState({ path, file });
    try {
      this.setState({ loading: true, error: null });
      const response = await fetch(`${this.props.config.root}/${encodePath(joinPath(path, file.filename))}?action=list`);
      const pagesList = await response.json();
      const pages = sortBy(pagesList.filter(page => page.usize), p => p.filename.toLowerCase());
      this.setState({ loading: false, pages: pages, currentPage: 1 });
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
    this.props.onPageClick(path, file, page);
  }

  render () {
    const { file, error, loading, pages, currentPage } = this.state;
    return (
      <div className="page-list">
        {file && <h2>{file.filename}</h2> }
        { error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {loading && <h3>Loading ...</h3>}
        {!pages.length ? null : (
          <ol>
            {pages.map((page, index) => (
              <li className={c("page", { highlighted: (index + 1) === currentPage })} onClick={this.curryOnPageClick(page.filename)} key={page.filename}>
                {page.filename}
              </li>
            ))}
          </ol>
        )}
      </div>
    )
  }
}