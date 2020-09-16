import React from 'react';
import { Upload, Button, Row, Col, notification, Alert } from 'antd';
import Icon from '@ant-design/icons';
import { post } from 'common/xFetch2';
import Table from 'components/table';
import * as auth from 'services/auth';
import cookie from 'js-cookie';

/**
 * 适用于分三步导入的导入组件需求
 * importApi
 * uploadApi
 * previewApi
 * getColumns()
 */

export default class FileUpload extends React.Component {
  state = {
    fileList: [],
    tableList: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    Filename: '',
    disableUpload: false,
    errorMessage: null,
    importMessage: null
  };

  //最终提交
  handleUpload = async () => {
    await post(this.props.importApi, { filename: this.state.fileName });
    this.props.onSuccess();
  };

  componentWillUnmount() {
    this.setState({
      fileList: [],
      tableList: [],
      Filename: '',
      disableUpload: false,
      errorMessage: null,
      importMessage: null
    });
  }

  changePage = page => {
    this.getTableData({
      page,
      page_size: this.state.pagination.pageSize
    });
  };

  changePageSize = (page, pageSize) => {
    this.getTableData({
      page,
      page_size: pageSize
    });
  };

  getTableData = async (query, callback) => {
    const res = await post(
      this.props.previewApi,
      {
        filename: this.state.fileName,
        ...query
      },
      {
        successMsg: false,
        onError: () => this.setState({ errorMessage: res.message })
      }
    );
    const result = res.content.import_content;
    this.setState({
      tableList: result.records,
      pagination: {
        page: result.page,
        pageSize: result.page_size,
        total: result.total_records
      }
    });
    if (callback) {
      callback(res);
    }
  };

  downloadImportTemplate = () => {
    if (cookie.get('access-token')) {
      window.open(this.props.downloadApi);
    } else {
      auth.ssoLogin();
    }
  };
  render() {
    const props = {
      name: 'files[]',
      accept: '.xlsx',
      action: this.props.uploadApi,
      headers: {
        Authorization: localStorage.DCOS_ACCESS_TOKEN
      },
      onChange: info => {
        //清空
        this.setState({
          errorMessage: null,
          importMessage: null
        });

        let fileList = info.fileList;
        //只上传一个文件
        fileList = fileList.slice(-1);
        fileList = fileList.filter(file => {
          if (file.response) {
            if (file.response.status !== 'success') {
              return notification.error({ message: file.response.message });
            }
            //保存文件名称
            const fileName = file.response.content.filename;
            this.setState({ fileName });

            //导入的数据成功
            if (file.response.content.import_status) {
              this.setState({
                disableUpload: false,
                importMessage: file.response.content.import_message
              });
            } else {
              //导入的数据错误
              this.setState({
                disableUpload: true,
                errorMessage: file.response.content.import_message
              });
            }

            //预览
            this.getTableData({ filename: fileName, page_size: 10, page: 1 });
            //过滤显示上传成功的文件
            return file.response.status === 'success';
          }
          return true;
        });
        this.setState({ fileList });
      }
    };

    const { errorMessage, importMessage, tableList, pagination } = this.state;

    let expandedRowKeys = [];
    if (tableList.length > 0) {
      tableList.map((item, index) => {
        if (item.error_message) {
          expandedRowKeys.push(index);
        }
      });
    }

    return (
      <div className='upload-form'>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <Upload {...props} fileList={this.state.fileList}>
            <Button>
              <Icon type='upload' /> 选择文件
            </Button>
          </Upload>
          <a
            style={{ position: 'absolute', right: 0, top: 10 }}
            onClick={this.downloadImportTemplate}
          >
            下载导入模板
          </a>
        </div>

        <div style={{ marginBottom: 8 }}>
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
        <Row>
          <Col span={24} className='no-wordbreak'>
            <Table
              dataSource={this.state.tableList}
              getColumns={this.props.getColumns}
              more={record => record.error_message}
              expandedRowKeys={expandedRowKeys}
              hasPagination={this.state.tableList.length > 0}
              expandedRowRender={record => (
                <pre
                  style={{ margin: 0, color: '#ff3700' }}
                  dangerouslySetInnerHTML={{ __html: record.error_message }}
                ></pre>
              )}
              paginationProps={{
                current: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onShowSizeChange: this.changePageSize,
                onChange: this.changePage
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className='pull-right'>
              <Button
                onClick={() => this.props.onCancel()}
                style={{ marginRight: 8 }}
              >
                取消
              </Button>
              <Button
                type='primary'
                onClick={() => this.handleUpload()}
                disabled={
                  this.state.tableList.length === 0 || this.state.disableUpload
                }
              >
                确定
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
