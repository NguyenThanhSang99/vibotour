import { Dijkstra } from "./Dijkstra";
//1 Ba Na - Hoi an: 44.2
//      - My Son: 50.1
//      - cù lao chàm: 61.2
//      - Chùa linh ứng: 32.8
//      - Ngu hanh son: 30.5
//      - bien my khe: 27.2
//      - Núi thần tài: 16.2
//      - asian park 25.6
//      - Vinpearland: 61.4
//2 Hoi an - My Son: 40.3
//      - cù lao chàm: 22.1
//      - Chùa linh ứng: 32.9
//      - Ngu hanh son: 18.2
//      - bien my khe: 24.2
//      - Núi thần tài: 42.9
//      - asian park: 25.3
//      - Vinpearland: 15.3
//3 My Son - cù lao chàm: 66.3  V
//      - Chùa linh ứng: 54.4   V
//      - Ngu hanh son: 41.6    V
//      - bien my khe: 45.3     V
//      - Núi thần tài: 42.4    V
//      - asian park: 41.5      V
//      - Vinpearland: 49.4     V
//4 cù lao chàm - Chùa linh ứng: 45.9   V
//      - Ngu hanh son: 31.2            V
//      - bien my khe: 37.2             V
//      - Núi thần tài: 59.3            V
//      - asian park: 38.4              V
//      - Vinpearland: 29.6             V
//5 Chùa linh ứng - Ngu hanh son:15.4   V
//      - bien my khe: 8.7              V
//      - Núi thần tài: 39.7            V
//      - asian park: 13.5              V
//      - Vinpearland: 45.7             V
//6 Ngu hanh son -bien my khe: 6.6      V
//      - Núi thần tài: 31.6            V
//      - asian park: 7.2               V
//      - Vinpearland: 30.9             V
//7 bien my khe - Núi thần tài: 31      V
//      - asian park:: 4.8              V
//      - Vinpearland: 37               V
//8 Núi thần tài - asian park: 27.3     V
//      - Vinpearland: 59.6             V
//9 asian park - Vinpearland: 39.2      V

const Array2D = [
  [0, 44.2, 50.1, 61.2, 32.8, 30.5, 27.2, 16.2, 25.6, 61.4],
  [44.2, 0, 40.3, 22.1, 32.9, 18.2, 24.2, 42.9, 25.3, 15.3],
  [50.1, 40.3, 0, 66.3, 54.4, 41.6, 45.3, 42.4, 41.5, 49.4],
  [61.2, 22.1, 66.3, 0, 45.9, 31.2, 37.2, 59.3, 38.4, 29.6],
  [32.8, 32.9, 54.4, 45.9, 0, 15.4, 8.7, 39.7, 13.5, 47.5],
  [30.5, 18.2, 41.6, 31.2, 15.4, 0, 6.6, 31.6, 7.2, 30.9],
  [27.2, 24.2, 45.3, 37.2, 8.7, 6.6, 0, 31, 4.8, 37],
  [16.2, 42.9, 42.4, 59.3, 39.7, 31.6, 31, 0, 27.3, 59.6],
  [25.6, 25.3, 41.5, 38.4, 13.5, 7.2, 4.8, 27.3, 0, 39.2],
  [61.4, 15.3, 49.4, 29.6, 47.5, 30.9, 37, 59.6, 39.2, 0],
];
const createArray2D = (arr) => {
  return new Promise((resolve) => {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      var row = [];
      for (var j = 0; j < arr.length; j++) {
        if (i === j) {
          row.push(0);
        } else {
          row.push(Array2D[arr[i].id][arr[j].id]);
        }
      }
      result.push(row);
    }
    resolve(result);
  });
};

const handleArray = (arr) => {
  return new Promise(async (resolve) => {
    var arrSort = Dijkstra(await createArray2D(arr), 0);
    var arrResult = [];
    arrSort.forEach(function (value, index) {
      arrResult.push(arr[value]);
    });
    resolve(arrResult);
  });
};
export { handleArray };
