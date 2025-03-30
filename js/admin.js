// スクリプトデータを保存する配列（scripts.jsと同じデータを使用）
let scriptsData = [
    {
        id: "script1",
        title: "ファイル整理ツール",
        description: "指定したフォルダ内のファイルを種類ごとに自動で整理するスクリプトです。",
        thumbnail: "img/thumbnails/file-organizer.jpg",
        images: ["img/screenshots/file-organizer-1.jpg", "img/screenshots/file-organizer-2.jpg"],
        fullDescription: "このスクリプトは、指定したフォルダ内のファイルを拡張子ごとに自動で分類し、整理します。画像、ドキュメント、音楽、動画などのカテゴリごとにサブフォルダを作成し、対応するファイルを移動させます。バッチ処理にも対応しており、大量のファイルも効率的に整理できます。",
        githubUrl: "https://github.com/username/file-organizer",
        targetApps: ["photoshop", "chrome"]
    },
    {
        id: "script2",
        title: "画像一括リサイズツール",
        description: "複数の画像を一度に指定したサイズにリサイズするスクリプトです。",
        thumbnail: "img/thumbnails/image-resizer.jpg",
        images: ["img/screenshots/image-resizer-1.jpg", "img/screenshots/image-resizer-2.jpg"],
        fullDescription: "このツールを使用すると、フォルダ内の複数の画像を一括でリサイズすることができます。幅と高さを指定するか、比率を維持したままスケーリングするかを選択できます。また、出力形式やクオリティの設定も可能です。ウェブサイト用の画像の準備や、SNSへの投稿用画像の作成に最適です。",
        githubUrl: "https://github.com/username/image-resizer",
        targetApps: ["photoshop", "blender"]
    },
    {
        id: "script3",
        title: "PDFマージツール",
        description: "複数のPDFファイルを1つのファイルに結合するシンプルなツールです。",
        thumbnail: "img/thumbnails/pdf-merger.jpg",
        images: ["img/screenshots/pdf-merger-1.jpg", "img/screenshots/pdf-merger-2.jpg"],
        fullDescription: "このスクリプトを使用すると、複数のPDFファイルを1つのドキュメントに簡単に結合することができます。ドラッグ＆ドロップインターフェースで使いやすく、ファイルの順序を自由に並べ替えることも可能です。パスワード保護されたPDFにも対応しており、結合後のファイルにもパスワード設定ができます。",
        githubUrl: "https://github.com/username/pdf-merger",
        targetApps: ["chrome", "figma"]
    }
];

// 対象アプリの情報
const targetApps = [
    { id: "photoshop", name: "Photoshop", icon: "img/app-icons/photoshop.png" },
    { id: "blender", name: "Blender", icon: "img/app-icons/blender.png" },
    { id: "figma", name: "Figma", icon: "img/app-icons/figma.png" },
    { id: "chrome", name: "Chrome", icon: "img/app-icons/chrome.png" }
];

// 管理者パスワード
const ADMIN_PASSWORD = "nekosan";

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', function() {
    // ログイン状態をチェック
    checkLoginStatus();
    
    // ログインフォームのイベントリスナーを設定
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // スクリプト追加フォームのイベントリスナーを設定
    document.getElementById('add-script-form').addEventListener('submit', handleFormSubmit);
    
    // JSONダウンロードボタンのイベントリスナーを設定
    const downloadJsonBtn = document.getElementById('download-json-btn');
    if (downloadJsonBtn) {
        downloadJsonBtn.addEventListener('click', downloadJsonFile);
    }
    
    // ローカルストレージからデータを読み込む
    loadScriptsFromStorage();
});

// JSONファイルをダウンロードする関数
function downloadJsonFile() {
    const dataStr = JSON.stringify(scriptsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const dataUrl = URL.createObjectURL(dataBlob);
    
    // ダウンロードリンクを作成して自動的にクリック
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'scripts.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // 成功メッセージを表示
    alert('JSONファイルがダウンロードされました。このファイルを「data/scripts.json」として保存し、GitHubにアップロードしてください。');
}

// ログイン状態をチェックする関数
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // ログイン済みの場合は管理画面を表示
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        
        // 既存のスクリプトを表示
        displayExistingScripts();
    }
}

