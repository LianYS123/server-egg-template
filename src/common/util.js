import { notification, Modal } from 'antd';
import moment from 'moment';
import { hashHistory } from 'react-router';
import { noop } from 'lodash';
import { getWithArgs, post, del } from 'common/xFetch2';
import React from 'react';

export function getUriParam(paramName) {
  let url = window.location.href;
  if (url.indexOf('?') != -1) {
    url = url.substr(url.indexOf('?') + 1);
    if (url.substr(url.length - 2) === '#/') {
      url = url.substr(0, url.length - 2);
    }
    const paramList = url.split('&');
    for (const param of paramList) {
      const paramMap = param.split('=');
      if (paramMap[0] === paramName) {
        return paramMap[1];
      }
    }
  }
  return null;
}

/**
 * Array2Tree
 * 转换扁平的Array为有层次关系的Tree
 *
 * @name Array2Tree
 * @function
 * @param array 扁平的数组
 * @param parent 父ID
 * @param tree 最终的树结构
 * @returns {array}
 */
export function array2Tree(array, parent, tree) {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { id: '0' };

  const children = array.filter(child => {
    return child.parentId === parent.id;
  });

  if (children.length) {
    if (parent.id === '0') {
      tree = children;
    } else {
      parent.children = children;
    }

    children.forEach(child => {
      const a = array2Tree(array, child);
    });
  }

  return tree;
}

/**
 * 判断某项是否存在数组内
 *
 * @param array 数组
 * @param val 要检查的项(只支持基本)
 * @returns {boolean}
 */
export function arrayFind(array, val) {
  if (
    array === undefined ||
    array === null ||
    val === undefined ||
    val === null ||
    !(array instanceof Array)
  ) {
    return false;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i] === val) {
      return true;
    }
  }
  return false;
}

/**
 * 判断2个数组的差集
 *
 * @param array1 数组
 * @param array2 数组
 * @returns []
 */

export function diff(array1, array2) {
  if (
    array1 === undefined ||
    array1 === null ||
    array2 === undefined ||
    array2 === null ||
    !(array1 instanceof Array) ||
    !(array2 instanceof Array)
  ) {
    return [];
  }
  return array1.concat(array2).filter(function (arg) {
    return !(array1.indexOf(arg) >= 0 && array2.indexOf(arg) >= 0);
  });
}

/**
 * lookup 获取数组的值
 *
 * @name lookup
 * @function
 * @param list
 * @param key
 * @param value
 * @param returned 返回的值字段
 * @param single 是否取只返回一条数据
 * @returns {object}
 */
export function lookup(list, key, value, returned = null, single = false) {
  if (value === undefined) {
    return;
  }

  const result = list.filter(item => {
    return item[key] === String(value);
  });

  if (!result.length) {
    return;
  }

  if (single) {
    const data = result[0];

    // 获取指定值
    if (returned) {
      return data[returned];
    }

    return data;
  }

  return result;
}

/**
 * getRandomInt
 *
 * @name getRandomInt
 * @function
 * @param min
 * @param max
 * @returns {number}
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * numberFormat
 *
 * @name numberFormat
 * @function
 * @param number
 * @param sep
 * @returns {number}
 */
export function numberFormat(number, sep = ',') {
  const dot = String(number).split('.')[1] || '';
  return number
    .toFixed(dot.length || 2)
    .replace(/(\d)(?=(\d{3})+\.)/g, '$1' + sep);
}

export function sumBy(data, key) {
  return data.reduce((a, b) => {
    return a[key] + b[key];
  });
}

export function groupBy(data, fields, key, totalBy) {
  return data.reduce((objects, item) => {
    if (!(item[key] in objects)) {
      const obj = {};
      fields.forEach(k => {
        obj[k] = item[k];
      });
      obj[totalBy] = 1;
      objects[item[key]] = obj;
    } else {
      fields.forEach(k => {
        objects[item[key]][k] += item[k];
      });
      objects[item[key]][totalBy] += 1;
    }
    return objects;
  }, {});
}

