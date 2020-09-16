export const DEVICE_SOURCE = {
  bootos: 'BootOS',
  import: 'Excel导入',
  ipmi_discovery: '带外发现'
};

export const DEVICE_LEVEL = {
  '3': '高',
  '2': '中',
  '1': '低'
};

export const DEVICE_STATUS_WITH_COLOR = {
  managed: [ '#00c3ff', '已纳管' ],
  under_repair: [ '#8E44AD', '维修中' ],
  online: [ '#6bc646', '已上线' ],
  offline: [ '#c4cdd7', '已下线' ]
};

export const DEVICE_INSTALL_STATUS = {
  // 'pre_install': '等待安装',
  installing: '正在安装',
  failure: '安装失败',
  success: '安装成功'
};

export const DEVICE_MANAGEMENT_STATUS = {
  unknown: '未纳管',
  yes: '已纳管'
};

export const OOB_DEVICE_STATUS = {
  yes: [ '#6bc646', '正常' ],
  no: [ '#ff3700', '异常' ],
  unknown: [ '#929EA6', '未知' ]
};

// export const DEVICE_APPLY_STATUS = {
//   'unassigned': '未分配',
//   'preassigned': '预分配',
//   'assigned': '已分配'
// };
