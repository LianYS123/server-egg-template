import React from "react";

export default function Layout(props) {
  return (
    <div className='approot-inner'>
      <div className='approot-inner-content'>
        <div className='page-node-report page' style={props.pageStyle}>
          {props.Breads}
          {!props.noPageHeader && (
            <div className='page-header'>
              <h1> {props.title}</h1>
              {props.SearchForm}
              
            </div>
          )}
          {!props.noPageBody ? (
            <div className='page-body' style={props.pageBodyStyle}>
              {props.children}
            </div>
          ) : (
            props.children
          )}
          {props.Buttons && (
            <div className='page-header-radio-buttons'>{props.Buttons}</div>
          )}
        </div>
      </div>
    </div>
  );
}
