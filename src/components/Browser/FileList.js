import React, { Component } from 'react';

const ROOT = 'http://cz-api.csli.me/files';

export default class FileList extends Component {
  state = { files: [], loading: false };
  componentDidMount () {
    if (this.props.autoload) {
      this.load();
    }
  }

  async load () {
    const path = this.props.path;
    this.setState({ loading: true });
    try {
      const response = await fetch(ROOT + path);
      const files = await response.json();

      this.setState({ files, loading: false });
    } catch (err) {
      this.setState({loading: false, error: err });
    }
  }

  onClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    console.log(this.props.onClick);
    this.load();
  }


  render () {
    const { path, children } = this.props;
    const { loading, files } = this.state;
    return (
      <div className="file-list">
        {loading && <h2>Loading ...</h2>}
        {children}
        {
          files.map(file => (
            file.directory ? (
              <div key={file.ino} className="folder">
                <FileList path={ path + '/' + file.filename} onClick={this.props.onClick}>
                  <span onClick={this.onClick}>
                    <i className="icon">{"📁"}</i>
                    {file.filename}
                  </span>
                </FileList>
              </div>
            ) : (
              <div className="file">
                <i className="icon">{"📙"}</i>
                <span>{file.filename}</span>
              </div>
            )
          ))
        }
      </div>
    )
  }
}