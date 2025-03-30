// スクリプトデータを保存する配列
// 実際の環境では、このデータはJSONファイルから読み込むことをお勧めします
let scriptsData = [
    {
        id: "script1",
        title: "ファイル整理ツール",
        description: "指定したフォルダ内のファイルを種類ごとに自動で整理するスクリプトです。",
        thumbnail: "img/thumbnails/2.png",
        images: ["img/screenshots/2.png", "img/screenshots/6.png"],
        fullDescription: "このスクリプトは、指定したフォルダ内のファイルを拡張子ごとに自動で分類し、整理します。画像、ドキュメント、音楽、動画などのカテゴリごとにサブフォルダを作成し、対応するファイルを移動させます。バッチ処理にも対応しており、大量のファイルも効率的に整理できます。",
        githubUrl: "https://github.com/username/file-organizer"
    },
    {
        id: "script2",
        title: "画像一括リサイズツール",
        description: "複数の画像を一度に指定したサイズにリサイズするスクリプトです。",
        thumbnail: "img/thumbnails/2.png",
        images: ["img/screenshots/2.png", "img/screenshots/6.png"],
        fullDescription: "このツールを使用すると、フォルダ内の複数の画像を一括でリサイズすることができます。幅と高さを指定するか、比率を維持したままスケーリングするかを選択できます。また、出力形式やクオリティの設定も可能です。ウェブサイト用の画像の準備や、SNSへの投稿用画像の作成に最適です。",
        githubUrl: "https://github.com/username/image-resizer"
    },
    {
        id: "script3",
        title: "PDFマージツール",
        description: "複数のPDFファイルを1つのファイルに結合するシンプルなツールです。",
        thumbnail: "img/thumbnails/2.png",
        images: ["img/screenshots/2.png", "img/screenshots/6.png"],
        fullDescription: "このスクリプトを使用すると、複数のPDFファイルを1つのドキュメントに簡単に結合することができます。ドラッグ＆ドロップインターフェースで使いやすく、ファイルの順序を自由に並べ替えることも可能です。パスワード保護されたPDFにも対応しており、結合後のファイルにもパスワード設定ができます。",
        githubUrl: "https://github.com/username/pdf-merger"
    }
];

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // スクリプトカードを生成して表示
    displayScriptCards();
});

// スクリプトカードを生成して表示する関数
function displayScriptCards() {
    const scriptGrid = document.getElementById('script-grid');
    
    // 既存のカードをクリア
    scriptGrid.innerHTML = '';
    
    // 各スクリプトデータに対してカードを生成
    scriptsData.forEach(script => {
        const card = createScriptCard(script);
        scriptGrid.appendChild(card);
    });
    
    // デバッグ情報を表示
    console.log('スクリプトデータ:', scriptsData);
}

// スクリプトカードのHTML要素を生成する関数
function createScriptCard(script) {
    const card = document.createElement('div');
    card.className = 'script-card';
    
    // 説明文の改行を<br>タグに変換
    const formattedDescription = script.description.replace(/\n/g, '<br>');
    
    // カード内のHTMLを生成
    card.innerHTML = `
        <div class="script-card-img-container">
            <img src="${script.thumbnail}" alt="${script.title}" class="script-card-img">
        </div>
        <div class="script-card-content">
            <h3 class="script-card-title">${script.title}</h3>
            <p class="script-card-description">${formattedDescription}</p>
            <a href="script.html?id=${script.id}" class="script-card-link">詳細を見る</a>
        </div>
    `;
    
    return card;
}

// 新しいスクリプトを追加する関数（管理画面用）
function addNewScript(scriptData) {
    // 新しいスクリプトデータを配列に追加
    scriptsData.push(scriptData);
    
    // ローカルストレージに保存（実際の環境ではサーバーに保存する方が良い）
    localStorage.setItem('scriptsData', JSON.stringify(scriptsData));
    
    // 画面を更新
    displayScriptCards();
}

// ローカルストレージからスクリプトデータを読み込む関数
function loadScriptsFromStorage() {
    const storedData = localStorage.getItem('scriptsData');
    if (storedData) {
        scriptsData = JSON.parse(storedData);
    }
}

// 初期化時にローカルストレージからデータを読み込む
loadScriptsFromStorage();
