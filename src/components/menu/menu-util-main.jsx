/**
 * Created by souakiragen on 2017/6/5.
 */
import React, { Component } from 'react';
import { arrayFind } from '../../common/util';
import { IndexLink, hashHistory } from 'react-router';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

export default class PermissionMenus extends Component {
  render() {
    const renderTitle = item => {
      if (item.titleFormat) {
        return item.titleFormat();
      } else {
        return (
          <span>
            {item.icon} <span>{item.description}</span>
          </span>
        );
      }
    };
    const renderMenuItem = item => {
      if (item.children) {
        return (
          <SubMenu key={item.key} title={renderTitle(item)}>
            {this.props.inlineCollapsed && (
              <li className='ant-menu-item-fix'>
                {item.sub_icon} <span>{item.description}</span>
              </li>
            )}
            {item.children.map(child => {
              return renderMenuItem(child);
            })}
          </SubMenu>
        );
      } else if (item.icon) {
        return (
          <Menu.Item key={item.key} disabled={item.disabled}>
            <IndexLink to={item.link}>
              {item.icon} <span>{item.description}</span>
            </IndexLink>
          </Menu.Item>
        );
      } else if (item.linkGo) {
        return (
          <Menu.Item key={item.key} disabled={item.disabled}>
            <a href={item.linkGo} target='_blank'>
              <span>{item.description}</span>
            </a>
          </Menu.Item>
        );
      } else {
        return (
          <Menu.Item key={item.key} disabled={item.disabled}>
            <IndexLink to={item.link}>{item.description}</IndexLink>
          </Menu.Item>
        );
      }
    };

    let {
      permissions,
      menuPreRender,
      menuitems,
      dispatch,
      ...restProps
    } = this.props;
    const filterMenuItems = (items = []) => {
      const results = items.filter(item => {
        return (
          item.withPermission || arrayFind(permissions, item.permissionKey)
        );
      });
      for (const result of results) {
        if (result.children) {
          result.children = filterMenuItems(result.children);
        }
      }
      return results;
    };
    menuitems = filterMenuItems(menuitems);

    if (menuPreRender) {
      menuPreRender(menuitems);
    }

    const menus = menuitems.map(item => {
      return renderMenuItem(item);
    });

    return <Menu {...restProps}>{menus}</Menu>;
  }
}
