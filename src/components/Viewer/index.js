import React, { Component } from 'react';
import { join as joinPath } from 'path';
import { encodePath } from '../../utils';

export default class Viewer extends Component {
  state = { zoom: 100 };

  async load (path, file, page) {
    this.setState({ loading: true, page });
    try {
      const image = `${this.props.config.root}/${encodePath(joinPath(path, file.filename))}?action=extract&extract=${encodePath(page)}`;
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = resolve;
        img.onerror = reject;
      });
      this.root.scrollTop = 0;
      this.setState({ loading: false, zoom: 100, image });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  }

  onDoubleClick = () => {
    this.setState({ zoom: ((this.state.zoom === 100) ? 200 : 100) });
  }

  render () {
    const { image, loading, error, zoom } = this.state;

    return (
      <div ref={r => this.root = r} className="image-viewer">
        {loading && <div style={{ position: 'absolute' }}>Loading ...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div className="image" onDoubleClick={this.onDoubleClick}>
          {image && <img title={this.props.page} alt={this.props.page} src={image} style={{ width: `${zoom}%`}} />}
        </div>
      </div>
    )
  }
}