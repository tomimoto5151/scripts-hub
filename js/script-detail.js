// スクリプトデータを保存する配列（scripts.jsと同じデータを使用）
// 実際の環境では、このデータはJSONファイルから読み込むことをお勧めします
let scriptsData = [
    {
        id: "script1",
        title: "ファイル整理ツール",
        description: "指定したフォルダ内のファイルを種類ごとに自動で整理するスクリプトです。",
        thumbnail: "img/thumbnails/file-organizer.jpg",
        images: ["img/screenshots/file-organizer-1.jpg", "img/screenshots/file-organizer-2.jpg"],
        fullDescription: "このスクリプトは、指定したフォルダ内のファイルを拡張子ごとに自動で分類し、整理します。画像、ドキュメント、音楽、動画などのカテゴリごとにサブフォルダを作成し、対応するファイルを移動させます。バッチ処理にも対応しており、大量のファイルも効率的に整理できます。",
        githubUrl: "https://github.com/username/file-organizer"
    },
    {
        id: "script2",
        title: "画像一括リサイズツール",
        description: "複数の画像を一度に指定したサイズにリサイズするスクリプトです。",
        thumbnail: "img/thumbnails/image-resizer.jpg",
        images: ["img/screenshots/image-resizer-1.jpg", "img/screenshots/image-resizer-2.jpg"],
        fullDescription: "このツールを使用すると、フォルダ内の複数の画像を一括でリサイズすることができます。幅と高さを指定するか、比率を維持したままスケーリングするかを選択できます。また、出力形式やクオリティの設定も可能です。ウェブサイト用の画像の準備や、SNSへの投稿用画像の作成に最適です。",
        githubUrl: "https://github.com/username/image-resizer"
    },
    {
        id: "script3",
        title: "PDFマージツール",
        description: "複数のPDFファイルを1つのファイルに結合するシンプルなツールです。",
        thumbnail: "img/thumbnails/pdf-merger.jpg",
        images: ["img/screenshots/pdf-merger-1.jpg", "img/screenshots/pdf-merger-2.jpg"],
        fullDescription: "このスクリプトを使用すると、複数のPDFファイルを1つのドキュメントに簡単に結合することができます。ドラッグ＆ドロップインターフェースで使いやすく、ファイルの順序を自由に並べ替えることも可能です。パスワード保護されたPDFにも対応しており、結合後のファイルにもパスワード設定ができます。",
        githubUrl: "https://github.com/username/pdf-merger"
    }
];

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // URLからスクリプトIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const scriptId = urlParams.get('id');
    
    // スクリプトIDに対応するデータを表示
    if (scriptId) {
        displayScriptDetail(scriptId);
    } else {
        // IDが指定されていない場合はトップページにリダイレクト
        window.location.href = 'index.html';
    }
});

// スクリプト詳細を表示する関数
function displayScriptDetail(scriptId) {
    // スクリプトIDに対応するデータを検索
    const script = scriptsData.find(s => s.id === scriptId);
    
    if (script) {
        // タイトルを設定
        document.title = `${script.title} - Tomimoto Hidetoshi`;
        document.getElementById('script-title').textContent = script.title;
        
        // スクリプト詳細コンテンツを生成
        const scriptContent = document.getElementById('script-content');
        
        // 画像ギャラリーを生成
        const imagesHTML = createImagesGallery(script.images);
        
        // 詳細説明を追加
        const descriptionHTML = `
            <div class="script-description">
                <p>${script.fullDescription}</p>
            </div>
        `;
        
        // コンテンツをHTMLに設定
        scriptContent.innerHTML = imagesHTML + descriptionHTML;
        
        // GitHubリポジトリへのリンクを設定
        const githubLink = document.getElementById('github-repo-link');
        githubLink.href = script.githubUrl;
    } else {
        // スクリプトが見つからない場合はトップページにリダイレクト
        window.location.href = 'index.html';
    }
}

// 画像ギャラリーを生成する関数
function createImagesGallery(images) {
    if (!images || images.length === 0) {
        return '';
    }
    
    let imagesHTML = '<div class="script-images">';
    
    images.forEach(image => {
        imagesHTML += `<img src="${image}" alt="スクリプトのスクリーンショット" class="script-image">`;
    });
    
    imagesHTML += '</div>';
    
    return imagesHTML;
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
