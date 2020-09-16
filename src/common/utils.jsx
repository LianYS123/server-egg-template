import React from 'react';
import { Tooltip, Col, Breadcrumb } from 'antd';
import Icon from '@ant-design/icons';
import { Link } from 'react-router';
import { arrayFind } from './util';

/**
 *
 * @param label
 * @param title
 * @returns {XML}
 */
export const tpsLabel = (label, title) => {
  if (title) {
    return (
      <span>
        {label}
        <Tooltip title={title}>
          <Icon type='question-circle-o' />
        </Tooltip>
      </span>
    );
  }
  return <span>{label}</span>;
};

/**
 *
 * @param fields
 */
export const renderFormDetail = (fields, span = 8, options = {}) => {
  const { valueStyle = {}, labelSpan = null } = options;
  return fields.map(node => {
    if (!node.hide) {
      let sizeSetting = {};
      let width; // 有特殊设置宽度时，根据特殊设置的span自动计算label和value的宽度
      if (node.sizeSetting) {
        sizeSetting = node.sizeSetting;
        width = sizeSetting.span ? (span / sizeSetting.span) * 30 : null;
      } else if (span > 12) {
        sizeSetting = {
          span
        };
      } else {
        sizeSetting = {
          xl: span,
          sm: 24,
          md: 12
        };
      }
      const label = (
        <span
          className='panel-label'
          style={width ? { width: `${width}%` } : {}}
        >
          {node.label}：
        </span>
      );

      const value = node.onClick ? (
        <a
          className='panel-value'
          style={{ color: '#0072ff', ...valueStyle }}
          onClick={node.onClick}
        >
          {node.value}
          {node.extra}
        </a>
      ) : (
        <span
          className='panel-value'
          style={
            width ? { width: `${100 - width}%`, ...valueStyle } : valueStyle
          }
        >
          {node.value}
          {node.extra}
        </span>
      );

      return (
        <Col {...sizeSetting}>
          {labelSpan ? <Col span={labelSpan}>{label}</Col> : label}
          {labelSpan ? <Col span={24 - labelSpan}>{value}</Col> : value}
        </Col>
      );
    }
  });
};

/**
 *
 * @param title
 * @param link
 * @returns {XML}
 */
export const getBreadcrumb = (title, link) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        {link ? (
          <Link to={link}>
            <Icon type='left' />
          </Link>
        ) : (
          <a onClick={() => history.back()}>
            <Icon type='left' />
          </a>
        )}
      </Breadcrumb.Item>
      {/*<Breadcrumb.Item>{title}</Breadcrumb.Item>*/}
    </Breadcrumb>
  );
};

/**
 *
 * @param title
 * @returns {XML}
 */
export const geTabsTitle = title => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <h3 className='detail-title detail-title-tab'>{title}</h3>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export const getPermissonBtn = (permissions = [], btn) => {
  return arrayFind(permissions, btn);
};

export const renderTab = (num, title, color = 'red') => {
  if (num > 0) {
    return (
      <span>
        {title}
        <span className={`spanCircle ${color}`}>{num}</span>
      </span>
    );
  }
  return title;
};
