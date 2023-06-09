export function generateRandomString(n) {
  let randomString = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < n; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  const date = new Date();
  return randomString.concat(date.valueOf());
}

export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function formatDateYYYYMMDD(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('');
}

// Function to update the value of a single state array
export function updateStateArray(index, key, newValue, setItems, items) {
  const updatedItems = [...items];
  updatedItems[index][key] = newValue;
  setItems(updatedItems);
}

// Function to update the value of a single state object
export function updateStateObject(setState, key, value) {
  setState((prevState) => ({
    ...prevState,
    [key]: value,
  }));
}

// Function to update the value of a single state object
export function updateStateArrayInObject(setState, key, value) {
  setState((prevState) => ({
    ...prevState,
    [key]: value,
  }));
}

//Sum of key in array
export function sumOfKey(arrayName, key) {
  return Array.isArray(arrayName)
    ? arrayName.reduce(
        (accumulator, currentData) =>
          accumulator + (Number(currentData[key]) || 0),
        0
      )
    : 0;
}

//Sum of key in array
export function sumOfKeyMultiply(arrayName, key1, key2) {
  return Array.isArray(arrayName)
    ? arrayName.reduce(
        (accumulator, currentData) =>
          accumulator +
          (Number(currentData[key1]) * Number(currentData[key2]) || 0),
        0
      )
    : 0;
}

//Round up to defined number of digits
export function roundUptoFixedDigits(numberToRound, decimalPlaces) {
  if (!isNaN(numberToRound) && !isNaN(decimalPlaces))
    return (Math.ceil(numberToRound * 100) / 100).toFixed(decimalPlaces);
  else return false;
}
