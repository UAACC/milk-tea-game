// 游戏配置
const CONFIG = {
    timeLimit: 60,
    ingredients: [
        { id: 'milk', emoji: '🥛', name: '牛奶', color: '#ffffff', score: 10 },
        { id: 'tea', emoji: '🍵', name: '茶', color: '#8B4513', score: 15 },
        { id: 'pearl', emoji: '⚫', name: '珍珠', color: '#000000', score: 20 },
        { id: 'strawberry', emoji: '🍓', name: '草莓', color: '#ff6b6b', score: 25 },
        { id: 'mango', emoji: '🥭', name: '芒果', color: '#ffd700', score: 25 },
        { id: 'coconut', emoji: '🥥', name: '椰果', color: '#f5f5dc', score: 20 },
        { id: 'ice', emoji: '🧊', name: '冰块', color: '#add8e6', score: 5 }
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
    document.getElementById('currentIngredient').innerHTML = `
        <div class="ingredient-item">
            <span class="emoji">${gameState.currentIngredient.emoji}</span>
            <span class="name">${gameState.currentIngredient.name}</span>
        </div>
    `;
}

// 添加配料到杯子
function addIngredient(cupId) {
    if (gameState.isGameOver) return;
    
    const cup = cupId === 'left' ? gameState.leftCup : gameState.rightCup;
    cup.push(gameState.currentIngredient);
    
    // 更新杯子外观
    updateCupAppearance(cupId);
    
    // 生成新的配料
    generateNewIngredient();

    // 添加动画效果
    const cupElement = document.getElementById(cupId + 'Cup');
    cupElement.style.transform = 'scale(0.95)';
    setTimeout(() => {
        cupElement.style.transform = 'scale(1)';
    }, 200);

    // 让吉祥物有反应
    animateMascot();
}

// 更新杯子外观
function updateCupAppearance(cupId) {
    const cup = cupId === 'left' ? gameState.leftCup : gameState.rightCup;
    const cupElement = document.getElementById(cupId + 'Cup').querySelector('.cup-content');
    
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

// 添加触摸事件支持
function addTouchSupport() {
    const cups = document.querySelectorAll('.tea-cup');
    cups.forEach(cup => {
        // 添加点击事件
        cup.addEventListener('click', (e) => {
            e.preventDefault();
            const cupId = cup.id.replace('Cup', '');
            addIngredient(cupId);
        });

        // 添加触摸事件
        cup.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const cupId = cup.id.replace('Cup', '');
            addIngredient(cupId);
        });
    });
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addTouchSupport();
    
    // 添加调试信息
    console.log('游戏初始化完成');
    console.log('杯子元素:', document.querySelectorAll('.tea-cup'));
});
