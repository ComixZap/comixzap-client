import React, { Component } from 'react';
import { join as joinPath, extname } from 'path';
import c from 'classnames';
import sortBy from 'lodash/sortBy';
import { encodePath } from '../../utils';

const EXTENSION_WHITELIST = ['.jpeg', '.jpg', '.png', '.tif', '.tiff', '.tga', '.bmp', '.gif'];

export default class PageList extends Component {
  state = { pages: [] };

  async load (path, file) {
    this.setState({ path, file });
    try {
      this.props.onLoad();
      this.setState({ loading: true, pages: [], error: null });
      this.root.scrollTop = 0;
      const response = await fetch(`${this.props.config.root}/${encodePath(joinPath(path, file.filename))}?action=list`);
      const pagesList = await response.json();
      const pagesFiltered = pagesList.filter(page => (page.usize && EXTENSION_WHITELIST.includes(extname(page.filename.toLowerCase()))));
      const pages = sortBy(pagesFiltered, p => p.filename.toLowerCase());
      this.setState({ loading: false, pages, currentPage: 1 });
      if (pages.length) {
        this.props.onPageClick(path, file, pages[0].filename);
      }
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  curryOnPageClick = (index, page) => (event) => {
    this.setState({ currentPage: index + 1 });
    this.onPageClick(page, index);
  }

  onPageClick = (page, index) => {
    const { path, file } = this.state;
    this.props.onPageClick(path, file, page, index);
  }

  nextPage () {
    const { path, file, pages } = this.state;
    const nextPage = this.state.currentPage + 1;
    if (nextPage > pages.length) {
      return;
    }
    const page = pages[nextPage - 1].filename;
    this.setState({ currentPage: nextPage });
    this.props.onPageClick(path, file, page);
  }

  prevPage () {
    const { path, file, pages } = this.state;
    const nextPage = this.state.currentPage - 1;
    if (nextPage < 1) {
      return;
    }
    const page = pages[nextPage - 1].filename;
    this.setState({ currentPage: nextPage });
    this.props.onPageClick(path, file, page);
  }

  render () {
    const { file, error, loading, pages, currentPage } = this.state;
    return (
      <div ref={r => this.root = r} className="page-list">
        {file && <h5>{file.filename}</h5> }
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        {loading && <h6>Loading ...</h6>}
        {!pages.length ? null : (
          <ol>
            {pages.map((page, index) => (
              <li className={c("page", { highlighted: (index + 1) === currentPage })} onClick={this.curryOnPageClick(index, page.filename)} key={page.filename}>
                {page.filename}
              </li>
            ))}
          </ol>
        )}
      </div>
    )
  }
}