import React from 'react';
export default class Text extends React.Component {
  render() {
    return <pre style={{ color: 'white', whiteSpace: this.props.textWrap ? 'pre-wrap' : '' }}>{this.props.data}</pre>;
  }
}
