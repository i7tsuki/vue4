export function isMailAdress(str) {
  return (/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/).test(str);
}
export function isPassword(str) {
  return (str.trim().length > 5);
}