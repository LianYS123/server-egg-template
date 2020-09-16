import React from 'react';
import Popup from 'components/popup';

export default function action(options) {
  Popup.open({
    title: '修改密码',
    width: 700,
    onCancel: () => {
      Popup.close();
    },
    content: (
      <div>empty</div>
    )
  });
}
