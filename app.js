// CSV ファイルのパス
const hckUrl = 'timetable/HCK.csv';
const jcUrl = 'timetable/JC.csv';

//getCsv関数
function getCsv(url){
    //CSVファイルを文字列で取得。
    var txt = new XMLHttpRequest();
    txt.open('get', url, false);
    txt.send();
  
    //改行ごとに配列化
    var arr = txt.responseText.split('\n');
  
    //1次元配列を2次元配列に変換
    var res = [];
    for(var i = 0; i < arr.length; i++){
      //空白行が出てきた時点で終了
      if(arr[i] == '') break;
      
      //","ごとに配列化
      res[i] = arr[i].split(',');
  
      for(var i2 = 0; i2 < res[i].length; i2++){
        //数字の場合は「"」を削除
        if(res[i][i2].match(/\-?\d+(.\d+)?(e[\+\-]d+)?/)){
          res[i][i2] = parseFloat(res[i][i2].replace('"', ''));
        }
      }
    }
  
    return res;
  }
  
  //hck,JCの配列化
const hck = getCsv(hckUrl);
const jc = getCsv(jcUrl);

//現在時刻の取得
function getCurrentTimeAsNumber() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return parseInt(hours*100 + minutes);
  }
  let timeNumber = getCurrentTimeAsNumber();
  console.log (timeNumber)

//現在時刻から最速の八高線のn本後の八高線を算出(デフォルト0本目)
function hckTime(timeNumber,hck,trainNumber = 0) {
    let closestValue = null;
    let minDifference = Infinity;
    let hckIndex = null;
  
    for (let i = 0; i < hck.length; i++) {
      if (timeNumber <= hck[i]) {
        const difference = hck[i] - timeNumber;
        if (difference < minDifference) {
          minDifference = difference;
          closestValue = hck[i];
          hckIndex = i;
        }
      }

    }
    if (trainNumber !== 0){
        for (let i = 0; trainNumber - i !== 0; i++){
          hckIndex = hckIndex + 1;
          //console.log (hck[hckIndex]);
            for (let i = 1; hck[hckIndex] < closestValue; i++){
              //console.log (hck[hckIndex]);
              hckIndex = hckIndex + i;
              //console.log (i);
            }
            closestValue = hck[hckIndex];
  }
}
    return closestValue;
}
hckTimeValue = hckTime(timeNumber, hck[3],0);



// HTML の要素を取得し、hckTimeValue を表示
const timeElement = document.getElementById('time');
timeElement.textContent = hckTimeValue;
console.log(hckTimeValue);


//確認
  //let foo = jc[8][4]+10
  //console.log (hck[3][2]);//hck(八高線)では、[3]に八王子駅の発車時刻
  //console.log (jc[8][4]);//JC(中央線)では、[8]に八王子駅の発車時刻、[7]に西八王子駅の発車時刻がくる
  //console.log (foo)

// ボタン要素を取得
const getTimeButton = document.getElementById('calculateButton');

// 結果を表示する要素を取得
const resultDiv = document.getElementById('result');

// ボタンがクリックされたときの処理
getTimeButton.addEventListener('click', function() {
  // 時刻入力要素の値を取得
  const nowTime = document.getElementById('nowTime').value;

  // 結果を表示
  //resultDiv.textContent = '選択された時刻: ' + nowTime;

  // nowTimeをJavaScriptで利用する
  console.log(nowTime); // コンソールに時刻を出力
  // ここでarrivalTimeを使って他の処理を行う

  // 時刻を数値に変換
  timeNumber = parseInt(nowTime.replace(':', ''));

  // timeNumberをJavaScriptで利用する
  //console.log(timeNumber); // コンソールに数値を出力
  // ここでtimeNumberを使って他の処理を行う

 // hckTimeValue = hckTime(nowTime, hck[3],trainNumber);
  // HTML の要素を取得し、hckTimeValue を表示
// trainNumberSelect 要素を取得
const trainNumberSelect = document.getElementById('trainNumberSelect');
// 選択された値を trainNumber 変数に格納
const trainNumber = parseInt(trainNumberSelect.value);
hckTimeValue = hckTime(timeNumber, hck[3],trainNumber);
console.log (trainNumber)
// HTML の要素を取得し、hckTimeValue を表示
const timeElement = document.getElementById('time');
timeElement.textContent = hckTimeValue;
console.log(hckTimeValue);
});
