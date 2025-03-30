// スクリプトデータを保存する配列（scripts.jsと同じデータを使用）
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
    // ローカルストレージからデータを読み込む
    loadScriptsFromStorage();
    
    // 既存のスクリプトを表示
    displayExistingScripts();
    
    // フォーム送信イベントを設定
    const form = document.getElementById('add-script-form');
    form.addEventListener('submit', handleFormSubmit);
});

// フォーム送信を処理する関数
function handleFormSubmit(event) {
    event.preventDefault();
    
    // フォームからデータを取得
    const scriptId = document.getElementById('script-id').value;
    const title = document.getElementById('script-title').value;
    const description = document.getElementById('script-description').value;
    const thumbnail = document.getElementById('script-thumbnail').value;
    const imagesString = document.getElementById('script-images').value;
    const fullDescription = document.getElementById('script-full-description').value;
    const githubUrl = document.getElementById('script-github').value;
    
    // 画像URLの配列を作成
    const images = imagesString.split(',').map(url => url.trim());
    
    // 新しいスクリプトデータを作成
    const newScript = {
        id: scriptId,
        title: title,
        description: description,
        thumbnail: thumbnail,
        images: images,
        fullDescription: fullDescription,
        githubUrl: githubUrl
    };
    
    // スクリプトを追加
    addNewScript(newScript);
    
    // フォームをリセット
    form.reset();
    
    // 成功メッセージを表示
    alert('スクリプトが正常に追加されました！');
}

// 新しいスクリプトを追加する関数
function addNewScript(scriptData) {
    // 既存のIDをチェック
    const existingScript = scriptsData.find(script => script.id === scriptData.id);
    
    if (existingScript) {
        // 既存のスクリプトを更新
        const index = scriptsData.indexOf(existingScript);
        scriptsData[index] = scriptData;
    } else {
        // 新しいスクリプトを追加
        scriptsData.push(scriptData);
    }
    
    // ローカルストレージに保存
    saveScriptsToStorage();
    
    // 既存のスクリプト一覧を更新
    displayExistingScripts();
}

// 既存のスクリプトを表示する関数
function displayExistingScripts() {
    const container = document.getElementById('existing-scripts');
    container.innerHTML = '';
    
    if (scriptsData.length === 0) {
        container.innerHTML = '<p>スクリプトがまだ追加されていません。</p>';
        return;
    }
    
    // 各スクリプトに対して項目を作成
    scriptsData.forEach(script => {
        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        
        scriptItem.innerHTML = `
            <div class="script-item-title">${script.title}</div>
            <div class="script-item-actions">
                <button class="edit-btn" data-id="${script.id}"><i class="fas fa-edit"></i> 編集</button>
                <button class="delete-btn" data-id="${script.id}"><i class="fas fa-trash"></i> 削除</button>
            </div>
        `;
        
        container.appendChild(scriptItem);
    });
    
    // 編集ボタンのイベントを設定
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scriptId = this.getAttribute('data-id');
            loadScriptForEditing(scriptId);
        });
    });
    
    // 削除ボタンのイベントを設定
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scriptId = this.getAttribute('data-id');
            deleteScript(scriptId);
        });
    });
}

// スクリプトを編集用にフォームに読み込む関数
function loadScriptForEditing(scriptId) {
    const script = scriptsData.find(s => s.id === scriptId);
    
    if (script) {
        document.getElementById('script-id').value = script.id;
        document.getElementById('script-title').value = script.title;
        document.getElementById('script-description').value = script.description;
        document.getElementById('script-thumbnail').value = script.thumbnail;
        document.getElementById('script-images').value = script.images.join(', ');
        document.getElementById('script-full-description').value = script.fullDescription;
        document.getElementById('script-github').value = script.githubUrl;
        
        // フォームにスクロール
        document.getElementById('add-script-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// スクリプトを削除する関数
function deleteScript(scriptId) {
    if (confirm('このスクリプトを削除してもよろしいですか？')) {
        // スクリプトを配列から削除
        scriptsData = scriptsData.filter(script => script.id !== scriptId);
        
        // ローカルストレージに保存
        saveScriptsToStorage();
        
        // 既存のスクリプト一覧を更新
        displayExistingScripts();
        
        // 成功メッセージを表示
        alert('スクリプトが正常に削除されました！');
    }
}

// ローカルストレージにスクリプトデータを保存する関数
function saveScriptsToStorage() {
    localStorage.setItem('scriptsData', JSON.stringify(scriptsData));
}

// ローカルストレージからスクリプトデータを読み込む関数
function loadScriptsFromStorage() {
    const storedData = localStorage.getItem('scriptsData');
    if (storedData) {
        scriptsData = JSON.parse(storedData);
    }
}
