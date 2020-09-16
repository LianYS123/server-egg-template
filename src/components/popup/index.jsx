import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, ConfigProvider } from 'antd';
import { noop } from 'lodash';
import zhCN from 'antd/es/locale/zh_CN';

const div = document.createElement('div');
document.body.appendChild(div);
div.id = 'modal1';
export function open(config) {
  const {
    content,
    onOk = noop,
    footer = false,
    maskClosable = false,
    ...restConfig
  } = config;
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <Modal
        visible={true}
        footer={footer}
        onOk={onOk}
        maskClosable={maskClosable}
        {...restConfig}
      >
        {content}
      </Modal>
    </ConfigProvider>,
    div
  );
}

export function close() {
  const unmountResult = ReactDOM.unmountComponentAtNode(div);
  // if (unmountResult && div.parentNode) {
  // 	div.parentNode.removeChild(div);
  // }
  // props.onCancel.apply(props, arguments);
}

export default {
  open,
  close
};
