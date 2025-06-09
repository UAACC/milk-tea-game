// 游戏配置
const CONFIG = {
    timeLimit: 60,
    ingredients: [
        { id: 'sugar', img: 'assets/ingredients/sug.png', name: '糖', color: '#fffbe7', score: 10 },
        { id: 'bubbles', img: 'assets/ingredients/bbs.png', name: '珍珠', color: '#2d1a0a', score: 20 }
    ]
};

// 游戏状态
let gameState = {
    timeLeft: CONFIG.timeLimit,
    currentIngredient: null,
    leftCup: [],
    rightCup: [],
    isGameOver: false
};

// 初始化游戏
function initGame() {
    gameState = {
        timeLeft: CONFIG.timeLimit,
        currentIngredient: null,
        leftCup: [],
        rightCup: [],
        isGameOver: false
    };
    
    updateTimer();
    generateNewIngredient();
    startTimer();
}

// 更新计时器显示
function updateTimer() {
    document.querySelector('.timer').textContent = gameState.timeLeft;
}

// 生成新的配料
function generateNewIngredient() {
    const randomIndex = Math.floor(Math.random() * CONFIG.ingredients.length);
    gameState.currentIngredient = CONFIG.ingredients[randomIndex];
    // 显示配料图片和名称
    const ingredient = gameState.currentIngredient;
    document.getElementById('currentIngredient').innerHTML = `
        <img src="${ingredient.img}" alt="${ingredient.name}" class="ingredient-icon" />
        <div class="ingredient-label">${ingredient.name}</div>
    `;
}

// 添加配料到杯子
function addIngredient(cupSide) {
    console.log('addIngredient called:', cupSide);
    if (gameState.isGameOver) return;
    const cup = cupSide === 'left' ? gameState.leftCup : gameState.rightCup;
    cup.push(gameState.currentIngredient);
    // 动画效果
    animateCup(cupSide);
    updateCupAppearance(cupSide);
    generateNewIngredient();
}

function animateCup(cupSide) {
    const cupElem = document.getElementById(cupSide + 'Cup');
    cupElem.classList.remove('animate-scale'); // 先移除，防止连续点击无效
    void cupElem.offsetWidth; // 触发重绘
    cupElem.classList.add('animate-scale');
    cupElem.addEventListener('animationend', function handler() {
        cupElem.classList.remove('animate-scale');
        cupElem.removeEventListener('animationend', handler);
    });
}

// 更新杯子外观
function updateCupAppearance(cupSide) {
    const cup = cupSide === 'left' ? gameState.leftCup : gameState.rightCup;
    const cupElement = document.getElementById(cupSide + 'Cup').querySelector('.cup-content');
    
    // 创建渐变背景
    const colors = cup.map(ing => ing.color);
    const gradient = colors.length > 0 
        ? `linear-gradient(to top, ${colors.join(', ')})`
        : 'transparent';
    
    cupElement.style.background = gradient;
}

// 吉祥物动画
function animateMascot() {
    const mascot = document.getElementById('mascot');
    mascot.style.transform = 'scale(1.1)';
    setTimeout(() => {
        mascot.style.transform = 'scale(1)';
    }, 200);
}

// 开始计时器
function startTimer() {
    const timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimer();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// 结束游戏
function endGame() {
    gameState.isGameOver = true;
    
    // 计算分数
    const leftScore = calculateScore(gameState.leftCup);
    const rightScore = calculateScore(gameState.rightCup);
    
    // 显示结算界面
    document.getElementById('resultScreen').style.display = 'flex';
    document.getElementById('leftScore').textContent = leftScore;
    document.getElementById('rightScore').textContent = rightScore;

    // 添加游戏结束动画
    document.querySelector('.game-container').classList.add('game-over');
}

// 计算分数
function calculateScore(cup) {
    return cup.reduce((total, ingredient) => total + ingredient.score, 0);
}

// 重新开始游戏
function restartGame() {
    document.getElementById('resultScreen').style.display = 'none';
    document.querySelector('.game-container').classList.remove('game-over');
    initGame();
}

// 绑定互动事件
function addCupInteraction() {
    const left = document.querySelector('.left-cup');
    const right = document.querySelector('.right-cup');
    console.log('left-cup:', left, 'right-cup:', right);
    left.addEventListener('click', () => { console.log('left-cup clicked'); addIngredient('left'); });
    right.addEventListener('click', () => { console.log('right-cup clicked'); addIngredient('right'); });
    left.addEventListener('touchstart', (e) => { e.preventDefault(); console.log('left-cup touched'); addIngredient('left'); });
    right.addEventListener('touchstart', (e) => { e.preventDefault(); console.log('right-cup touched'); addIngredient('right'); });
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addCupInteraction();
    
    // 添加调试信息
    console.log('游戏初始化完成');
    console.log('杯子元素:', document.querySelectorAll('.tea-cup'));
});
