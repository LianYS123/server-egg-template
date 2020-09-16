import 'fetch-detector';
import 'fetch-ie8';
import { noop } from 'lodash';
import cookie from 'js-cookie';
import { notification, Modal } from 'antd';
import * as auth from 'services/auth';
import { base64decodeFunc } from './base64';

const errorMessages = res => `${res.status} ${res.statusText}`;

function check401(res) {
  if (res.status === 401) {
    localStorage.clear();
    cookie.remove('access-token', '');
    auth.ssoLogin();
    //首次到‘/'页面时会请求用户接口，成功后才会render
    if (res.url.indexOf('/api/cloudboot/v3/users/info') !== -1) {
      notification.error({ message: '用户身份过期，请重新登录' });
      return res;
    }
    //本地登录Promise.reject()防止多个接口都报error信息
    return Promise.reject();
  }
  return res;
}

function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}

function check500(res) {
  if (res.status === 500) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}

function textParse(res) {
  return res.text().then(text => ({ ...res, result: text }));
}

function jsonParse(res) {
  return res.json().then(result => ({ ...res, result }));
}

function handleResponse (res) {
  let contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text')) {
    return textParse(res);
  }
  return jsonParse(res);
}

function errorMessageParse(result) {
  let { status, message, content, metadata, Status } = result;
  if (status !== 'success') {
    return Promise.reject(result);
  }
  return result;
}

/**
 * 检查请求接口的成功失败状态，并给出提示，默认接口会给出失败的提示，但不会显示成功的提示
 * @param {object} res 接口返回值
 * @param {object} options 选项，可选
 * successMsg为true时，显示接口返回的message字段
 * successMsg/errorMsg为字符串时，直接显示该字符串（用户可自定义请求成功/失败时的提示）
 * successMsg/errorMsg为false，不显示请求成功/失败的提示
 * hasDescription: 是否需要显示description
 * isModal：提示失败信息的形式是否是modal形式，一般中断操作类为modal形式，以便用户查看信息
 * onError: 自定义失败的回调
 * onSuccess: 自定义成功的回调
 */
function checkSuccessStatus(res, options) {
  const {
    successMsg = false,
    errorMsg = '',
    hasDescription = false,
    isModal = false,
    onError = noop,
    onSuccess = noop
  } = options;
  if (res.status && res.status !== 'success') {
    if (errorMsg !== false) {
      const msg =
        typeof errorMsg === 'string' && errorMsg != '' ? errorMsg : res.message;
      const des = hasDescription === false ? '' : res.message;
      if (isModal) {
        Modal.error({ title: msg, content: des });
      } else {
        window.swal('error', msg, des);
      }
      onError(res);
      return false;
    }
    onError(res);
    return false;
  }
  if (successMsg !== false) {
    const message = successMsg === true ? res.message : successMsg;
    window.swal('success', message);
  }
  if (onSuccess) {
    onSuccess(res);
  }
  return true;
}

/**
 * 请求接口的封装函数
 * @param {string} url 请求的地址
 * @param {object} options 选项
 * 选项包含data，successMsg，errorMsg，hasDescription，isModal，onError等对象
 */
function xFetch(url, options = {}) {
  const {
    successMsg,
    errorMsg,
    hasDescription,
    isModal,
    onError,
    onSuccess,
    ...restOptions
  } = options;
  const opts = { isEncode: true, ...restOptions, credentials: 'include' };
  const locale = base64decodeFunc(localStorage.LOCALE);
  // const token = localStorage.DCOS_ACCESS_TOKEN || cookie.get('access-token');
  opts.headers = {
    ...opts.headers,
    // 'Authorization': `${token}`,
    locale
  };

  if (opts.isEncode) {
    url = encodeURI(url);
  }
  return (
    fetch(url, opts)
      .then(check401)
      //.then(check404)
      // .then(check500)
      .then(handleResponse)
      .then(res => {
        const isSuccess = checkSuccessStatus(res.result, {
          successMsg,
          errorMsg,
          hasDescription,
          isModal,
          onError,
          onSuccess
        });
        if (!isSuccess) {
          return Promise.reject(res.result);
        }
        return res.result;
      })
  );
}

export default xFetch;
