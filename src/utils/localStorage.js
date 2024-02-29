export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Invalid JSON");
    return data;
  }
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
