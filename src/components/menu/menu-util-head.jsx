/**
 * Created by souakiragen on 2017/6/5.
 */
import React, { Component } from "react";
import { Menu, Dropdown } from "antd";
import classnames from "classnames";
import Icon from '@ant-design/icons';

export default class PermissionMenus extends Component {
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a
            onClick={() => {
              this.props.showAbout();
            }}
          >
            关于
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={() => {
              this.props.changePwd();
            }}
          >
            修改密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            style={{ borderTop: "1px solid #e2e7ec" }}
            onClick={() => {
              this.props.logout();
            }}
          >
            退出登录
          </a>
        </Menu.Item>
      </Menu>
    );
    const userData = this.props.userData;
    return (
      <div className='app-header'>
        <div
          className={classnames({
            "app-header-left": true
          })}
        >
          <div className='app-header-logo'>
            <img className='logo' height={36} src={this.props.logoUrl} />
          </div>
        </div>

        <div className='app-header-login'>
          <div style={{ position: "absolute", top: 2, right: 150 }}>
            <Icon
              type='bell'
              style={{
                position: "relative",
                left: "23px",
                zIndex: -1,
                color: "#Fff"
              }}
            />
          </div>
          <div className='app-header-btn' onClick={this.props.handlerCollapse}>
            <div
              className={classnames({
                "btn-circle": true,
                "btn-circle-collapsed": this.props.collapsed
              })}
            >
              <i
                style={{ fontSize: 24 }}
                className='iconfont icon-home_shousuo_h_icon'
              />
            </div>
          </div>
          <div className='app-header-avatar'>
            <Dropdown overlay={menu}>
              <a className='ant-dropdown-link'>
                {userData.name} <Icon type='down' />
                <img
                  src='assets/icon/avatar.png'
                  alt=''
                  width='32'
                  style={{ marginLeft: 8 }}
                />
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}