/**
 * 校验同级目录下不能有相同的名称
 * @param data
 * @param values
 */
export const checkSameName = (data, values) => {
  if (data.children.length > 0) {
    data.children.forEach(tree => {
      if (values.pid === tree.pid && values.name === tree.name) {
        notification.error({
          message: '同级目录下不能存在同名目录'
        });
        values.flag = true;
      }
      checkSameName(tree, values);
    });
  }
  return values.flag;
};

/**
 * 删除数组中指定的项
 * @param array
 * @param item
 */
export const remove = (array, item) => {
  for (let i = 0; i < array.length; i++) {
    if (typeof item === 'string') {
      if (array[i] === item) {
        array.splice(i, 1);
      }
    } else {
      if (array[i].id === item.id) {
        array.splice(i, 1);
      }
    }
  }
  return array;
};

export function transToJson(data = []) {
  const json = {};
  data.forEach(it => {
    json[it.value] = it.name;
  });
  return json;
}

/**
 * kb转化为GB
 * @param {*} t
 */
export function transByteToGb(t) {
  if (t) {
    return (t / 1024 / 1024 / 1024).toFixed(3) + 'GB';
  }
  return '0GB';
}

export function transToMap(data = []) {
  const json = {};
  data.forEach(it => {
    json[it.id] = it.name;
  });
  return json;
}

/**
 * 检查IP地址的合法性
 * 合法的格式：（1~255）.（0~255）.（0~255）.（0~255）
 * @param ip
 */
export function isValidIP(ip) {
  const regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return regex.test(ip);
}

/**
 * 搜索组件设置初始值
 * @param {*} data
 * @param {*} searchKeys
 * @param {*} searchValues
 */
export function getInitialSearchList({
  data = {},
  searchKeys,
  searchValues,
  excludes = []
}) {
  let initialSearchList = [];
  for (let item in data) {
    if (!excludes.includes(item) && item !== 'keyword') {
      initialSearchList.push({
        key: item,
        keyLabel: searchKeys.filter(o => o.key === item)[0].label,
        value: data[item],
        valueLabel:
          searchValues[item].type === 'radio'
            ? searchValues[item].list.filter(o => o.value === data[item])[0]
              .label
            : searchValues[item].type === 'checkbox'
              ? searchValues[item].list
                .filter(o => data[item].includes(o.value))
                .map(item => item.label)
              : data[item]
      });
    }
  }
  return initialSearchList;
}

/**
 * 找指定的字典的某个字段
 * @param {string} type 字段名
 * @param {string} value 字段对应的 value
 * @param {string} name 字段对应的 name
 * @param {string} key 取出字段的属性名
 */
export function getSysDict({ type, value = '', name = '', key = '' }) {
  let sysDict = {};
  if (value) {
    sysDict = window.SYS_DICTS[type].filter(item =>
      item.value.toLowerCase().includes(value.toLowerCase())
    )[0];
  } else if (name) {
    sysDict = window.SYS_DICTS[type].filter(item =>
      item.name.toLowerCase().includes(name.toLowerCase())
    )[0];
  }
  if (key && sysDict) {
    // 找到对应的值且有传入的key
    return sysDict[key];
  } else if (key && !sysDict) {
    // 没有找到对应的值，但传入了key
    return '';
  }
  return sysDict;
}

// 判断是否为中文字符串
export function hasChinese(str) {
  const pattern = /.*[\u4e00-\u9fa5]+.*/;
  return pattern.test(str);
}

/**
 * 判断是否具有设备的访问权限
 * 无权限默认提示
 * @param {string} sn
 * @param {boolean} toDeviceDetail 是否跳转到设备详情页，默认true
 * @param {boolean} isBlank 是否打开新的标签页，默认false
 * @param {function} callback 检查后有权限的回调
 */
