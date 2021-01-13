// Check number of sessions in the schedule is valid or not
const checkTime = (arr, session) => {
  return new Promise(async (resolve) => {
    var sumSession = 0;
    arr.forEach(function (value, index) {
      sumSession += value.session;
    });
    resolve(sumSession < session);
  });
};
export { checkTime };
