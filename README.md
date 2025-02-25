# 骑士的游戏（必胜策略、最短路径、骑士周游）

## 简介
这是一个与国际象棋中骑士相关的策略游戏与经典算法题的演示项目，拥有简洁的页面与高效的交互，下面具体描述了相关规则与操作提示，可以查看代码与视频以便了解游戏策略与算法思想

## 在线体验
预览地址：https://cursor6a.github.io/knights-game

## 游戏规则
这是一个经典的有必胜策略的游戏

在一个 8×8 的棋盘上有一只马，按照马走“日”字的移动规则，棋手A和棋手B轮流走一步，将马移到之前没有到过的位置。当棋手无法移动马时就输了。若A先手，且双方都用最优策略下棋，则 **棋手A有必胜策略**

## 功能模式
1. **博弈模式**  
   - 演示经典骑士游戏的必胜策略
   - 电脑作为先手（棋手A），玩家作为后手（棋手B）
   - 玩家选择起始位置后，电脑会自动执行必胜策略

2. **自由模式**  
   - 玩家可以自由移动棋子，探索棋盘上的各种可能路径
   - 支持**数字标记**功能，记录棋子移动的顺序
   - 适合玩家自由探索或与朋友轮流移动棋子

3. **最短路径**  
   - 演示骑士从起点到终点的最短路径
   - 玩家先后点击棋盘选择起点和终点，系统会自动演示最短路径

4. **骑士周游**  
   - 演示骑士遍历整个棋盘且每个格子恰好经过一次的路径 
   - 玩家选择起始位置后，系统会自动演示骑士周游路径

## 技术实现
- **HTML/CSS**：构建游戏界面和棋盘布局，使用 Flexbox 和 Grid 实现响应式设计
- **JavaScript**：实现游戏逻辑、骑士移动算法（如 BFS 最短路径算法）和交互功能
- **GitHub Pages**：部署在线预览，方便用户直接体验

## 更新日志
### 最新更新
- 添加了**自由模式**，玩家可以自由移动棋子，探索棋盘
- 添加了**最短路径**演示功能，展示骑士从起点到终点的最短路径
- 添加了**骑士周游**功能，演示骑士遍历整个棋盘且每个格子恰好经过一次的路径
- 优化了界面布局和交互体验，修复了格子错位问题

### 历史更新
- 初始版本：实现经典骑士游戏的必胜策略演示

## 参考资料
- YouTube 视频：https://youtu.be/ZGWZM8PcUlY

## Clone 项目
1. clone 此项目到本地：
   ```bash
   git clone https://github.com/cursor6a/knights-game.git
   ```
2. 打开 `index.html` 文件即可开始游戏

## 贡献
欢迎提交 Issue 或 Pull Request 来改进本项目。如果你有任何建议或发现 Bug，请通过 [Issues](https://github.com/cursor6a/knights-game/issues) 反馈
