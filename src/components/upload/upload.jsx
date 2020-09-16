import { notification, Upload, Button } from 'antd';

export default function UploadButton(props) {
  const uploadProps = {
    name: 'file',
    action: props.api,
    showUploadList: false,
    headers: {
      Authorization: localStorage.DCOS_ACCESS_TOKEN
    },
    onChange(info) {
      if (info.file.status === 'done') {
        notification.success({ message: `${info.file.name} 上传成功` });
        props.reload();
      } else if (info.file.status === 'error') {
        notification.error({ message: `${info.file.name} 上传失败` });
      }
    }
  };
  return (
    <div style={{ float: 'left' }}>
      <Upload {...uploadProps}>
        <Button
          disabled={props.disabled}
          style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
        >
          导入
        </Button>
      </Upload>
    </div>
  );
}
