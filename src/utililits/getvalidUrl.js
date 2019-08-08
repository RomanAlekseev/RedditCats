const getValidVideoUrl = str => {
  const cutBefore = str.indexOf("?");
  const validUrl = str.slice(0, cutBefore);
  return validUrl;
};

export default getValidVideoUrl;
