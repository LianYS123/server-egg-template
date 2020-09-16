import React from 'react';
import { Progress } from 'antd';

export default class ExecuteResult extends React.Component {
  constructor(props) {
    super(props);
    this.threadHandle = null;
    this.state = {
      percent: props.percent || 0
    };
  }
  componentDidMount() {
    if (this.props.getData) {
      this.initThread();
    }
  }

  initThread = () => {
    const { record } = this.props;
    const getLog = () => this.props.getData(record, this);
    // setTimeout(getLog, 100); //componentDidMount函数给编辑器立即复制，样式会乱
    this.threadHandle = setInterval(getLog, 5000);
  };

  componentWillUnmount() {
    clearInterval(this.threadHandle);
  }

  render() {
    const { text = '', ...restProps } = this.props;
    const { percent } = this.state;

    return (
      <div className='progress'>
        <div className='progress-text'>
          {text} {percent !== 100 && `${percent} %`}
        </div>
        <Progress percent={percent} status='active' {...restProps} />
      </div>
    );
  }
}
