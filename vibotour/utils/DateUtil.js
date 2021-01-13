const formatDateTime = (date) => {
  if (!date) return "";
  date = new Date(date);
  var year = date.getFullYear(),
    month = date.getMonth() + 1, // months are zero indexed
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    minuteFormatted = minute < 10 ? "0" + minute : minute;

  return day + "/" + month + "/" + year + " " + hour + ":" + minuteFormatted;
};

const getDay = (numberDay, numberNight) => {
  return (
    (numberDay ? numberDay : 0) +
    " ngày, " +
    (numberNight ? numberNight : 0) +
    " đêm"
  );
};

const timeSince = (date) => {
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " năm trước";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " tháng trước";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " ngày trước";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ trước";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " phút trước";
  }
  return Math.floor(seconds) + " giây trước";
};

const addHours = (date, hour) => {
  return new Date(date.getTime() + hour * 60 * 60 * 1000);
};

const calculateNumberSessions = (timeStart, timeFinish) => {
  return new Promise((resolve) => {
    var session = 0;
    var day1 = timeStart.getDate();
    var day2 = timeFinish.getDate();
    if (day1 < day2) {
      var hour = timeFinish.getHours();
      if (hour >= 20) {
        session += 3;
      } else if (hour >= 15) {
        session += 2;
      } else if (hour >= 10) {
        session += 1;
      }
      session += 3 * (day2 - (day1 + 1));
    }
    var hour = timeStart.getHours();
    if (hour <= 9) {
      session += 3;
    } else if (hour <= 14) {
      session += 2;
    } else if (hour <= 19) {
      session += 1;
    }
    resolve(session);
  });
};

export { formatDateTime, getDay, timeSince, addHours, calculateNumberSessions };