// ログイン処理を行う関数
function handleLogin(event) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('password');
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === ADMIN_PASSWORD) {
        // パスワードが正しい場合
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // ログイン画面を非表示にし、管理画面を表示
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        
        // 既存のスクリプトを表示
        displayExistingScripts();
    } else {
        // パスワードが間違っている場合
        alert('パスワードが正しくありません。');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// フォーム送信を処理する関数
function handleFormSubmit(event) {
    event.preventDefault();
    
    // フォームからデータを取得
    const scriptId = document.getElementById('script-id').value;
    const title = document.getElementById('script-title').value;
    const description = document.getElementById('script-description').value;
    const thumbnailInput = document.getElementById('script-thumbnail').value;
    const imagesString = document.getElementById('script-images').value;
    const fullDescription = document.getElementById('script-full-description').value;
    const githubUrl = document.getElementById('script-github').value;
    
    // 対象アプリの選択状態を取得
    const targetAppCheckboxes = document.querySelectorAll('input[name="target-apps"]:checked');
    const selectedApps = Array.from(targetAppCheckboxes).map(checkbox => checkbox.value);
    
    // サムネイル画像のパスを自動的に追加
    const thumbnail = thumbnailInput.startsWith('img/') ? thumbnailInput : `img/thumbnails/${thumbnailInput}`;
    
    // 画像URLの配列を作成し、パスを自動的に追加
    const images = imagesString.split(',').map(url => {
        url = url.trim();
        return url.startsWith('img/') ? url : `img/screenshots/${url}`;
    });
    
    // 新しいスクリプトデータを作成
    const newScript = {
        id: scriptId,
        title: title,
        description: description,
        thumbnail: thumbnail,
        images: images,
        fullDescription: fullDescription,
        githubUrl: githubUrl,
        targetApps: selectedApps
    };
    
    // スクリプトを追加
    addNewScript(newScript);
    
    // フォームをリセット
    event.target.reset();
    
    // 対象アプリのチェックボックスをリセット
    targetAppCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
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
    scriptsData.forEach((script, index) => {
        const scriptItem = document.createElement('div');
        scriptItem.className = 'script-item';
        
        // 上下ボタンの無効化状態を設定
        const isFirst = index === 0;
        const isLast = index === scriptsData.length - 1;
        
        // 対象アプリのテキストHTMLを生成
        let appTextHtml = '';
        if (script.targetApps && script.targetApps.length > 0) {
            appTextHtml = '<div class="target-app-text admin-app-text">';
            script.targetApps.forEach(appId => {
                const app = targetApps.find(a => a.id === appId);
                if (app) {
                    appTextHtml += `<span class="app-label">${app.name}</span>`;
                }
            });
            appTextHtml += '</div>';
        }
        
        scriptItem.innerHTML = `
            <div class="order-actions">
                <button class="order-btn move-up" data-id="${script.id}" ${isFirst ? 'disabled' : ''}>
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="order-btn move-down" data-id="${script.id}" ${isLast ? 'disabled' : ''}>
                    <i class="fas fa-arrow-down"></i>
                </button>
            </div>
            <div class="script-item-title">${script.title}</div>
            ${appTextHtml}
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
    
    // 上に移動ボタンのイベントを設定
    const moveUpButtons = document.querySelectorAll('.move-up');
    moveUpButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scriptId = this.getAttribute('data-id');
            moveScriptUp(scriptId);
        });
    });
    
    // 下に移動ボタンのイベントを設定
    const moveDownButtons = document.querySelectorAll('.move-down');
    moveDownButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scriptId = this.getAttribute('data-id');
            moveScriptDown(scriptId);
        });
    });
}

// スクリプトを上に移動する関数
function moveScriptUp(scriptId) {
    const index = scriptsData.findIndex(script => script.id === scriptId);
    
    // 最初の要素は上に移動できない
    if (index <= 0) return;
    
    // 要素を入れ替え
    [scriptsData[index], scriptsData[index - 1]] = [scriptsData[index - 1], scriptsData[index]];
    
    // ローカルストレージに保存
    saveScriptsToStorage();
    
    // 表示を更新
    displayExistingScripts();
}

// スクリプトを下に移動する関数
function moveScriptDown(scriptId) {
    const index = scriptsData.findIndex(script => script.id === scriptId);
    
    // 最後の要素は下に移動できない
    if (index >= scriptsData.length - 1) return;
    
    // 要素を入れ替え
    [scriptsData[index], scriptsData[index + 1]] = [scriptsData[index + 1], scriptsData[index]];
    
    // ローカルストレージに保存
    saveScriptsToStorage();
    
    // 表示を更新
    displayExistingScripts();
}

// スクリプトを編集用にフォームに読み込む関数
function loadScriptForEditing(scriptId) {
    const script = scriptsData.find(s => s.id === scriptId);
    
    if (script) {
        // フォームに値を設定
        document.getElementById('script-id').value = script.id;
        document.getElementById('script-title').value = script.title;
        document.getElementById('script-description').value = script.description;
        
        // サムネイル画像のパスから自動追加部分を削除
        let thumbnailValue = script.thumbnail;
        if (thumbnailValue.startsWith('img/thumbnails/')) {
            thumbnailValue = thumbnailValue.replace('img/thumbnails/', '');
        }
        document.getElementById('script-thumbnail').value = thumbnailValue;
        
        // 画像URLの配列から自動追加部分を削除してカンマ区切りの文字列に変換
        const imagesValue = script.images.map(url => {
            if (url.startsWith('img/screenshots/')) {
                return url.replace('img/screenshots/', '');
            }
            return url;
        }).join(', ');
        document.getElementById('script-images').value = imagesValue;
        
        document.getElementById('script-full-description').value = script.fullDescription;
        document.getElementById('script-github').value = script.githubUrl;
        
        // 対象アプリのチェックボックスを設定
        document.querySelectorAll('input[name="target-apps"]').forEach(checkbox => {
            checkbox.checked = script.targetApps && script.targetApps.includes(checkbox.value);
        });
        
        // フォームにスクロール
        document.getElementById('add-script-form').scrollIntoView({ behavior: 'smooth' });
    }
}

// スクリプトを削除する関数
function deleteScript(scriptId) {
    // 削除確認
    if (confirm(`「${scriptsData.find(s => s.id === scriptId).title}」を削除してもよろしいですか？`)) {
        // 配列から削除
        scriptsData = scriptsData.filter(script => script.id !== scriptId);
        
        // ローカルストレージに保存
        saveScriptsToStorage();
        
        // 表示を更新
        displayExistingScripts();
    }
}

// ローカルストレージにスクリプトデータを保存する関数
function saveScriptsToStorage() {
    // ローカルストレージに保存
    localStorage.setItem('scriptsData', JSON.stringify(scriptsData));
    
    // JSONファイルとしてダウンロードできるようにする
    const dataStr = JSON.stringify(scriptsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const dataUrl = URL.createObjectURL(dataBlob);
    
    // ダウンロードリンクを作成
    const downloadArea = document.createElement('div');
    downloadArea.className = 'download-json-container';
    downloadArea.innerHTML = `
        <div class="download-json-notification">
            <p>データが更新されました。以下のリンクからJSONファイルをダウンロードして、「data/scripts.json」として保存し、GitHubにアップロードしてください。</p>
            <a href="${dataUrl}" download="scripts.json" class="download-json-btn">JSONファイルをダウンロード</a>
        </div>
    `;
    
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.download-json-container');
    if (existingNotification) {
        existingNotification.parentNode.removeChild(existingNotification);
    }
    
    // 通知を追加（既存のスクリプトセクションの後に追加）
    const existingScriptsSection = document.getElementById('existing-scripts');
    if (existingScriptsSection) {
        existingScriptsSection.parentNode.appendChild(downloadArea);
    } else {
        // 既存のスクリプトセクションが見つからない場合は、admin-contentに追加
        const adminContent = document.getElementById('admin-content');
        if (adminContent) {
            adminContent.appendChild(downloadArea);
        } else {
            // それも見つからない場合はbodyに追加
            document.body.appendChild(downloadArea);
        }
    }
    
    console.log('データが更新され、JSONファイルのダウンロードリンクが表示されました');
}

// データを読み込む関数
function loadScriptsFromStorage() {
    // まずローカルストレージから読み込む
    const storedData = localStorage.getItem('scriptsData');
    if (storedData) {
        scriptsData = JSON.parse(storedData);
        // 読み込んだデータを表示
        displayExistingScripts();
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
            displayExistingScripts();
            console.log('JSONファイルからデータを読み込みました:', data);
        })
        .catch(error => {
            console.error('データの読み込みエラー:', error);
            // エラーの場合はデフォルトデータを使用
            displayExistingScripts();
        });
}
