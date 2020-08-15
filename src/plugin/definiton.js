export function isMailAdress(str) {
  if (!(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/).test(str)) {
    return false;
  } else {
    return true;
  }
}
  