export function getValue(obj, name) {
  if (!obj) return obj;
  let nameList = name.trim().split(".");
  if (nameList.length == 1) return obj[nameList[0]];
  let temp = obj;
  for (let i = 0; i < nameList.length; i++) {
    if (temp[nameList[i]]) {
      temp = temp[nameList[i]];
    } else {
      return undefined;
    }
  }
  return temp;
}
