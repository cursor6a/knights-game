// 定义游戏规则文本
let gameRules = '<h2>游戏规则</h2>' +
    '<p>1. 玩家点击棋盘选择棋子起始位置</p>' +
    '<p>2. 电脑先手，按照“马走日”的规则移动</p>' +
    '<p>3. 双方轮流移动棋子至未走过的格子</p>' +
    '<p>4. 若一方无路可走，则判该方输</p>';

let freeRules = '<h2>提示</h2>' +
    '<p>1. 你可以连续移动棋子至未走过的格子</p>' +
    '<p>2. 也可以跟你的玩伴轮流移动棋子</p>' +
    '<p>3. 开启如下选项可记录移动轨迹</p>' +
    '<label>' +
    '<input type="checkbox" id="number-mark">数字标记' +
    '</label>';

let pathRules = '<h2>提示</h2>' +
    '<p>1. 先后点击棋盘确定起点与终点</p>' +
    '<p>2. 系统将演示一条最短路径</p>' +
    '<p>3. 按 F12 打开控制台可立即查看结果</p>';

let tourRules = '<h2>提示</h2>' +
    '<p>1. 点击棋盘选择棋子起始位置</p>' +
    '<p>2. 系统将演示一条能走遍所有棋盘格恰好一次的路径</p>' +
    '<p>3. 按 F12 打开控制台可立即查看结果</p>';

// 获取容器并初始化显示游戏规则
let container = document.querySelector('.rules');
container.innerHTML = gameRules;

// 初始化棋盘HTML结构
let str = '';
for (let row = 0; row < 8; row++) {
    str += `<ul id=${row}>`;
    for (let col = 0; col < 8; col++)
        str += `<li id=${col}></li>`;
    str += '</ul>';
}

// 获取棋盘元素并插入HTML
let board = document.querySelector('.board');
board.innerHTML = str;  // 嵌入棋盘HTML结构

// 初始化访问记录数组
let visited = [[], [], [], [], [], [], [], []];

let isTurn = true;
let current;  // 当前棋子位置
let start, end;  // 记录起点和终点

let gameMode = 'game';  // 默认是博弈模式
let checkbox;  // 是否用数字标记的复选框
let count = 0;  // 用于记录移动步数

// 获取模式选择控件
let modeControls = document.querySelectorAll('.mode-btn');
modeControls.forEach(button => {
    button.addEventListener('click', () => {
        if (current === undefined) {
            // 切换模式
            modeControls.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameMode = button.dataset.mode;
            if (gameMode === 'game') container.innerHTML = gameRules;
            else if (gameMode === 'free') {
                container.innerHTML = freeRules;
                checkbox = document.getElementById('number-mark');
            } else if (gameMode === 'path') container.innerHTML = pathRules;
            else container.innerHTML = tourRules;
        }
    });
});

