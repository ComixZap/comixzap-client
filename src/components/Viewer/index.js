import React, { Component } from 'react';
import { join as joinPath } from 'path';
import c from 'classnames';
import { encodePath } from '../../utils';

const supportsTouch = 'ontouchstart' in window;

const calcDistance = (x1, y1, x2, y2) => Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), .5);

export default class Viewer extends Component {
  state = { zoom: 100 };
  initialDistance = 0;

  async load (path, file, page) {
    this.setState({ loading: true, page });
    try {
      const image = `${this.props.config.root}${encodePath(joinPath(path, file.filename))}?action=extract&extract=${encodePath(page)}`;
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

  onTouchEnd = (e) => {

  }

  onTouchMove = (e) => {
    if (e.touches.length >= 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = calcDistance(touch1.screenX, touch1.screenY, touch2.screenX, touch2.screenY);
      const sizeFactor = distance / this.initialDistance;
      this.setState({ zoom: this.initialZoom * sizeFactor });
    }
  }

  onTouchStart = (e) => {
    if (e.touches.length == 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.initialDistance = calcDistance(touch1.screenX, touch1.screenY, touch2.screenX, touch2.screenY);
      this.initialZoom = this.state.zoom;
    }
  }

  onDoubleClick = () => {
    this.setState({ zoom: this.state.zoom > 100 ? 100 : 200 });
  }


  render () {
    const { image, loading, error, zoom } = this.state;

    return (
      <div ref={r => this.root = r} className={c("image-viewer", { loading })}>
        {error && <div className="error-overlay">{error}</div>}
        <div className="image" onDoubleClick={this.onDoubleClick} onTouchEnd={this.onTouchEnd} onTouchMove={this.onTouchMove} onTouchStart={this.onTouchStart}>
          {image && <img title={this.props.page} alt={this.props.page} src={image} style={{ width: `${zoom}%`}} />}
        </div>
      </div>
    )
  }
}
