// 
// utils
//

function IsNulo(value) {
  return (value === null || value === undefined);
}

function CleanText(str, length) {
  if (str && str.toString().trim() != '') {
    let s1 = str.toString().replace('\'', '`').trim();
    if (length > 0 && s1.length > length) {
      s1 = s1.toString().substring(0, length);
    }
    return s1.toString().trim();
  }
  return '';
}

function ValDate(datetimeStr, offset) {
  // Parse the input datetime string
  // example datetimeStr = "2024-09-10T21:40:04.73Z";
  // const offset = -5; // UTC-5
  let json = {
    date: '01/01/1980',
    time: '00:00:00'
  };
  try {
    const utcDate = new Date(datetimeStr);
    // Get the current UTC time in milliseconds
    const utcTime = utcDate.getTime();
    // Convert offset from hours to milliseconds
    const offsetMs = offset * 60 * 60 * 1000;
    // Calculate the new time by adjusting for the offset
    const localTime = new Date(utcTime + offsetMs);
    // Extract date and time components separately
    json.date = localTime.toISOString().split('T')[0]; // Date in YYYY-MM-DD
    json.time = localTime.toISOString().split('T')[1].split('.')[0]; // Time in HH:MM:SS
  } catch (e) {
    console.log('error:', e);
  }
  return json;
}

function ValDouble(value, dec) {
  try {
    let numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      let formattedValue = numericValue.toFixed(dec);
      numericValue = parseFloat(formattedValue);
    } else {
      numericValue = 0;
    }
    return numericValue;
  } catch (e) {
    return 0;
  }
}

function ValInteger(value) {
  try {
    let numericValue = parseInt(value);
    if (!isNaN(numericValue)) {
      let formattedValue = numericValue.toFixed(0);
      numericValue = parseInt(formattedValue);
    } else {
      numericValue = 0;
    }
    return numericValue;
  } catch (e) {
    return 0;
  }
}

function ValBoolean(value) {
  try {
    return value === true || value === 'true' || value === 1 || value === '1';
    // return JSON.parse(value);
  } catch (e) {
    return false;
  }
}


function GetUtcDate() {
  const cUtcDate = new Date().toISOString();
  const timestamp = Date.parse(cUtcDate);
  const dateObject = new Date(timestamp);
  return dateObject;
}

function GetUtcOffset(offset) {
  const date = GetUtcDate();
  date.setHours(date.getHours() + ValInteger(offset));
  return date;
}


function GetDate(date) {
  try {
    const timestamp = Date.parse(date);
    const dateObject = new Date(timestamp);
    return dateObject;
  } catch (e) {
    return GetUtcDate();
  }
}

function FormatNumber(value, decimals) {
  try {
    // Round the number to the specified number of decimal places
    const roundedValue = Number(value.toFixed(decimals));
    // Format the rounded number with commas for thousands separators
    return roundedValue.toLocaleString(undefined, { minimumFractionDigits: decimals });
  } catch (e) {
    return '0.00';
  }
}


function FormatDate(mdate) {
  try {
    const month = String(mdate.getMonth() + 1).padStart(2, '0');
    const day = String(mdate.getDate()).padStart(2, '0');
    const year = mdate.getFullYear();
    const formattedDateTime = `${month}/${day}/${year}`;
    return formattedDateTime;
  } catch (e) {
    return '01/01/1980';
  }
}


function FormatDateTime(mdate) {
  try {
    const month = String(mdate.getMonth() + 1).padStart(2, '0');
    const day = String(mdate.getDate()).padStart(2, '0');
    const year = mdate.getFullYear();
    const hours = String(mdate.getUTCHours()).padStart(2, '0');
    const minutes = String(mdate.getMinutes()).padStart(2, '0');
    const sec = String(mdate.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes}:${sec}`;
    return formattedDateTime;
  } catch (e) {
    return '01/01/1980 00:00';
  }
}

function SqlDate(mdate) {
  try {
    const month = String(mdate.getMonth() + 1).padStart(2, '0');
    const day = String(mdate.getDate()).padStart(2, '0');
    const year = mdate.getFullYear();
    const formattedDateTime = `${year}/${month}/${day}`;
    return formattedDateTime;
  } catch (e) {
    return '2024/01/01';
  }
}

function Delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function EncodeBase64(originalString) {
  try {
    const encoder = new TextEncoder();
    const byteArray = encoder.encode(originalString);
    let binary = '';
    for (let i = 0; i < byteArray.length; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return btoa(binary);
  } catch (e) {
    return '';
  }
}

function DecodeBase64(e64String) {
  try {
    const binaryString = atob(e64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(byteArray);
  } catch (e) {
    return 'InvalidBase64';
  }
}

function ExtractNumbers(inputString) {
  try {
    var numberPattern = /\d+/g;
    var matches = inputString.match(numberPattern);
    if (!matches) {
      return '';
    }
    return matches.join('');
  } catch (e) {
    return '';
  }
}

function GenerateUID(maxlength) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueString = '';
  for (let i = 0; i < maxlength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters.charAt(randomIndex);
  }
  return uniqueString;
}

function IsValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// function IsValidPhone(phone) {  // If length = 10, its valid
//   return (phone.length === 10);
// }

function IsValidPhone(phoneNumber) {
  try {
    var mtel = ExtractNumbers(phoneNumber);
    var regex = /^\d{10}$/;
    return regex.test(mtel);
  } catch (e) {
    return false;
  }
}


// function FormatPhone(phone) {
//   // Function comes after IsValidPhone; makes it so that anything that reaches this MUST be a valid phone # (w/ 10 valid digits)
//   // Roberto says phone # is already stripped!
//   return `(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6)}` // Returns formatted string
// }

function FormatPhone(phoneNumber) {
  var mDigits = ExtractNumbers(phoneNumber);
  try {
    if (mDigits.length == 10)
      return `(${mDigits.slice(0, 3)}) ${mDigits.slice(3, 6)}-${mDigits.slice(6)}`;
    else
      return mDigits;
  } catch (e) {
    return '(000) 000-0000';
  }
}

// function Get4Digit() {  // TODO LATER
//   // Get a random 4 digit code
//   // Assuming you want a value from 0000 to 9999
//   return Math.floor(Math.random() * 10000).padStart(4,0);
// }


function Get4Digit() {
  // Generate a random number between 1000 and 9999
  const min = 1000;
  const max = 9999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  // Ensure the code is a 4-digit number (pad with leading zeros if necessary)
  const fourDigitCode = randomNumber.toString().padStart(4, '0');
  return fourDigitCode;
}

function GetReqValues(req) {
  if (Object.keys(req.query).length > 0)
    return req.query;
  else
    return req.body;
}

function GetLevel(accessLevel) {
  let maccessName = 'Acces Name';
  if (accessLevel == 1) {
    maccessName = 'Admin';
  } else if (accessLevel == 2) {
    maccessName = 'Manager';
  } else if (accessLevel == 3) {
    maccessName = 'Supervisor';
  } else if (accessLevel == 4) {
    maccessName = 'Staff';
  }
  return maccessName;
}

module.exports = {  
  CleanText,  
  ValDate,
  ValDouble,
  ValInteger,
  ValBoolean,
  GetDate,
  GetUtcDate,
  GetUtcOffset,
  FormatNumber,
  FormatDate,
  FormatDateTime,
  Delay,
  EncodeBase64,
  DecodeBase64,
  ExtractNumbers,
  GenerateUID,
  IsNulo,
  SqlDate,
  GetReqValues,
  IsValidEmail,
  IsValidPhone,
  FormatPhone,
  Get4Digit,
  GetLevel,
};