// 棋盘点击事件
board.addEventListener('click', e => {
    let li = e.target;
    if (li.tagName === 'LI' && isTurn) {
        // console.log(li.id, li.parentNode.id);
        if (current !== undefined) {  // 若不是第一次点击
            if (gameMode === 'tour') return;
            if (gameMode === 'path') {
                if (end !== undefined)
                    return;
                end = [Number(li.id), Number(li.parentNode.id)];
                shortestMove();
            } else if (isValidMove(li)) {
                if (gameMode === 'free' && checkbox.checked) {
                    current.classList.add('marked');
                    current.innerText = ++count;
                } else {
                    current.classList.add('shadow');
                    current.innerText = '';  // 清空格子
                }
            } else return;
        }
        if (gameMode === 'tour') {
            current = li;
            li.innerText = '♘';
            tour();
        }
        if (gameMode === 'free')
            checkbox.disabled = true;
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
    if (visited[next.parentNode.id][next.id]) return false;  // 如果目标位置已经访问过，则为非法移动
    let dx = Math.abs(next.id - current.id);
    let dy = Math.abs(next.parentNode.id - current.parentNode.id);
    return dx === 1 && dy === 2 || dx === 2 && dy === 1;  // 判断是否符合“马走日”的规则
}

// 判断玩家是否无路可走，并提示
function checkGameOver() {
    let col = Number(current.id);
    let row = Number(current.parentNode.id);

    // 检查所有可能的移动位置
    const moves = [
        [row + 2, col + 1], [row + 2, col - 1], [row - 2, col + 1], [row - 2, col - 1],
        [row + 1, col + 2], [row + 1, col - 2], [row - 1, col + 2], [row - 1, col - 2]];

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

// 展示最短路径
function shortestMove() {
    let r = bfs(start, end);
    let path = [];
    // 从结束位置回溯，生成完整的路径
    while (r) {  // 转换为直观的路径点数组
        path.unshift(r.pos);
        r = r.lastP;  // 回溯到上一个位置
    }
    // console.log(start, end);
    for (let p of path)
        console.log(p);

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
        if (!path.length)  // 清除定时器
            clearInterval(timer);
    }, 500);  // 每0.5秒移动一步
}

// 广度优先搜索（BFS）函数
function bfs(start, end) {
    let vis = [[], [], [], [], [], [], [], []];
    const moves = [[1, 2], [2, 1], [1, -2], [-2, 1], [-1, 2], [2, -1], [-2, -1], [-1, -2]];
    let queue = [{pos: start}];
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

// 骑士周游相关变量
let mark = [[], [], [], [], [], [], [], []];
let path = [];
let finished;


const moves = [[2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2], [-2, 1], [-2, -1]];

// 获取当前位置的所有可能下一步
function next(thisP) {
    let all = [];
    let [x, y] = thisP;
    for (let i = 0; i < 8; i++) {
        let [dx, dy] = moves[i];
        let [nx, ny] = [x + dx, y + dy];
        if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && !visited[ny][nx])
            all.push([nx, ny]);
    }
    return all;
}

// 比较函数，这一点没有python的sort(key=...)语法简洁
function compare(p1, p2) {
    //获取到p1的下一步的所有位置个数
    let count1 = next(p1).length;
    //获取到p2的下一步的所有位置个数
    let count2 = next(p2).length;
    if (count1 < count2)
        return -1;
    if (count1 === count2)
        return 0;
    return 1;
}


// 结合贪心算法的深度优先搜索（DFS）函数
function dfs(thisP, step) {
    let [col, row] = thisP;
    mark[row][col] = step;
    visited[row][col] = true;  // 标记为已访问
    path.push(thisP);
    // 获取当前位置可以走的下一个位置的集合
    let ps = next(thisP);
    // 贪心算法优化，对ps中所有的point下一步的所有集合的数目，进行非递减排序，其实就是递增
    ps.sort(compare);
    // 遍历ps
    while (ps.length) {
        // 取出下一个可以走的位置
        let [x, y] = ps.shift();
        // 判断该点是否已经访问过
        if (!visited[y][x])
            // 还没访问过
            dfs([x, y], step + 1);
    }

    // 判断马儿是否完成了任务
    // 如果没有达到数量，则表示没有完成任务，需要回溯
    if (step < 64 && !finished) {
        mark[row][col] = 0;
        visited[row][col] = false;
        path.pop();
    } else
        finished = true;
}

// 展示骑士周游路径
function tour() {
    let p = [Number(current.id), Number(current.parentNode.id)];
    dfs(p, 1);
    console.log(mark);
    for (let i = 0; i < 64; i++)
        console.log(i + 1, path[i]);

    let count = 0;  // 用于记录当前步数
    let timer = setInterval(() => {
        let [x, y] = path.shift();
        if (count !== 0)
            current.classList.add('marked');  // 采用数字标记
        current.innerText = count++;
        let li = document.evaluate(`//ul[${y + 1}]/li[${x + 1}]`, document).iterateNext();
        li.innerText = '♘';
        current = li;
        if (!path.length)
            clearInterval(timer);
    }, 300);
}