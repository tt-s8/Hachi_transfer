// それぞれのCSVファイルをfetchで読み込む関数
function loadCSV(filePath) {
    return fetch(filePath)
        .then(response => response.text())  // レスポンスをテキストとして取得
        .then(data => {
            const rows = data.split("\n");
            const timeData = rows.map(row => row.split(",").map(item => parseInt(item, 10)));
            return timeData;  // 時刻データを返す
        })
        .catch(error => {
            console.error('CSVファイルの読み込みエラー:', error);
        });
}

// 各CSVファイルを読み込む
const hck01 = loadCSV('timetable/HCK01-time.csv');
const jc22 = loadCSV('timetable/JC22-time.csv');
const jc23 = loadCSV('timetable/JC23-time.csv');

// ログ 実装時はコメントアウト
Promise.all([hck01, jc22, jc23]).then(data => {
    console.log('HCK01-time:', data[0]);
    console.log('JC22-time:', data[1]);
    console.log('JC23-time:', data[2]);
});

// 初期表示で現在時刻を設定する関数
function setDefaultTime() {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const defaultTime = `${hours}:${minutes}`;
    document.getElementById('time-input').value = defaultTime;  // 現在時刻を入力欄にセット
}

// ページ読み込み時にデフォルト時刻をセット
setDefaultTime();

// 時刻が変更された場合の処理
document.getElementById('time-input').addEventListener('input', function() {
    const newTime = this.value;
    console.log('変更された時刻:', newTime);  // 新しい時刻をログに出力
});

