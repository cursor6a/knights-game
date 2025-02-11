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
let visited = [];
for (let i = 0; i < 8; i++)
    visited[i] = [];

let isTurn = true;
let current = null;  // 当前棋子位置

board.addEventListener('click', e => {
    let li = e.target;
    if (li.tagName === 'LI' && isTurn) {
        // console.log(li.id, li.parentNode.id);        
        if (current !== null) {  // 若不是第一次点击
            if (isValidMove(li)) {
                current.classList.add('shadow');
                current.innerText = '';  // 清空格子
            } else return;
        }
        isTurn = false;
        visited[li.parentNode.id][li.id] = true;
        current = li;
        li.innerText = '♘';
        setTimeout(bestMove, 500);
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
    // console.log(li);
    current.classList.add('shadow');
    current.innerText = '';  // 清空格子
    visited[r][c] = true;
    current = li;
    li.innerText = '♘';
    isTurn = true;
    setTimeout(checkGameOver, 100);
}