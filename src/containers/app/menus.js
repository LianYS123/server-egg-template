import Icon from '@ant-design/icons';
import React from 'react';
export const menuitems = [
  {
    key: '/',
    permissionKey: 'menu_home',
    link: '/',
    icon: <Icon type='home' />,
    description: '概览',
  },
  {
    key: 'assets',
    permissionKey: 'menu_asset_management',
    icon: <Icon type='down' />,
    description: '资产',
    sub_icon: <Icon type='money-collect' />,
    children: [
      {
        key: 'assets/visualizationRoom',
        permissionKey: 'menu_room_visualization',
        link: 'assets/visualizationRoom',
        description: '机房概览',
      },
      {
        key: 'assets/idc',
        permissionKey: 'menu_idc',
        link: '/assets/idc',
        description: '数据中心',
      },
      {
        key: 'assets/room',
        permissionKey: 'menu_server_room',
        link: '/assets/room',
        description: '机房信息',
      },
      {
        key: 'assets/cabinet',
        permissionKey: 'menu_server_cabinet',
        link: 'assets/cabinet',
        description: '机架信息',
      },
      {
        key: 'assets/maintenance',
        permissionKey: 'menu_maintenance_info',
        link: '/assets/maintenance',
        description: '维保信息',
      },
    ],
  },
];

export const getCurrentMenu = () => {
  let path = window.location.hash.match(/#\/(.+)/),
    ret = '/';
  path = path ? path[1] : '';

  if (path === '') {
    return ret;
  }
  if (path === 'login') {
    return path;
  }
  if (path.includes('assets/visualizationRoom')) {
    return 'assets/visualizationRoom';
  }
  return path;
};
