// カーソル追従の星屑エフェクト
document.addEventListener('DOMContentLoaded', function() {
    // カーソル追従エフェクト用のコンテナを作成
    const cursorEffectContainer = document.createElement('div');
    cursorEffectContainer.id = 'cursor-effect-container';
    document.body.appendChild(cursorEffectContainer);

    // マウスの位置を追跡
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMoving = false;
    let moveTimeout;
    let moveSpeed = 0; // マウスの移動速度
    
    // マウスの軌跡を保存する配列
    const mouseTrail = [];
    const TRAIL_LENGTH = 5; // 軌跡の長さ
    
    // 星屑の粒子を格納する配列
    const particles = [];
    
    // 粒子の最大数
    const MAX_PARTICLES = 18;
    
    // 粒子のクラス
    class Particle {
        constructor(x, y, trailIndex) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3.5 + 0.5;
            
            // 流れ星のような動きのために、カーソルの移動方向に沿った速度を設定
            if (trailIndex > 0 && mouseTrail.length > trailIndex) {
                const prevPos = mouseTrail[trailIndex - 1];
                const dirX = x - prevPos.x;
                const dirY = y - prevPos.y;
                const length = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
                
                // カーソルの移動方向に沿った速度（少しランダム性を持たせる）
                this.speedX = (dirX / length) * (Math.random() * 1 + 1) * -1; // 逆方向に動かす
                this.speedY = (dirY / length) * (Math.random() * 1 + 1) * -1; // 逆方向に動かす
            } else {
                // 軌跡がない場合はランダムな方向（主に下向き）
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 + 1; // 主に下向き
            }
            
            this.color = getRandomColor();
            this.alpha = 1;
            this.element = document.createElement('div');
            this.element.className = 'cursor-particle';
            this.update();
            cursorEffectContainer.appendChild(this.element);
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
            
            if (this.alpha <= 0) {
                this.alpha = 0;
            }
            
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.width = this.size + 'px';
            this.element.style.height = this.size + 'px';
            this.element.style.backgroundColor = this.color;
            this.element.style.opacity = this.alpha;
            this.element.style.boxShadow = `0 0 ${this.size * 2}px ${this.color}`;
        }
        
        isAlive() {
            return this.alpha > 0;
        }
    }
    
    // ランダムな色を生成
    function getRandomColor() {
        const colors = [
            '#4CAF50', // メインの緑色
            '#8BC34A', // ライトグリーン
            '#CDDC39', // ライム
            '#2196F3', // ブルー
            '#00BCD4', // シアン
            '#FFFFFF'  // 白
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // マウス移動イベントを追跡
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // マウスの移動を検出
        const distance = Math.sqrt(
            Math.pow(mouseX - lastMouseX, 2) + 
            Math.pow(mouseY - lastMouseY, 2)
        );
        
        if (distance > 5) {
            isMoving = true;
            moveSpeed = distance; // 移動距離を速度として記録
            
            // 軌跡を更新
            mouseTrail.unshift({ x: mouseX, y: mouseY });
            if (mouseTrail.length > TRAIL_LENGTH) {
                mouseTrail.pop();
            }
            
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            
            // 移動速度に応じて粒子生成の確率を調整
            const speedFactor = Math.min(moveSpeed / 25, 1.2); // 25px以上の移動で高確率、高速で1.2倍まで
            
            // 軌跡に沿って粒子を生成（カーソルの後ろに）- 速度が速いほど確率が高い
            if (particles.length < MAX_PARTICLES && mouseTrail.length > 1 && Math.random() < speedFactor) {
                // 軌跡の後ろの方の位置から粒子を生成
                const trailIndex = Math.min(Math.floor(Math.random() * mouseTrail.length), mouseTrail.length - 1);
                const trailPos = mouseTrail[trailIndex];
                particles.push(new Particle(trailPos.x, trailPos.y, trailIndex));
                
                // 速度が速い場合は複数の粒子を一度に生成（確率を少し下げる）
                if (moveSpeed > 35 && particles.length < MAX_PARTICLES - 3 && Math.random() < 0.5) {
                    const extraTrailIndex = Math.min(Math.floor(Math.random() * mouseTrail.length), mouseTrail.length - 1);
                    const extraTrailPos = mouseTrail[extraTrailIndex];
                    particles.push(new Particle(extraTrailPos.x, extraTrailPos.y, extraTrailIndex));
                }
            }
            
            // 移動停止タイマーをリセット
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                isMoving = false;
                moveSpeed = 0;
            }, 100);
        }
    });
    
    // アニメーションループ
    function animate() {
        // 既存の粒子を更新
        for (let i = 0; i < particles.length; i++) {
            if (particles[i].isAlive()) {
                particles[i].update();
            } else {
                // 寿命が尽きた粒子を削除
                particles[i].element.remove();
                particles.splice(i, 1);
                i--;
                
                // マウスが動いているときだけ新しい粒子を追加 - 速度が速いほど確率が高い
                if (isMoving && mouseTrail.length > 1) {
                    const speedFactor = Math.min(moveSpeed / 25, 1.2);
                    if (Math.random() < speedFactor * 0.35) { // 速度が速いほど確率が高く
                        const trailIndex = Math.min(Math.floor(Math.random() * mouseTrail.length), mouseTrail.length - 1);
                        const trailPos = mouseTrail[trailIndex];
                        particles.push(new Particle(trailPos.x, trailPos.y, trailIndex));
                        
                        // 速度が速い場合は追加の粒子を生成（確率を少し下げる）
                        if (moveSpeed > 35 && particles.length < MAX_PARTICLES - 2 && Math.random() < 0.4) {
                            const extraTrailIndex = Math.min(Math.floor(Math.random() * mouseTrail.length), mouseTrail.length - 1);
                            const extraTrailPos = mouseTrail[extraTrailIndex];
                            particles.push(new Particle(extraTrailPos.x, extraTrailPos.y, extraTrailIndex));
                        }
                    }
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // アニメーションを開始
    animate();
});
