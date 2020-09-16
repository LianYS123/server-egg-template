import React from 'react';
import ReactDOM from 'react-dom';
import { Drawer, ConfigProvider } from 'antd';
import { noop } from 'lodash';
import zhCN from 'antd/es/locale/zh_CN';

const div = document.createElement('div');
document.body.appendChild(div);
div.id = 'Drawer';
export function open(config) {
  const {
    content,
    width = '800',
    placement = 'right',
    footer = false,
    onCancel = noop,
    ...restConfig
  } = config;

  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <Drawer
        visible={true}
        placement={placement}
        destroyOnClose={true}
        width={width}
        footer={footer}
        onClose={onCancel}
        {...restConfig}
      >
        {content}
      </Drawer>
    </ConfigProvider>,
    div
  );
}

export function close() {
  const unmountResult = ReactDOM.unmountComponentAtNode(div);
}

export default {
  open,
  close
};
