function debounce(func, wait, options = {}) {
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  const leading = Boolean(options.leading);
  const trailing = options.trailing !== undefined ? Boolean(options.trailing) : true;

  function invoke() {
    if (trailing && lastArgs) {
      func.apply(lastThis, lastArgs);
    }
    timerId = null;
    lastArgs = null;
    lastThis = null;
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const isInvokingLeading = leading && !timerId;

    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(invoke, wait);

    if (isInvokingLeading) {
      func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  }

  debounced.cancel = () => {
    if (timerId) clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timerId && lastArgs) {
      clearTimeout(timerId);
      invoke();
    }
  };

  return debounced;
}

function solution(mode) {
  let callCount = 0;
  const fn = () => ++callCount;
  if (mode === 'leading_only') {
    const debounced = debounce(fn, 20, { leading: true, trailing: false });
    debounced();
    debounced();
    return callCount;
  }
  if (mode === 'cancel_pending') {
    const debounced = debounce(fn, 50, { leading: false, trailing: true });
    debounced();
    debounced.cancel();
    return callCount;
  }
  return 0;
}
