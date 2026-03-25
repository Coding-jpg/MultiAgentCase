# 📂 分身并行开发指令集 (Avatar Mission Briefs)

## ⚠️ 架构师全局警告 (Zero-Conflict Contract)
为了在合并时不产生冲突（Merge Conflicts），**严禁直接修改 `index.html`**。
核心引擎采用了 **IoC（控制反转）设计**，依靠 URL 参数动态加载关卡模块。

你只需在根目录创建一个新的 JS 文件（例如 `level_water.js`），并通过 `window.LevelRegistry` 注入你的配置，引擎会自动接管一切。

---

## 🔵 关卡 A：深海迷踪 (Avatar: `water`)
**需求指令**：“开发一个深海关卡，重写物理参数实现水下浮力，增加漂浮的水母障碍物。”

*   **创建文件**：`level_water.js`
*   **注册名称**：`window.LevelRegistry['water'] = { ... }`
*   **物理契约**：重力 (`gravity`) 必须降低至 `0.1` 左右，模拟浮力。X轴摩擦力加大。
*   **视觉签名**：背景设为深蓝色 (`backgroundColor: '#001a33'`)，平台设为珊瑚色 (`#ff7f50`)。
*   **独立预览方法**：运行本地服务后，访问 `http://localhost:端口/?level=water`。

---

## 🔴 关卡 B：熔岩堡垒 (Avatar: `lava`)
**需求指令**：“开发一个岩浆堡垒关卡，增加一个来回巡逻且喷火的守护怪物，马里奥移动更加沉重。”

*   **创建文件**：`level_lava.js`
*   **注册名称**：`window.LevelRegistry['lava'] = { ... }`
*   **物理契约**：重力 (`gravity`) 设置为正常的 `0.6`，但移动速度变慢（体现沉重感）。
*   **AI 契约**：利用引擎暴露的 `renderForeground` 钩子，绘制并更新敌人的坐标和状态机。
*   **视觉签名**：背景设为暗红色 (`backgroundColor: '#4a0e0e'`)，平台设为熔岩色 (`#ff4500`)。
*   **独立预览方法**：运行本地服务后，访问 `http://localhost:端口/?level=lava`。

---

## 🟡 关卡 C：云端之巅 (Avatar: `sky`)
**需求指令**：“开发一个天空关卡，增加随机风力事件（会把马里奥向左吹），并加入踩踏后会掉落的响应式云朵平台。”

*   **创建文件**：`level_sky.js`
*   **注册名称**：`window.LevelRegistry['sky'] = { ... }`
*   **事件契约**：在 `onUpdate` 钩子中，注入周期性的风力向量干扰。通过遍历 `platforms` 并记录踩踏时间，实现平台掉落。
*   **视觉签名**：背景设为浅蓝/金色 (`backgroundColor: '#87CEEB'`)，平台设为白色云朵 (`#ffffff`)。
*   **独立预览方法**：运行本地服务后，访问 `http://localhost:端口/?level=sky`。

---

## 📝 开发模板示例 (参考)
你的 JS 文件必须采用以下格式返回注册信息：

```javascript
window.LevelRegistry['关卡标识'] = {
    name: '关卡标识',
    title: '关卡标题',
    description: '关卡描述',
    backgroundColor: '#000000',
    platformColor: '#00ff00',
    
    // 物理覆盖
    physics: {
        gravity: 0.5,       // 重力 (越小浮力越大)
        speed: 0.5,         // X轴加速度
        jumpForce: 12,      // 起跳力
        frictionX: 0.8,     // X轴摩擦系数 (接近1越滑)
        frictionY: 1        // Y轴阻力 (接近1正常, 小于1水阻)
    },
    
    // 静态地图数据
    platforms: [
        {x: 50, y: 550, w: 700, h: 40},
        {x: 200, y: 400, w: 100, h: 20}
    ],

    // 生命周期钩子 (Hook)
    onInit: function(player) {
        player.color = 'blue'; // 可覆盖玩家外观
    },
    
    onUpdate: function(player, keys) {
        // 在这里注入额外的逻辑（比如风力、或者敌人移动）
    },

    renderBackground: function(ctx) {
        // 在这里绘制背景特效（气泡、岩浆粒子等）
    },

    renderForeground: function(ctx, player) {
        // 在这里绘制怪物、UI、终点旗帜
    },
    
    checkWin: function(player) {
        // 定义通关条件，返回 true 结束
        return player.x > 700;
    }
};
```