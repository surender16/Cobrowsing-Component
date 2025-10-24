export const isPageHidden = () => {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.hidden;
};

export const onPageVisibilityChange = (callback) => {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const handler = () => callback(document.hidden);
  document.addEventListener('visibilitychange', handler, false);

  return () => {
    document.removeEventListener('visibilitychange', handler, false);
  };
};
