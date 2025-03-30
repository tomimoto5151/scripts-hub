// 許可されたメールアドレスのリスト
// 実際の運用では、サーバーサイドでの検証が推奨されます
const ALLOWED_EMAILS = [
    'your_email@example.com',
    // 他の許可されたメールアドレスを追加
];

// Google認証のコールバック関数
function handleCredentialResponse(response) {
    // JWTトークンをデコード
    const responsePayload = parseJwt(response.credential);
    
    // メールアドレスを取得
    const email = responsePayload.email;
    
    // 許可されたメールアドレスかチェック
    if (ALLOWED_EMAILS.includes(email)) {
        // ログイン成功
        console.log("ログイン成功:", email);
        
        // セッションストレージにログイン情報を保存
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);
        
        // 管理ページにリダイレクト
        window.location.href = 'admin.html';
    } else {
        // 許可されていないメールアドレス
        alert('このメールアドレスは許可されていません。管理者に連絡してください。');
        console.log("ログイン失敗: 許可されていないメールアドレス", email);
    }
}

// JWTトークンをデコードする関数
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
    // 既にログイン済みかチェック
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // ログイン済みの場合は管理ページにリダイレクト
        window.location.href = 'admin.html';
    }
});
