// スクリプトデータを保存する配列（scripts.jsと同じデータを使用）
// 実際の環境では、このデータはJSONファイルから読み込むことをお勧めします
let scriptsData = [
    {
        id: "script1",
        title: "ファイル整理ツール",
        description: "指定したフォルダ内のファイルを種類ごとに自動で整理するスクリプトです。",
        thumbnail: "img/thumbnails/file-organizer.jpg",
        images: ["img/screenshots/2.png", "img/screenshots/6.png"],
        fullDescription: "このスクリプトは、指定したフォルダ内のファイルを拡張子ごとに自動で分類し、整理します。画像、ドキュメント、音楽、動画などのカテゴリごとにサブフォルダを作成し、対応するファイルを移動させます。バッチ処理にも対応しており、大量のファイルも効率的に整理できます。",
        githubUrl: "https://github.com/username/file-organizer"
    },
    {
        id: "script2",
        title: "画像一括リサイズツール",
        description: "複数の画像を一度に指定したサイズにリサイズするスクリプトです。",
        thumbnail: "img/thumbnails/image-resizer.jpg",
        images: ["img/screenshots/2.png", "img/screenshots/6.png"],
        fullDescription: "このツールを使用すると、フォルダ内の複数の画像を一括でリサイズすることができます。幅と高さを指定するか、比率を維持したままスケーリングするかを選択できます。また、出力形式やクオリティの設定も可能です。ウェブサイト用の画像の準備や、SNSへの投稿用画像の作成に最適です。",
        githubUrl: "https://github.com/username/image-resizer"
    },
    {
        id: "script3",
        title: "PDFマージツール",
        description: "複数のPDFファイルを1つのファイルに結合するシンプルなツールです。",
        thumbnail: "img/thumbnails/pdf-merger.jpg",
        images: ["img/screenshots/2.png", "img/screenshots/6.png"],
        fullDescription: "このスクリプトを使用すると、複数のPDFファイルを1つのドキュメントに簡単に結合することができます。ドラッグ＆ドロップインターフェースで使いやすく、ファイルの順序を自由に並べ替えることも可能です。パスワード保護されたPDFにも対応しており、結合後のファイルにもパスワード設定ができます。",
        githubUrl: "https://github.com/username/pdf-merger"
    }
];

// 現在表示中の画像インデックス
let currentImageIndex = 0;

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // URLからスクリプトIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const scriptId = urlParams.get('id');
    
    // ローカルストレージからデータを読み込む
    loadScriptsFromStorage(scriptId);
});

// スクリプト詳細を表示する関数
function displayScriptDetail(scriptId) {
    if (!scriptId) {
        // URLからスクリプトIDを取得（関数が直接呼び出された場合のフォールバック）
        const urlParams = new URLSearchParams(window.location.search);
        scriptId = urlParams.get('id');
    }
    
    if (!scriptId) {
        // IDが指定されていない場合はトップページにリダイレクト
        window.location.href = 'index.html';
        return;
    }
    
    // スクリプトIDに対応するデータを検索
    const script = scriptsData.find(s => s.id === scriptId);
    
    if (script) {
        // タイトルを設定
        document.title = `${script.title} - Scripts Hub`;
        document.getElementById('script-title').textContent = script.title;
        
        // 画像ギャラリーを生成
        createImageGallery(script.images);
        
        // 説明文を設定（改行を<br>タグに変換して表示）
        const descriptionElement = document.getElementById('script-description');
        // 改行をHTMLの<br>タグに変換
        const formattedDescription = script.fullDescription.replace(/\n/g, '<br>');
        descriptionElement.innerHTML = `<p>${formattedDescription}</p>`;
        
        // GitHubリポジトリへのリンクを設定
        const githubLink = document.getElementById('github-repo-link');
        githubLink.href = script.githubUrl;
    } else {
        console.error('指定されたIDのスクリプトが見つかりません:', scriptId);
        // スクリプトが見つからない場合はトップページにリダイレクト
        window.location.href = 'index.html';
    }
}

// 画像ギャラリーを生成する関数
function createImageGallery(images) {
    if (!images || images.length === 0) {
        return;
    }
    
    // メイン画像コンテナを取得
    const mainImageContainer = document.getElementById('main-image');
    // サムネイルコンテナを取得
    const thumbnailContainer = document.getElementById('thumbnail-container');
    
    // コンテナをクリア
    mainImageContainer.innerHTML = '';
    thumbnailContainer.innerHTML = '';
    
    // 最初の画像をメイン画像として表示
    mainImageContainer.innerHTML = `<img src="${images[0]}" alt="スクリプトのスクリーンショット">`;
    
    // サムネイル画像を生成
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="サムネイル ${index + 1}">`;
        
        // サムネイルクリック時の処理
        thumbnail.addEventListener('click', function() {
            // 現在のアクティブなサムネイルを非アクティブにする
            const activeThumbnail = thumbnailContainer.querySelector('.thumbnail.active');
            if (activeThumbnail) {
                activeThumbnail.classList.remove('active');
            }
            
            // クリックされたサムネイルをアクティブにする
            this.classList.add('active');
            
            // メイン画像を更新
            mainImageContainer.innerHTML = `<img src="${image}" alt="スクリプトのスクリーンショット">`;
            
            // 現在の画像インデックスを更新
            currentImageIndex = index;
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // デバッグ情報を表示
    console.log('画像パス:', images);
}

// ローカルストレージからスクリプトデータを読み込む関数
function loadScriptsFromStorage(scriptId) {
    // まずローカルストレージから読み込む
    const storedData = localStorage.getItem('scriptsData');
    if (storedData) {
        scriptsData = JSON.parse(storedData);
        displayScriptDetail(scriptId);
        return;
    }
    
    // ローカルストレージにデータがない場合は、JSONファイルから読み込む
    fetch('data/scripts.json?' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('JSONファイルの読み込みに失敗しました');
            }
            return response.json();
        })
        .then(data => {
            scriptsData = data;
            // 読み込んだデータを表示
            displayScriptDetail(scriptId);
            console.log('JSONファイルからデータを読み込みました:', data);
        })
        .catch(error => {
            console.error('データの読み込みエラー:', error);
            // エラーの場合はデフォルトデータを使用
            displayScriptDetail(scriptId);
        });
}
