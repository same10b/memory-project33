let displayBlocks = []; // {x, y, color} を要素にもつ配列。1文字につき1ブロック
let alignedBlocks = []; // 整列したブロック
let randomBlocks = [];  // ランダムに配置されたブロック
let currentText = "";   // 現在のテキスト
let lastText = "";      // 前回のテキスト
let blockSize = 10;     // ブロックのサイズ
let blockSpacing = 15;  // ブロックの間隔
let enterKeyPressCount = 0; // エンターキーが押された回数

function setup() {
  // 初期キャンバスサイズを4:3のアスペクト比に設定
  let canvasWidth = windowWidth * 0.8; // 幅の80%を使用
  let canvasHeight = (canvasWidth * 3) / 4; // 4:3のアスペクト比で高さを設定
  createCanvas(canvasWidth, canvasHeight);
  
  const inputArea = document.getElementById('inputText');
  
  // 入力された文字をリアルタイムで反映
  inputArea.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
      currentText += e.key;  // テキストをローカルで追記
      updateTextDisplay();
    } else if (e.key === 'Backspace') {
      currentText = currentText.slice(0, -1); // バックスペース処理
      updateTextDisplay();
 
    }
  });

  // モバイルでの「完了」ボタンや「送信」ボタンを押されたときにも対応
  inputArea.addEventListener('blur', () => {
    // ユーザーがテキストボックスを離れた場合、テキストをリセットする
    enterKeyPressCount = 0;
    if (currentText.length > 0) {
      document.getElementById('inputText').value = ''; // テキストボックスをクリア
      currentText = ''; // テキスト内容をリセット
    }
  });

  // キャンバスを中央に配置
  const canvas = select('canvas');
  canvas.style('position', 'absolute');
  canvas.style('top', '50%');
  canvas.style('left', '50%');
  canvas.style('transform', 'translate(-50%, -50%)');
}

function draw() {
  background(240);

  // 整列したブロックを描画
  noStroke();
  for (let block of alignedBlocks) {
    fill(block.color);
    rect(block.x, block.y, blockSize, blockSize);
  }

  // ランダム配置されたブロックを描画
  for (let block of randomBlocks) {
    fill(block.color);
    rect(block.x, block.y, blockSize, blockSize);
  }
}

// ウィンドウがリサイズされたときにキャンバスのサイズも調整
function windowResized() {
  let canvasWidth = windowWidth * 0.8; // 幅の80%を使用
  let canvasHeight = (canvasWidth * 3) / 4; // 4:3のアスペクト比で高さを設定
  resizeCanvas(canvasWidth, canvasHeight); // 再計算されたサイズでリサイズ
  
  const canvas = select('canvas');
  canvas.style('top', '50%');
  canvas.style('left', '50%');
  canvas.style('transform', 'translate(-50%, -50%)');
}

function updateTextDisplay() {
  // 新しい文字が追加されたとき
  const newText = currentText.slice(lastText.length);
  addBlocksForText(newText);
  
  lastText = currentText;

  // 文字数が100に達したら整列
  if (currentText.length >= 100) {
    if (currentText.length % 100 === 0) {
      // 100文字ごとに整列
      arrangeBlocksInGrid();
    }
  }
}

// 新規テキスト部分をブロックとして追加
function addBlocksForText(textSegment) {
  for (let ch of textSegment) {
    let r = random(50, 200);
    let g = random(50, 200);
    let b = random(50, 200);

    let x = random(width);
    let y = random(height);

    randomBlocks.push({
      x: x,
      y: y,
      color: color(r, g, b)
    });
  }
}

function arrangeBlocksInGrid() {
  let cols = Math.floor(width / blockSize); // 列数（幅に合わせて計算）
  let rows = Math.floor(height / blockSize); // 行数（高さに合わせて計算)
  
  let cellW = width / cols; // セルの幅（ブロックサイズに合わせて調整）
  let cellH = height / rows; // セルの高さ（ブロックサイズに合わせて調整）

  // ランダム配置されたブロックを整列
  for (let i = 0; i < randomBlocks.length; i++) {
    let c = i % cols; // 列の計算
    let r = Math.floor(i / cols); // 行の計算
    randomBlocks[i].x = c * cellW; // セル幅に合わせて配置
    randomBlocks[i].y = r * cellH; // セル高さに合わせて配置
  }

  // 整列されたブロックを保存
  alignedBlocks = [...randomBlocks];
}
