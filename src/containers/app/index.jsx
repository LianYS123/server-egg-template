import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import PermissionMenusHead from 'components/menu/menu-util-head';
import classnames from 'classnames';
import PermissionMenusMain from 'components/menu/menu-util-main';
import Popup from 'components/popup';
import changePassword from './changePassword';
import { menuitems, getCurrentMenu } from './menus';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifDefaultTheme: true,
      collapsed: false,
      openKeys: [],
      lastMenu: '',
      logoUrl: '/assets/logo/logo.png',
      logoUrl_collapsed: '/assets/logo/logo-min.png',
      logoUrl_bottom: '/assets/logo/logo-large.png',
    };
  }
  getDefalutOpenKeys = () => {
    let keys = window.location.hash.split('/')[1];
    this.setState({
      openKeys: [keys],
    });
  };

  componentDidMount() {
    this.getDefalutOpenKeys();
    this.checkLogin();
    document.addEventListener('click', this.checkTokenExpiration);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.checkTokenExpiration);
  }

  changePwd = () => {
    changePassword({
      reload: this.logout,
    });
  };

  showAbout = () => {
    Popup.open({
      title: '版本信息',
      width: 416,
      onCancel: () => {
        Popup.close();
      },
      content: (
        <div className='ant-confirm-body-wrapper'>
          <div className='ant-confirm-body' style={{ paddingBottom: 20 }}>
            <img
              src='assets/icon/about.png'
              alt=''
              width='40'
              style={{ marginRight: 16, float: 'left' }}
            />
            <span className='ant-confirm-title' style={{ lineHeight: '38px' }}>
              {/* eslint-disable-next-line no-undef */}
              当前版本号：V{PACKAGE_VERSION}
            </span>
            <div className='ant-confirm-content'></div>
          </div>
        </div>
      ),
    });
  };

  logout = () => {
    this.props.dispatch({
      type: 'global/logout',
    });
  };

  checkLogin = () => {
    this.props.dispatch({
      type: 'global/checkLogin',
    });
  };

  checkTokenExpiration = () => {
    this.props.dispatch({
      type: 'global/checkTokenExpiration',
    });
  };

  // 展开或收起菜单
  handlerCollapse = () => {
    window.$(window).resize();
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  //当前展开的submenu数组，一次只展开一个
  handlerOpenChange = openKeys => {
    if (openKeys.length > 0) {
      this.setState({
        openKeys: new Array(openKeys[openKeys.length - 1]),
      });
    } else {
      this.setState({
        openKeys: [],
      });
    }
  };

  getOpenKeys = () => {
    return this.state.openKeys;
  };
  getIconStation(key) {
    const openKey = this.getOpenKeys();
    const collapsed = this.state.collapsed;
    if (openKey[0] === key && collapsed === true) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    const current = getCurrentMenu();
    const { userData, login } = this.props.data;
    const permissions = userData ? userData.permissions : [];
    const style = {
      width: this.state.collapsed ? '50px' : '200px',
      minWidth: this.state.collapsed ? '50px' : '200px',
    };
    const openKey = this.getOpenKeys();

    const menuPreRender = (filterMenuItems = []) => {
      if (filterMenuItems && filterMenuItems.length > 0) {
        let path = window.location.hash.match(/#\/(.+)\??/);
        path = path ? path[1] : '';
        if (
          menuitems.some(item => item.link === '/' + path) &&
          !filterMenuItems.some(item => item.link === '/' + path)
        ) {
          window.location.href = '/#' + filterMenuItems[0].link;
        }
      }
    };

    return (
      <div
        className={classnames({
          approot: true,
          themeDefault: this.state.ifDefaultTheme,
          themeDark: !this.state.ifDefaultTheme,
        })}
      >
        <div>
          <PermissionMenusHead
            logoUrl={this.state.logoUrl}
            logoUrl_collapsed={this.state.logoUrl_collapsed}
            mode='inline'
            theme='dark'
            userData={this.props.data.userData}
            dispatch={this.props.dispatch}
            logout={this.logout}
            changePwd={this.changePwd}
            showAbout={this.showAbout}
            collapsed={this.state.collapsed}
            handlerCollapse={this.handlerCollapse}
          />
        </div>
        <div className='app-container'>
          <div
            className={classnames({
              'app-body-nav': true,
              'app-body-nav-collapsed': this.state.collapsed,
              'app-body-nav-uncollapsed': !this.state.collapsed,
            })}
            style={style}
          >
            <PermissionMenusMain
              theme='dark'
              menuitems={menuitems}
              permissions={permissions}
              dispatch={this.props.dispatch}
              mode='inline'
              onOpenChange={this.handlerOpenChange}
              openKeys={openKey}
              selectedKeys={[current]}
              menuPreRender={menuPreRender}
              inlineCollapsed={this.state.collapsed}
            />
            <div className='app-body-nav-btn' onClick={this.handlerCollapse}>
              {!this.state.collapsed && (
                <div className='app-body-nav-uncollapsed'>
                  <img
                    src={this.state.logoUrl_bottom}
                    alt=''
                    height='30'
                    style={{ paddingTop: 7 }}
                  />
                  {/* <i className='iconfont icon-dibuLOG-moren' style={{ fontSize: 24 }} /> */}
                </div>
              )}
              {this.state.collapsed && (
                <div className='app-body-nav-collapsed'>
                  <img
                    src={this.state.logoUrl_collapsed}
                    alt=''
                    height='26'
                    style={{ paddingTop: 11 }}
                  />

                  {/* <i className='iconfont icon-dibuLOGO-shousuo' style={{ fontSize: 24 }} /> */}
                </div>
              )}
            </div>
          </div>
          <div className='app-body-main app-body__project'>
            <div className='app-body-content'>
              {' '}
              {React.Children.map(this.props.children, child =>
                React.cloneElement(child, { permissions, userData })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * transform store data to App props
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function mapStateToProps(store) {
  return {
    data: store.get('global').toJS(),
  };
}

/**
 * add dispatch to
 * @param  {[type]} dispatch [description]
 * @return {[type]}          [description]
 */
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

/**
 * create redux container
 * @type {[type]}
 */

export default connect(mapStateToProps, mapDispatchToProps)(App);
