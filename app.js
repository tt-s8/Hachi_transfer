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

  // 現在時刻を取得
const now = new Date();
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const currentTime = `${hours}:${minutes}`;
let timeNumber = parseInt(hours + minutes);
console.log (timeNumber)

// input 要素を取得し、現在時刻を設定
const timeInput = document.getElementById('nowTime');
timeInput.value = currentTime;

console.log(hck[1][3])
//現在時刻から最速の八高線のn本後の八高線を算出する関数(デフォルト0本目)
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
  return { time: closestValue, index: hckIndex };
//上記をコメントアウトする場合は、これを有効
//    return closestValue;
}

console.log(jc[8])
//八駅到着の中央線到着時刻関数
function jcArrive(closestValue,jc){
  for (let i = jc.length - 2; 0 < i ; i--) {
    console.log(closestValue)
    if (0 < jc[i] && jc[i] < closestValue){
      ArriveTime = jc[i]
      jcIndex = i
      return { time: ArriveTime, index: jcIndex };
    }
  }
}

//時間4桁をxx:xxに変換の関数
function timeConvert(closestValue){
  const hours = Math.floor(closestValue / 100).toString().padStart(2, '0');
  const minutes = (closestValue % 100).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

let hckTimeValue = hckTime(timeNumber, hck[3],0).time;
let hckTimeValue1 = hckTime(timeNumber, hck[3],1).time;
let hckTimeValue2 = hckTime(timeNumber, hck[3],2).time;
console.log(hckTimeValue)
if (hckTimeValue == null) {
  alert("八高線は本日の運行を終了しました");
}

//中央線の時刻表示
let jcTimeValue = jcArrive(hckTimeValue,jc[8]).time;
console.log(jcTimeValue)
const jctimeElement = document.getElementById('jctime');
jctimeElement.textContent = `${timeConvert(jc[7][jcArrive(hckTimeValue,jc[7]).index])}→${timeConvert(jcTimeValue)}`;//八王子駅のインデックス位置を基に西八の時刻を表示

// HTML の要素を取得し、hckTimeValue を表示
const timeElement = document.getElementById('time');
timeElement.textContent = `${timeConvert(hckTimeValue)}\n${timeConvert(hckTimeValue1)}\n${timeConvert(hckTimeValue2)}`;



//確認
  //let foo = jc[8][4]+10
  //console.log (hck[3][2]);//hck(八高線)では、[3]に八王子駅の発車時刻
  //console.log (jc[8][4]);//JC(中央線)では、[8]に八王子駅の発車時刻、[7]に西八王子駅の発車時刻がくる
  //console.log (foo)

// ボタン要素を取得
const getTimeButton = document.getElementById('calculateButton');

// 結果を表示する要素を取得
//const resultDiv = document.getElementById('result');

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
console.log(timeNumber)
hckTimeValue = hckTime(timeNumber, hck[3],trainNumber).time;//hckTimeValue = hckTime(timeNumber, hck[3],0).time;
hckTimeValue1 = hckTime(timeNumber, hck[3],trainNumber + 1).time;
hckTimeValue2 = hckTime(timeNumber, hck[3],trainNumber + 2).time;
if (hckTimeValue == null ) {
  hckTimeValue = ("八高線の終電後です");
}
jcTimeValue = jcArrive(hckTimeValue,jc[8]).time;
console.log(jcTimeValue)
// HTML の要素を取得し、hckTimeValue を表示
const timeElement = document.getElementById('time');
timeElement.textContent = `${timeConvert(hckTimeValue)}\n${timeConvert(hckTimeValue1)}\n${timeConvert(hckTimeValue2)}`;
const jctimeElement = document.getElementById('jctime');
jctimeElement.textContent = `${timeConvert(jc[7][jcArrive(hckTimeValue,jc[7]).index])}→${timeConvert(jcTimeValue)}`;
});

