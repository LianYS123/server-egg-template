/*
 * @Author: luna
 * @Date: 2020-04-21 14:17:23
 * @Description: 计时组件
 */
import React from 'react';
import { isEqual } from 'lodash';
import { getDuration } from 'common/util';

export default class TimingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.threadHandle = null;
    this.state = {
      time: 0
    };
  }
  componentDidMount() {
    this.initThread();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.startTime, this.props.startTime)) {
      clearInterval(this.threadHandle);
      this.initThread();
    }
  }

  initThread = () => {
    const { startTime, timeFormat } = this.props;
    const getTiming = () => {
      const timeObj = getDuration({
        startTime
      });
      this.setState({
        time: `${timeObj.days} 天 ${timeObj.hours}时 ${timeObj.minutes}分 ${timeObj.seconds}秒`
      });
    };
    getTiming(); // 先运行一次，因为Interval第一次运行是在1s后
    this.threadHandle = setInterval(getTiming, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.threadHandle);
  }

  render() {
    const { time } = this.state;
    return <span>{time}</span>;
  }
}
