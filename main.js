let gameRules = '<h2>游戏规则</h2>\n' +
    '<p>1. 玩家点击棋盘选择棋子起始位置</p>\n' +
    '<p>2. 电脑先手，按照“马走日”的规则移动</p>\n' +
    '<p>3. 双方轮流移动棋子至未走过的格子</p>\n' +
    '<p>4. 若一方无路可走，则判该方输</p>';
let freeRules = '<h2>提示</h2>\n' +
    '<p>1. 你可以连续移动棋子至未走过的格子</p>' +
    '<p>2. 也可以跟你的玩伴轮流移动棋子</p>';
let pathRules = '<h2>提示</h2>\n' +
    '<p>1. 先后点击棋盘确定起点与终点</p>' +
    '<p>2. 系统将自动演示一条最短路径</p>';
let tourRules= '<h2>提示</h2>\n' +
    '<p>1. 点击棋盘选择棋子起始位置</p>'+
    '<p>2. 系统将自动演示一条能走遍所有棋盘格恰好一次的路径</p>'

let container = document.querySelector('.rules');
container.innerHTML = gameRules;
// 初始化棋盘HTML结构
let str = '';
for (let row = 0; row < 8; row++) {
    str += `<ul id=${row}>`;
    for (let col = 0; col < 8; col++) {
        str += `<li id=${col}></li>`;
    }
    str += '</ul>';
}

// 获取棋盘元素并插入HTML
let board = document.querySelector('.board');
board.innerHTML = str;  // 嵌入棋盘HTML结构

// 初始化访问记录数组
let visited = [[], [], [], [], [], [], [], []];

let isTurn = true;
let current = null;  // 当前棋子位置
let start, end;

let gameMode = 'game';  // 默认是博弈模式

// 获取模式选择控件
let modeControls = document.querySelectorAll('.mode-btn');
modeControls.forEach(button => {
    button.addEventListener('click', () => {
        if (current === null) {
            // 切换模式
            modeControls.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameMode = button.dataset.mode;
            if (gameMode === 'game') container.innerHTML = gameRules;
            else if (gameMode === 'free') container.innerHTML = freeRules;
            else if (gameMode === 'path') container.innerHTML = pathRules;
            else container.innerHTML = tourRules;
        }
    });
});

// 棋盘点击事件
board.addEventListener('click', e => {
    let li = e.target;
    if (li.tagName === 'LI' && isTurn) {
        // console.log(li.id, li.parentNode.id);
        if (current !== null) {  // 若不是第一次点击
            if (gameMode === 'path') {
                if (end !== undefined)
                    return;
                end = [Number(li.id), Number(li.parentNode.id)];
                shortestMove();
            } else if (isValidMove(li)) {
                current.classList.add('shadow');
                current.innerText = '';  // 清空格子
            } else return;
        }
        visited[li.parentNode.id][li.id] = true;
        if (gameMode === 'path') {
            if (end === undefined) {
                li.innerText = '♘';
                current = li;
                start = [Number(current.id), Number(current.parentNode.id)];
            }
            return;
        }
        current = li;
        li.innerText = '♘';
        if (gameMode === 'game') {
            isTurn = false;
            setTimeout(bestMove, 500);
        }
    }
})

// 判断移动是否合法
function isValidMove(next) {
    if (visited[next.parentNode.id][next.id]) return false;
    let dx = Math.abs(next.id - current.id);
    let dy = Math.abs(next.parentNode.id - current.parentNode.id);
    return dx === 1 && dy === 2 || dx === 2 && dy === 1;
}

// 判断玩家是否无路可走，并提示
function checkGameOver() {
    let col = Number(current.id);
    let row = Number(current.parentNode.id);

    // 检查所有可能的移动位置
    const moves = [
        [row + 2, col + 1],
        [row + 2, col - 1],
        [row - 2, col + 1],
        [row - 2, col - 1],
        [row + 1, col + 2],
        [row + 1, col - 2],
        [row - 1, col + 2],
        [row - 1, col - 2]
    ];

    if (!moves.some(([r, c]) => {
        return r >= 0 && r < 8 && c >= 0 && c < 8 && !visited[r][c];
    })) alert('你输了！请刷新页面重新开始');
}

// 电脑的最佳移动策略（必胜策略）
function bestMove() {
    let c, r;
    let col = Number(current.id);
    let row = Number(current.parentNode.id);

    if (col % 2 === 0)
        c = col + 1;
    else c = col - 1;

    if ([0, 1, 4, 5].includes(row))
        r = row + 2;
    else r = row - 2;

    // 执行移动
    let li = document.evaluate(`//ul[${r + 1}]/li[${c + 1}]`, document).iterateNext();

    current.classList.add('shadow');
    current.innerText = '';  // 清空格子
    visited[r][c] = true;
    current = li;
    li.innerText = '♘';
    isTurn = true;
    setTimeout(checkGameOver, 100);
}

function shortestMove() {
    let r = bfs(start, end);
    let path = [];
    while (r) {
        path.unshift(r.pos);
        r = r.lastP;
    }
    console.log(start, end);
    let first = true;
    let timer = setInterval(() => {
        let [x, y] = path.shift();
        if (!first) {
            current.innerText = '';
            current.classList.add('shadow');
        }
        first = false;
        let li = document.evaluate(`//ul[${y + 1}]/li[${x + 1}]`, document).iterateNext();
        li.innerText = '♘';
        current = li;
        if (!path.length)
            clearInterval(timer);
    }, 500);
}

function bfs(start, end) {
    let vis = [[], [], [], [], [], [], [], []];
    const moves = [[1, 2], [2, 1], [1, -2], [-2, 1], [-1, 2], [2, -1], [-2, -1], [-1, -2]]
    let startP = {pos: start};
    let queue = [startP];
    while (queue.length) {
        let thisP = queue.shift();
        let [x, y] = thisP.pos;
        for (let i = 0; i < 8; i++) {
            let [dx, dy] = moves[i];
            let [nx, ny] = [x + dx, y + dy];
            if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && !vis[ny][nx]) {
                vis[ny][nx] = true;
                queue.push({pos: [nx, ny], lastP: thisP});
                if (nx === end[0] && ny === end[1]) {
                    return queue.pop();
                }
            }
        }
    }
}