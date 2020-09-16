import { notification } from 'antd';
import { TextDecoder } from 'text-encoding';

const defaultFilename = function(contentType) {
  if (contentType === 'application/msexcel') {
    return 'file.xls';
  } else if (contentType === 'application/pdf') {
    return 'file.pdf';
  } else {
    return 'file';
  }
};

const convertArrayBufferToString = function(buffer) {
  const textDecoder = new TextDecoder("utf-8");
  return textDecoder.decode(buffer);
};

// https://nehalist.io/downloading-files-from-post-requests/
export const downloadFile = function(url, data, options) {
  options = options || { 'method': 'POST' };
  const method = options.method;

  let a = '';

  var request = new XMLHttpRequest();
  request.open(method, url, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.responseType = 'arraybuffer';

  request.onload = function () {
    // Only handle status code 200
    if (request.status === 200) {
      // Try to find out the filename from the content disposition `filename` value
      var disposition = request.getResponseHeader('content-disposition');
      var contentType = request.getResponseHeader('content-type');

      if (contentType.startsWith('application/json')) {
        a = request.response;
        const responseData = convertArrayBufferToString(a);
        notification.error({
          message: responseData.message
        });
      } else {
        var matches = /"([^"]*)"/.exec(disposition);
        var filename = (matches != null && matches[1] ? matches[1] : defaultFilename(contentType));

        var blob = new Blob([request.response], { type: contentType });

        if ('msSaveOrOpenBlob' in navigator) {
          // Microsoft Edge and Microsoft Internet Explorer 10-11
          window.navigator.msSaveOrOpenBlob(blob, decodeURI(filename));
        } else {
          // The actual download
          // standard code for Google Chrome, Mozilla Firefox etc
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = decodeURI(filename);

          document.body.appendChild(link);

          link.click();
        }

        document.body.removeChild(link);
      }
    }
  };
  request.onerror = function() {
    notification.error({
      message: "下载文件访问异常"
    });
  };
  request.ontimeout = function() {
    notification.error({
      message: "下载文件超时"
    });
  };
  request.send(JSON.stringify(data));
};
