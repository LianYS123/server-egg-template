import React from 'react';

export default function Layout(props) {
  const buttonStyle = {
    position: 'absolute',
    right: '16px',
    top: '8px',
    zIndex: 1000 
  };
  return (
    <div className='approot-inner'>
      <div className='approot-inner-content'>
        <div className='page-tabs-unBordered'>
          <div className='page-unBorderedTitle'>{props.title}</div>
          {props.Buttons && <div style={buttonStyle}>
            {props.Buttons}
          </div>}
          {props.children}
        </div>
      </div>
    </div>
  );
}

