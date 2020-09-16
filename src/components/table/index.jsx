import React, { PureComponent } from 'react';
import { Table, Pagination } from 'antd';
import { noop, isObject } from 'lodash';
import styles from './style.less';

/**
 * 正常table的组件
 * 默认显示分页，默认无Selection，默认分页10, 20, 50, 100
 * type 表格类型：默认无
 *  'expand-table' 为行高较高的table，一般用于带有图片的table，现用在装机-系统模板/硬件模板/镜像管理
 *  'grid-table' 为行高很高的table，现暂无页面使用（可能会被废弃）
 * path         String  dispatch的路径
 * dataSource   Array 列表数据源
 * tableData    Object/Array  列表数据源（经过reducer封装）
 * dispatch
 * columns      String  
 * getColumns   Function
 * rowSelection Boolean/Function 多选（是否，或者自定义）
 * 调用:
 * 1、经过reducer包装过：
 * <Table
    getColumns={this.getColumns}
    tableData={tableData}
    path='.../table-data'
    dispatch={dispatch}
  />
  2、未经过reducer包装过：【用antd自带的分页】
    1）有分页功能：必须自传分页回调函数
    <Table
      dataSource={tableList}
      getColumns={getColumns}
      paginationProps={{
        current: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onShowSizeChange: this.changePageSize,
        onChange: this.changePage
      }}
    />
    2）无分页功能：
    <Table
      dataSource={tableList}
      getColumns={getColumns}
      hasPagination={false}
    />
 */
class MyTable extends PureComponent {
  componentWillUnmount() {
    const {
      isReset = true,
      isClearSelected = true,
      dispatch,
      path
    } = this.props;
    if (isReset && dispatch) {
      dispatch({
        type: `${path}/reset`
      });
    }
    if (isClearSelected && dispatch) {
      dispatch({
        type: `${path}/set/selectedRows`,
        payload: {
          selectedRows: [],
          selectedRowKeys: []
        }
      });
    }
  }

  onSearch = values => {
    const { dispatch, path } = this.props;

    dispatch({
      type: `${path}/search`,
      payload: {
        ...values
      }
    });
  };

  reload = () => {
    const { dispatch, path } = this.props;

    dispatch({
      type: `${path}/get`
    });
    dispatch({
      type: `${path}/set/selectedRows`,
      payload: {
        selectedRows: [],
        selectedRowKeys: []
      }
    });
  };

  getRowSelection = () => {
    const {
      tableData,
      checkType,
      getCheckboxProps,
      dispatch,
      path
    } = this.props;
    const { selectedRowKeys } = tableData;

    return {
      type: checkType, //默认是复选
      selectedRowKeys,
      getCheckboxProps: getCheckboxProps,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: `${path}/set/selectedRows`,
          payload: {
            selectedRowKeys,
            selectedRows
          }
        });
      }
    };
  };

  changePage = page => {
    const { dispatch, path } = this.props;

    dispatch({
      type: `${path}/change-page`,
      payload: {
        page
      }
    });
  };

  changePageSize = (page, pageSize) => {
    const { dispatch, path } = this.props;

    dispatch({
      type: `${path}/change-page-size`,
      payload: {
        page,
        pageSize
      }
    });
  };

  getColumns = () => {
    const { getColumns } = this.props;
    let columns = getColumns();

    columns = columns.map(item => {
      const { render = null, ...rest } = item;
      return {
        render: (text, record) => {
          return (
            <div className='td-wrapper'>
              {render ? render(text, record) : record[item.dataIndex]}
            </div>
          );
        },
        ...rest
      };
    });

    return columns;
  };

  render() {
    const {
      tableData = {},
      dataSource = null,
      columns = [],
      getColumns = noop,
      rowSelection,
      hasPagination = true,
      paginationProps = {},
      tableWrapperStyle = {},
      rowKey = 'id',
      type = null, // 表格类型
      ...restProps
    } = this.props;
    const { loading, selectedRowKeys } = tableData;
    const defaultPagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: total => {
        if (rowSelection) {
          return `已选${selectedRowKeys.length}项，共 ${total} 条`;
        }
        return `共 ${total} 条`;
      },
      pageSizeOptions: [ '10', '20', '50', '100' ],
      ...paginationProps
    };
    const tableColumns = columns.length
      ? columns
      : type === 'grid-table'
        ? this.getColumns()
        : getColumns();
    const tableSource = dataSource
      ? dataSource
      : tableData.list
        ? tableData.list
        : tableData;
    const tablePagination = hasPagination
      ? tableData.pagination
        ? tableData.pagination
        : defaultPagination
      : false;
    const tableRowSelection = isObject(rowSelection)
      ? rowSelection
      : rowSelection === true
        ? this.getRowSelection()
        : null;

    return (
      <div className={type ? styles[type] : ''} style={tableWrapperStyle}>
        <Table
          rowKey={rowKey}
          columns={tableColumns}
          dataSource={tableSource}
          rowSelection={tableRowSelection}
          loading={loading}
          pagination={!tablePagination.page ? tablePagination : false} // 默认用antd的分页事件
          {...restProps}
        />
        {hasPagination !== false && tablePagination.page && (
          <Pagination
            current={tablePagination.page}
            pageSize={tablePagination.pageSize}
            total={tablePagination.total}
            onShowSizeChange={this.changePageSize}
            onChange={this.changePage}
            {...defaultPagination}
          />
        )}
      </div>
    );
  }
}

export default MyTable;
