const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    //Error
    //JSON is not okay
    return false;
  }

  return true;
};

export default isJson;
