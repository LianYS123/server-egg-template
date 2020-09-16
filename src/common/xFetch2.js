/**
 * Created by zhangrong on 16/8/30.
 */

import xFetch from './xFetch';

export function encodeUrlWithSearchParams(originUrl, args, options = {}) {
  args = args || {};
  let url = '';

  for (let attr in args) {
    if (args[attr] === undefined || args[attr] === null) {
      delete args[attr];
    }
  }

  let keys = Object.keys(args);
  if (keys.length === 0) {
    return originUrl;
  }
  keys = keys
    .map(key => {
      if (options && options.isEncode) {
        return `${key}=${encodeURIComponent(args[key])}`;
      }
      return `${key}=${args[key]}`;
    })
    .join('&');
  if (keys) {
    url = originUrl + '?' + keys;
  } else {
    url = originUrl;
  }
  return url;
}

export function get(url, options = {}) {
  return xFetch(url, options);
}

export function getWithArgs(originUrl, data, options = {}) {
  const url = encodeUrlWithSearchParams(originUrl, data, options);
  
  return get(url, options);
}

export function post(url, data, options = {}) {
  const headers = data ? {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  } : { Accept: 'application/json' };
  const opts = {
    ...options,
    method: 'POST',
    cache: 'no-cache',
    headers,
    body: JSON.stringify(data)
  };
  return xFetch(url, { successMsg: data ? '操作成功' : false, ...opts });
}

export function postFile(url, data, options = {}) {
  const opts = {
    ...options,
    method: 'POST',
    cache: 'no-cache',
    headers: {
      Accept: '*/*',
      'Content-Type':
        'multipart/form-data;boundary=----WebKitFormBoundaryiqw6SEM6EXa7FlBk',
      authorization: 'authorization-text'
    },
    body: JSON.stringify(data)
  };
  return xFetch(url, { successMsg: '操作成功', ...opts });
}

export function del(url, data, options = {}) {
  const opts = {
    ...options,
    method: 'DELETE',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  return xFetch(url, { successMsg: '操作成功', ...opts });
}

export function put(url, data, options = {}) {
  const { headers, ...restOpts } = options;
  const opts = {
    ...restOpts,
    method: 'PUT',
    cache: 'no-cache',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  };
  return xFetch(url, { successMsg: '操作成功', ...opts });
}

