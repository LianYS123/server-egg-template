/**
 * @Date: 2020-05-08 14:42:06
 * @Description: 扩展面版组件
 * @param {*} title 标题
 * @param {boolean} forceRender 强制渲染
 * @param {string} iconType iconzhong
 * @param {boolean} defaultOpen 默认是否展开
 * @param {object} collapseProps collapse的属性
 * @param {object} panelProps panel的属性
 */

import React from 'react';
import { Collapse } from 'antd';
import styles from './styles.less';
import Icon from '@ant-design/icons';

const { Panel } = Collapse;

export default function extendPanel (props) {
  const { title = '', children = null, forceRender = false, iconType = 'caret-up', defaultOpen = false, collapseProps, panelProps } = props;
  return (
    <div className={styles['extend-panel']}>
      <Collapse
        bordered={false}
        style={{ background: 'none', marginTop: 13 }}
        expandIcon={({ isActive }) => (
          <Icon
            type={iconType}
            style={{ color: '#0072FF' }}
            rotate={isActive ? 180 : 0}
          />
        )}
        defaultActiveKey={defaultOpen ? 'setting' : ''}
        {...collapseProps}
      >
        <Panel
          header={<span style={{ color: '#0072FF' }}>{title}</span>}
          key='setting'
          style={{
            border: 0,
            background: 'none'
          }}
          forceRender={forceRender}
          {...panelProps}
        >
          {children}
        </Panel>
      </Collapse>
    </div>
  );
}
