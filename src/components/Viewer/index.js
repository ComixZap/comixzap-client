import React, { Component } from 'react';
import { join as joinPath } from 'path';

const ROOT = 'http://cz-api.csli.me/files';

export default class Viewer extends Component {
  state = { zoom: 100 };

  async load (path, file, page) {
    try {
      const image = `${ROOT}${joinPath(path, file.filename)}?action=extract&extract=${page}`;
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = image;
        img.onload = resolve;
        img.onerror = reject;
      });
      this.setState({ image });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  onDoubleClick () {
    this.setState({ zoom: ((this.state.zoom === 100) ? 200 : 100) });
  }

  render () {
    const { image, error, zoom } = this.state;

    return (
      <div className="image-viewer">
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div className="image" onDoubleClick={this.onDoubleClick}>
          {image && <img src={image} width={`${zoom}%`} />}
        </div>
      </div>
    )
  }
}