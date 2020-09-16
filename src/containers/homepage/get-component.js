async function doGet() {
  try {
    const component = await import('containers/homepage');
    return component;
  } catch (err) {
    throw err;
  }
}

export default function create(options) {
  const { errorLoading} = options;
  return function(nextState, cb) {
    doGet()
      .then(component => {
        cb(null, component.default);
      })
      .catch(errorLoading);
  };
}
