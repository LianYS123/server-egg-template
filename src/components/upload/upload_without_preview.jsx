import React from 'react';
import { Upload, Button, notification, Alert } from 'antd';

export default class MyUpload extends React.Component {
  state = {
    fileList: [],
    errorMessage: '',
    importMessage: ''
  };

  handleChange = info => {
    //清空
    this.setState({
      errorMessage: '',
      importMessage: ''
    });
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.filter(file => {
      if (file.response) {
        if (file.response.status !== 'success') {
          return notification.error({ message: file.response.message });
        }
        //保存文件名称
        const fileName = file.response.content.filename;
        this.props.getFilename(fileName);

        //导入的数据成功
        if (file.response.content.import_status) {
          this.props.getButtonStatus(false);
          this.setState({
            importMessage: file.response.content.import_message
          });
        } else {
          //导入的数据错误
          this.props.getButtonStatus(true);
          this.setState({ errorMessage: file.response.content.import_message });
        }
        //过滤显示上传成功的文件
        return file.response.status === 'success';
      }
      return true;
    });

    this.setState({ fileList });
  };

  render() {
    const props = {
      name: 'files[]',
      accept: '.xlsx',
      action: this.props.actionUrl,
      onChange: this.handleChange,
      headers: {
        Authorization: localStorage.DCOS_ACCESS_TOKEN
      }
    };
    const { errorMessage, importMessage } = this.state;
    return (
      <div className={this.props.className} style={{ marginBottom: 8 }}>
        <Upload {...props} fileList={this.state.fileList}>
          <Button>{this.props.buttonTitle || '选择文件'}</Button>
        </Upload>
        {errorMessage && (
          <Alert
            message={errorMessage}
            type='error'
            showIcon={true}
            closable={true}
          />
        )}
        {importMessage && (
          <Alert
            message={importMessage}
            type='success'
            showIcon={true}
            closable={true}
          />
        )}
      </div>
    );
  }
}
