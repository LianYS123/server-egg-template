import { base64decodeFunc } from 'common/base64';

export const IDC_USAGE = {
  production: '生产',
  disaster_recovery: '容灾',
  pre_production: '准生产',
  testing: '测试'
};

export const ENVIRONMENT = {
  test: '测试环境',
  development: '开发环境',
  production: '生产环境'
};

export const BLACK_WHITE = {
  black: '黑名单',
  white: '白名单',
  off: '未开启黑白名单'
};

export const PRIVILEGE_LEVEL = {
  '0': '0(noaccess)',
  '1': '1(callback)',
  '2': '2(user)',
  '3': '3(operator)',
  '4': '4(administrator)',
  '5': '5(oem)'
};

export const NICSIDE = {
  inside: '内置',
  outside: '外置'
};

export const NOTICE_CHANNEL = {
  bestpay_open_monitor: '翼支付监控平台',
  email: '邮件'
};

export const ROLE = {
  administrator: '超级管理员',
  user: '普通用户'
};

export const YES_NO = {
  yes: '是',
  no: '否'
};
export const TRUE_FALSE = {
  true: '是',
  false: '否'
};
export const BUILTIN_HARDWARE = {
  Yes: '是',
  No: '否'
};

export const BUILTIN = {
  yes: '是',
  no: '否'
};

export const MAIN_SERVER_LEVEL = {
  '1': '4小时',
  '2': '下一个工作日'
};

export const OPERATOR = {
  contains: '包含',
  equals: '相等',
  regexp: '正则'
};

export const CHANGEITEMS_MAP = {
  add: '新增',
  replace: '更换',
  remove: '移除'
};

export const IP_REGEXP = /((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/;
export const KEY = base64decodeFunc('CzV6QgcfVh5gKgJOM/ExJg==');

// export const NOTICE_CATEGORY = {
//   hardware_change: '硬件变动',
//   hardware_failure: '硬件故障'
// };

// export const BOOT_MODE = {
//   uefi: 'UEFI',
//   legacy_bios: 'BIOS'
// };

// index.js 引入所有变量，以便可一次性引入多个文件里的enum
export * from './color';
export * from './device';
export * from './format';
export * from './get-enum';
export * from './layout';
export * from './icon';
export * from './network';
export * from './severity';
export * from './status';
export * from './task';
export * from './type';
export * from './way';
export * from './osInstall';
