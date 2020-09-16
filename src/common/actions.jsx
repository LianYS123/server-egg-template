import React from 'react';
import { Modal } from 'antd';
import { cloneDeep } from 'lodash';
import { enforce } from 'common/util';
import { del } from 'common/xFetch2';
import Popup from 'components/popup';

//确认表单
export function ConfirmAction({
  options = {},
  title = '确定要删除吗？',
  okType,
  okText = '确定',
  content,
  method = del,
  api,
  values,
  reloadOther,
  width = 416,
  methodProps = {},
  canEnforce = false
}) {
  const onSubmit = async onClose => {
    // 统一封装强制执行操作
    let newMethodprops = cloneDeep(methodProps);
    if (canEnforce) {
      newMethodprops.onError = err => {
        onClose();
        if (methodProps.onError) {
          methodProps.onError(err);
        }
        enforce({
          method,
          api,
          values,
          err
        });
      };
    }

    const res = await method(api, values, newMethodprops);
    onClose();
    options.reload();
    if (reloadOther) {
      reloadOther(res.content);
    }
  };

  if (!okType) {
    okType = 'default';
    if (method === del || title.indexOf('删除') > -1) {
      okType = 'danger';
    }
  }

  return Modal.confirm({
    title: title,
    content: content,
    okText,
    okType,
    width,
    cancelText: '取消',
    onOk: onSubmit
  });
}

//自定义表单
export function CustomFormAction({
  options = {},
  title,
  method,
  api,
  CustomForm,
  reloadOther,
  width,
  pop = Popup,
  methodProps = {},
  canEnforce = false
}) {
  const onSubmit = async (values, realApi = api) => {
    if (options.record) {
      values.id = options.record.id;
    }
    // 统一封装强制执行操作
    let newMethodprops = cloneDeep(methodProps);
    if (canEnforce) {
      newMethodprops.onError = err => {
        pop.close();
        if (methodProps.onError) {
          methodProps.onError(err);
        }
        enforce({
          method,
          api,
          values,
          err
        });
      };
    }

    await method(realApi, values, newMethodprops);
    pop.close();
    options.reload();
    if (reloadOther) {
      reloadOther();
    }
  };

  pop.open({
    title: title,
    width: width || 800,
    onCancel: pop.close,
    content: (
      <CustomForm
        initialValue={options.record || {}}
        {...options}
        onSubmit={onSubmit}
        onCancel={pop.close}
      />
    )
  });
}

//自定义表单，不带提交逻辑
export function PureAction({
  options = {},
  title,
  CustomForm,
  width,
  pop = Popup
}) {
  pop.open({
    title: title,
    width: width || 800,
    onCancel: pop.close,
    content: (
      <CustomForm
        initialValue={options.record || {}}
        {...options}
        onCancel={pop.close}
      />
    )
  });
}
