// CSV ファイルのパス
const jc22Url = 'timetable/JC22-time.csv';
const hck01Url = 'timetable/HCK01-time.csv';

// CSV ファイルを読み込む関数
async function loadCsv(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split(',').map(time => parseInt(time));
}

// 時刻を HH:MM 形式にフォーマットする関数
function formatTime(time) {
    const hours = Math.floor(time / 100).toString().padStart(2, '0');
    const minutes = (time % 100).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 乗り換え時刻を計算する関数
async function calculateTransferTime() {
    try {
        const jc22Times = await loadCsv(jc22Url);
        const hck01Times = await loadCsv(hck01Url);

        let arrivalTimeInt = parseInt(document.getElementById('arrivalTime').value.replace(':', ''));

        if (!arrivalTimeInt) {
            const now = new Date();
            arrivalTimeInt = now.getHours() * 100 + now.getMinutes();
            document.getElementById('arrivalTime').value = formatTime(arrivalTimeInt);
        }

        let bestArrivalTime = null;
        let bestHck01Time = null;
        let minTransferTime = Infinity;

        for (const jc22Time of jc22Times) {
            if (jc22Time >= arrivalTimeInt) {
                const hck01Time = hck01Times.find(time => time >= jc22Time);
                if (hck01Time) {
                    const transferTime = hck01Time - jc22Time;
                    if (transferTime < minTransferTime) {
                        minTransferTime = transferTime;
                        bestArrivalTime = jc22Time;
                        bestHck01Time = hck01Time;
                    }
                }
            }
        }

        if (bestArrivalTime && bestHck01Time) {
          const transferTime = bestHck01Time - bestArrivalTime;
          const transferMinutes = transferTime % 100; // 乗り換え時間を分で計算

          document.getElementById('result').textContent =
              `中央線 八王子駅発: ${formatTime(bestArrivalTime)} -> 八高線発 ${formatTime(bestHck01Time)} (乗り換え時間: ${transferMinutes}分)`;
      } else {
          document.getElementById('result').textContent = '乗り換え不可';
      }
  } catch (error) {
        document.getElementById('result').textContent = 'エラー';
        console.error(error);
    }
}

// ページ読み込み時に現在時刻で計算
calculateTransferTime();

// 時刻が変更されたときに再計算
document.getElementById('arrivalTime').addEventListener('change', calculateTransferTime);