export async function checkOwnershipValidation({
  sn = '',
  toDeviceDetail = true,
  isBlank = false,
  callback
}) {
  let isAuthorized = false;
  const res = await getWithArgs('/api/cloudboot/v3/ownerships/validations', {
    sn
  });
  isAuthorized = res.content.valid;
  if (isAuthorized === true) {
    if (toDeviceDetail) {
      if (!isBlank) {
        hashHistory.push(`device/detail/${sn}`);
      } else {
        window.open(`#/device/detail/${sn}`);
      }
    } else if (callback) {
      callback(isAuthorized);
    }
  } else {
    return notification.error({
      message: `您无权访问设备：${sn}`
    });
  }
}

/**
 * sn不匹配时强制执行事件
 * @param {string} sns 设备sn
 * @param {object} err 错误信息
 * @param {function} fn 弹框前需执行的函数
 * @param {string} api 接口url
 * @param {function} method 执行方法
 * @param {string} options
 */
export function enforce({
  title = null,
  content = null,
  err,
  reload = noop,
  api,
  values,
  method = del, // 与 ConfirmAction 默认方法保持一致
  methodProps
}) {
  const { sns = [], sn = '' } = values;
  const onSubmit = async () => {
    await method(api, { ...values, force: true }, methodProps);
    reload();
  };

  if (err.message.includes('SN') && err.message.includes('不匹配')) {
    Modal.confirm({
      title: title || `${err.message}，是否强制执行？`,
      content: content || `已选择 ${sn ? 1 : sns.length} 台设备`,
      okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      onOk: onSubmit
    });
  }
}

/**
 * 根据 is_deleted 筛选表格显示ui
 * 若设备已被删，则只显示sn，其他数据都不显示，且操作栏显示已删除
 * @param {object} cloums
 */
export function filteredColumns(cloums) {
  return cloums.map((item, index) => {
    const preRender = item.render ? item.render : noop;
    if (item.dataIndex === 'sn') {
      item.render = (t, record) =>
        record && record.hasOwnProperty('is_deleted') && record.is_deleted ? (
          <span style={{ color: '#c4cdd7' }}>{t}</span>
        ) : (
          preRender(t, record) || record[item.dataIndex]
        );
    } else if (index === cloums.length - 1) {
      item.render = (t, record) =>
        record && record.hasOwnProperty('is_deleted') && record.is_deleted ? (
          <span className='dangerous-color'>设备已删除</span>
        ) : (
          preRender(t, record) || record[item.dataIndex]
        );
    } else {
      item.render = (t, record) =>
        record && record.hasOwnProperty('is_deleted') && record.is_deleted
          ? record.is_deleted
          : preRender(t, record) || record[item.dataIndex];
    }
    return item;
  });
}

/**
 * 经纬度转墨卡托
 * @param poi 经纬度
 * @returns {{}}
 * @private
 */
export function getMercator(poi) {
  var mercator = {};
  var earthRad = 6378137.0;
  mercator.x = ((poi.longitude * Math.PI) / 180) * earthRad;
  var a = (poi.latitude * Math.PI) / 180;
  mercator.y =
    (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
  return mercator;
}

/**
 * @description: 取时间差
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间，默认为现在
 * @param {string} timeFormat 时间格式
 * @returns {object} {milliseconds: , seconds: , minutes: , hours: , days: ,months: ,years: }
 */
export function getDuration({ startTime, endTime = moment(), timeFormat }) {
  // const TIME_FORMAT = timeFormat || 'YY-MM-DD HH:mm:ss';
  let start = typeof startTime === 'string' ? moment(startTime) : startTime,
    end = typeof endTime === 'string' ? moment(endTime) : endTime;
  // 返回的days 在moment里是指这个月的第几天，所以返回对象，由调用的函数自行处理格式
  // return moment(moment.duration(end.diff(start))._data).format(TIME_FORMAT);
  return moment.duration(end.diff(start))._data;
}

/**
 * 记录操作
 * @param {string} scene 页面
 * @param {boolean} target 操作详情
 */
export function recordOperation({ scene = '', target = '' }) {
  return post(
    '/api/cloudboot/v3/operation-logs',
    { scene, target },
    { successMsg: false }
  );
}

/**
 * @description: promise 延迟函数
 * @param {type} t 延迟时间
 * @return {type} promise
 */
export function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
}
