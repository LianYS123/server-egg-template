/*
 * Authenticated
 * UAM登录成功后，默认跳转到/authenticated
 */

import React, { Component } from 'react';
import {
  decodeAccoutAndPassword,
  encodeAccoutAndPassword,
  base64decodeFunc,
  base64encodeFunc
} from 'common/base64';
import { connect } from 'react-redux';

import { IdcosUtil } from 'idcos-util';


export class Authenticated extends Component {
  UNSAFE_componentWillMount() {
    const hash = window.location.hash;
    const index = hash.indexOf('?');
    const query = hash.substring(index + 1);
    const params = IdcosUtil.parseQuery(query);

    const token = params.token;
    const loginHash = params.loginHash;

    localStorage.DCOS_ACCESS_TOKEN = token;
    document.cookie = 'access-token=' + token;
    if (
      loginHash &&
      loginHash !== '#/' &&
      loginHash.indexOf('&locale=') === -1
    ) {
      window.location.hash = '/' + loginHash;
    } else if (loginHash && loginHash !== '#/') {
      window.location.hash =
        '/' + loginHash.slice(0, loginHash.indexOf('&locale='));
    } else {
      window.location.hash = '/';
    }
  }

  render() {
    return <div />;
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);
