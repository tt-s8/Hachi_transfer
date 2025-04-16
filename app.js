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
function hckTime(timeNumber,trainNumber = 0) {
    let closestValue = null;
    let minDifference = Infinity;
    let hckIndex = null;
  
    for (let i = 0; i < hck[3].length; i++) {
      if (timeNumber <= hck[3][i]) {
        const difference = hck[3][i] - timeNumber;
        if (difference < minDifference) {
          minDifference = difference;
          closestValue = hck[3][i];
          hckIndex = i;
        }
      }
    }
    if (trainNumber !== 0){
        for (let i = 0; trainNumber - i !== 0; i++){
          hckIndex = hckIndex + 1;
          //console.log (hck[hckIndex]);
            for (let i = 1; hck[3][hckIndex] < closestValue; i++){
              //console.log (hck[hckIndex]);
              hckIndex = hckIndex + i;
              //console.log (i);
            }
            closestValue = hck[3][hckIndex];
   }
  }
  //中央線を求める
    for (let i = jc[8].length - 2; 0 < i ; i--) {
      ArriveTime = jc[8][i]
      depTime = jc[7][i]
      const timeDifference = ArriveTime - depTime;
      if (5 < timeDifference && timeDifference < 30) {
        ArriveTime = depTime + 4;
      }
      if (0 < ArriveTime && ArriveTime < closestValue && 0 < depTime){
            jcIndex = i
            console.log(i)
            console.log((depTime))
            break;
        }
    }
    //const timeDifference = depTime - ArriveTime;//もし八王子駅で長時間停車する場合は、駅間を4分とし、それを到着時刻とする
        //if (timeDifference > 5) {
            //ArriveTime = depTime + 4;
        //}

    if (depTime < timeNumber) {
        // depTime が timeNumber より小さい場合は、trainNumber を増やしてもう一度関数を呼び出す
        return hckTime(timeNumber, trainNumber + 1);
    } else {
        return { hcktime: closestValue, hckindex: hckIndex, jc8Time: ArriveTime, jc7Time: depTime, jcIndex: jcIndex };
    }
}


console.log(jc[8])
//八駅到着の中央線到着時刻関数
function jcArrive(closestValue,jc8,jc7){
  for (let i = jc8.length - 2; 0 < i ; i--) {
    if (0 < jc8[i] && jc8[i] < closestValue && 0 < jc7[i]){
      ArriveTime = jc8[i]
      jcIndex = i
      console.log(i)
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

let hckTimeValue = hckTime(timeNumber,0).hcktime;
let hckTimeValue1 = hckTime(timeNumber,1).hcktime;
let hckTimeValue2 = hckTime(timeNumber,2).hcktime;
console.log(hckTimeValue)
if (hckTimeValue == null) {
  alert("八高線は本日の運行を終了しました");
}

//中央線の時刻表示
let jc8TimeValue = hckTime(timeNumber,0).jc8Time;
let jc7TimeValue = hckTime(timeNumber,0).jc7Time;
console.log(jc7TimeValue)

//HTMLに反映
function timeHtml(){
  const jctimeElement = document.getElementById('jctime');
  jctimeElement.textContent = `${timeConvert(jc7TimeValue)}→${timeConvert(jc8TimeValue)}`;//八王子駅のインデックス位置を基に西八の時刻を表示
  const timeElement = document.getElementById('time');
  timeElement.innerHTML = `先発: ${timeConvert(hckTimeValue)}<br>次発:${timeConvert(hckTimeValue1)}<br>次々発:${timeConvert(hckTimeValue2)}`;
}

timeHtml();



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
hckTimeValue = hckTime(timeNumber,trainNumber).hcktime;
hckTimeValue1 = hckTime(timeNumber,trainNumber + 1).hcktime;
hckTimeValue2 = hckTime(timeNumber,trainNumber + 2).hcktime;
if (hckTimeValue == null ) {
  hckTimeValue = ("八高線の終電後です");
}
jc8TimeValue = hckTime(timeNumber,trainNumber).jc8Time;
jc7TimeValue = hckTime(timeNumber,trainNumber).jc7Time;
console.log(jc7TimeValue)
// HTMLに表示
timeHtml();
});

