import React from 'react';
import { Button, Tooltip, Menu, Dropdown } from 'antd';
import Icon from '@ant-design/icons';
import { cloneDeep, some, every } from 'lodash';
import styles from './styles.less';

const { SubMenu } = Menu;
// eg
// const commands = [
//   {
//     name: "编辑",
//     command: "edit",
//     disabled: hasPermisson
//   },
//   {
//     name: "重启",
//     command: "restart",
//     disabled: hasPermisson
//   }
// ];

// return (
//   <TableControlCell
//     commands={commands}
//     record={record}
//     execCommand={command => {
//       this.execAction(command, [record]);
//     }}
//   />
// );

/**
 * 普通操作按钮
 * @param {[type]} command [description]
 */
function Default(command, props) {
  const record = props.record;
  const style = command.style || {};

  return (
    <a
      key={command.name}
      href='javascript:void(0)'
      style={{ color: command.type === 'danger' && '#ff3700', ...style }}
      onClick={ev => {
        props.execCommand(command.command || command.name, record, ev);
        ev.preventDefault();
      }}
    >
      {command.icon && <i style={{ marginRight: 5 }}>{command.icon}</i>}
      {command.name}
    </a>
  );
}

/**
 * 禁用命令的渲染
 * @param {object} command 单条命令
 * @param {string} message 禁用理由的提示信息
 */
function Disabled(command) {
  return (
    <Tooltip key={command.name} title={command.message || command.name}>
      <span className='disabled'>
        {command.icon || null}
        {command.name}
      </span>
    </Tooltip>
  );
}

/**
 * 单条命令的渲染
 * @param  {object} command 单条命令
 * @param {object} props
 */
function Loading(command) {
  return (
    <span className='disabled' style={{ color: '#a3d9ff' }}>
      {command.name} &nbsp;
      {command.icon || <Icon type='loading' />}
    </span>
  );
}

/**
 * 单条命令的渲染
 * @param  {object} command 单条命令
 * @param {object} props
 */
export function renderCommand(command, props) {
  const record = props.record || {};
  // disabled
  if (command.disabled) {
    return Disabled(command);
  }
  // if (command.shouldDisabled && command.shouldDisabled(record)) {
  //   return Disabled(command);
  // }

  if (command.loading) {
    return Loading(command);
  }
  // custom render
  if (command.render) {
    return command.render(props);
  }
  // children render
  if (command.children) {
    return renderChildren(command, props);
  }
  // default render
  return Default(command, props);
}

/**
 * 渲染下拉菜单
 * @param  {Array} commands [description]
 * @param {Object} props [description]
 */
export function renderMore(commands, props) {
  const $menu = (
    <Menu>
      {commands.map(command => {
        return (
          <Menu.Item key={`command-menu-${command.name}`}>
            {renderCommand(command, props)}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <Dropdown overlay={$menu} key='more-dropdown'>
      <a className='ant-dropdown-link' href='javascript: void(0);'>
        更多 <Icon type='down' />
      </a>
    </Dropdown>
  );
}

/**
 * 渲染子菜单
 * @param  {[type]} keys [description]
 * @return {[type]}      [description]
 */
export function renderChildren(command, props) {
  const $menu = (
    <Menu>
      {(command.children || []).map(item => {
        if (!item.hide) {
          return (
            <Menu.Item key={`command-menu-${item.name}`}>
              {renderCommand(item, props)}
            </Menu.Item>
          );
        }
      })}
    </Menu>
  );

  return (
    // 子项每一个都 hide 的情况下，下拉框 disabled
    <Dropdown
      disabled={every(command.children, { hide: true })}
      overlay={$menu}
      overlayClassName={styles['table-controls-has-children']}
      overlayStyle={{ fontSize: '12px' }}
      trigger={['click']}
      key='children-dropdown'
    >
      <a
        className='ant-dropdown-link'
        href='javascript: void(0);'
        onClick={e => e.stopPropagation()}
      >
        {command.name}
      </a>
    </Dropdown>
  );
}

export default function Commands(props) {
  let showCommands = cloneDeep(props.commands).filter(item => !item.hide);
  const limit = 3 || props.limit;
  const $commands = showCommands
    .slice(0, limit)
    .map(command => renderCommand(command, props));
  let $more = null;
  if (showCommands.length > limit) {
    $commands.pop();
    $more = renderMore(
      showCommands.slice(limit - 1, showCommands.length),
      props
    );
  }
  $commands.push($more);
  return <div className={styles['table-controls']}>{$commands}</div>;
}
