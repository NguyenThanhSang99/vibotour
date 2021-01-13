const getRandom = (arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) return arr;
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

const replyArray = [
  {
    title: "😋 Tôi muốn đi du lịch",
    value: "😋 Tôi muốn đi du lịch",
  },
  {
    title: "Tour bà nà 🤗",
    value: "Tour bà nà",
  },
  {
    title: "😋 Đi ăn ở đâu?",
    value: "😋 Đi ăn ở đâu?",
  },
  {
    title: "Bà Nà có gì?",
    value: "Bà Nà có gì?",
  },
  {
    title: "Tour Hội An 🤗",
    value: "Tour Hội An",
  },
  {
    title: "😍 Bánh xèo ở đâu?",
    value: "😍 Bánh xèo ở đâu?",
  },
  {
    title: "Cầu Rồng Đà Nẵng 😄",
    value: "Cầu Rồng Đà Nẵng 😄",
  },
  {
    title: "Đặt tour Đỉnh bàn cờ 🤗",
    value: "Đặt tour Đỉnh bàn cờ",
  },
  {
    title: "😋 Đói bụng quá",
    value: "😋 Đói bụng quá",
  },
  {
    title: "Đi chùa nào đẹp 🤔",
    value: "Đi chùa nào đẹp 🤔",
  },
  {
    title: "Tour Hội An 🤗",
    value: "Tour Hội An",
  },
  {
    title: "😍 Bánh xèo ở đâu?",
    value: "😍 Bánh xèo ở đâu?",
  },
  {
    title: "😉 Tạo lịch trình",
    value: "Tạo lịch trình",
  },
  {
    title: "🤔 Tạo chuyến du lịch",
    value: "Tạo chuyến du lịch",
  },
];

export { getRandom, replyArray };
