import React, { Component } from 'react';
import { join as joinPath, extname } from 'path';
import c from 'classnames';
import sortBy from 'lodash/sortBy';
import { encodePath } from '../../utils';

const EXTENSION_WHITELIST = ['.jpeg', '.jpg', '.png', '.tif', '.tiff', '.tga', '.bmp', '.gif'];

export default class PageList extends Component {
  root = React.createRef();
  state = { pages: [] };

  async load (path, file, index = 0) {
    try {
      let pages = this.state.pages;
      if (this.state.path !== path || this.state.file.filename !== file.filename) {
        this.props.onLoad([]);
        this.setState({ loading: true, pages: [], error: null });
        this.root.current.scrollTop = 0;
        const response = await fetch(`${this.props.config.root}${encodePath(joinPath(path, file.filename))}?action=contents`);
        const pagesList = await response.json();
        const pagesFiltered = pagesList.files.filter(page => (page.usize && !page.filename.match(/^__MACOSX/) && EXTENSION_WHITELIST.includes(extname(page.filename.toLowerCase()))));
        pages = sortBy(pagesFiltered, p => p.filename.toLowerCase());
        this.setState({ loading: false, path, file, pages });
        this.props.onLoad(pages);
      }
      if (pages.length) {
        this.setState({currentPage: index + 1 });
        this.props.onPageClick(path, file, pages[index].filename, index);
      }
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  pageCount() {
    if (!this.state.pages) {
      return 0;
    }
    return this.state.pages.length;
  }

  curryOnPageClick = (index, page) => (event) => {
    this.setState({ currentPage: index + 1 });
    this.onPageClick(page, index);
  }

  onPageClick = (page, index) => {
    const { path, file } = this.state;
    this.props.onPageClick(path, file, page, index, true);
  }

  scroll (index) {
    const root = this.root.current;
    const page = root.querySelectorAll(".page")[index];
    if (page) {
      const rootPos = root.getBoundingClientRect();
      const rootChildPos = root.childNodes[0].getBoundingClientRect();
      const pagePos = page.getBoundingClientRect();

      const offsetTop = pagePos.top - rootChildPos.top - rootPos.top;

      this.root.current.scrollTop = offsetTop;
    }
  }

  nextPage () {
    const { path, file, pages } = this.state;
    const nextPage = this.state.currentPage + 1;
    if (nextPage > pages.length) {
      return;
    }
    const page = pages[nextPage - 1].filename;
    this.setState({ currentPage: nextPage });
    this.props.onPageClick(path, file, page, nextPage - 1);
  }

  prevPage () {
    const { path, file, pages } = this.state;
    const nextPage = this.state.currentPage - 1;
    if (nextPage < 1) {
      return;
    }
    const page = pages[nextPage - 1].filename;
    this.setState({ currentPage: nextPage });
    this.props.onPageClick(path, file, page, nextPage - 1);
  }

  render () {
    const { file, error, loading, pages, currentPage } = this.state;
    return (
      <div ref={this.root} className="page-list">
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
