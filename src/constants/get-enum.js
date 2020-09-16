export function getSearchList(data) {
  return Object.keys(data).map(key => {
    // 包含颜色的常量格式：key: [ '#xxx', 'label' ]
    if (Array.isArray(data[key])) {
      return {
        value: key,
        label: data[key][1]
      };
    }
    // 不包含颜色的常量格式：key: 'label'
    return {
      value: key,
      label: data[key]
    };
  });
}

export function getMapFromList(items, opt = {
  key: 'value',
  value: 'name'
}) {
  const obj = {};
  items.forEach(item => {
    obj[item[opt.key]] = item[opt.value];
  });
  return obj;
}
// export function getSites(sites = [], value) {
//   sites.forEach(site => {
//     if (site.code === value) {
//       value = site.name;
//     }
//   });
//   return value;
// }

// export function getProxy(proxy = [], value) {
//   proxy.forEach(site => {
//     if (site.code === value) {
//       value = site.name;
//     }
//   });
//   return value;
// }

// export function getMultiSites(sites = [], arr = []) {
//   const localArr = arr.map(value => {
//     sites.forEach(site => {
//       if (site.code === value) {
//         value = site.name;
//       }
//     });
//     return value;
//   });
//   const set = [...new Set(localArr)];
//   return set.join(',');
// }

// export function getEnumLabel(enums = {}, key) {
//   return enums[key] || key;
// }

// export function getEnumOptions(enums) {
//   const keys = Object.keys(enums);
//   const options = keys.map(key => {
//     return {
//       label: enums[key],
//       value: key
//     };
//   });
//   options.unshift({
//     label: '全部',
//     value: ''
//   });
//   return options;
// }
