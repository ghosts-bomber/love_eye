export default {
    data: {
        running: false,
        countdown: 0,
        intervalId: 0,
        el: null,
        ctx: null,
    },
    startFocus() {
        this.running = true;
        // 开始倒计时
        this.countdown = 10;
        // 页面切换到运行态后绘制表盘刻度
        setTimeout(() => {
            this.drawDialTicks();
        }, 0);
        this.intervalId = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.intervalId);
                this.running = false;
            }
        }, 1000);
    },
    stopFocus() {
        this.running = false;
        // 清除倒计时
        clearInterval(this.intervalId);
        this.countdown = 0;
    },
    onInit() {

    }

    ,
    // 获取 canvas 元素（通过 $refs.canvas1，避免使用 $element）
    getCanvasEl() {
        try {
            const refs = this['$refs'] || {};
            const el = refs['canvas1'] || null;
            return el;
        } catch (e) {
            return null;
        }
    },
    // 绘制表盘的刻度（120 个灰色刻度）
    drawDialTicks() {
        console.log("drawDialTicks");
        const el = this.getCanvasEl();
        if (!el) {
            // 视图可能尚未渲染，稍后重试
            setTimeout(() => this.drawDialTicks(), 50);
            return;
        }
        const ctx = el && el['getContext'] ? el['getContext']("2d", { antialias: true }) : null;
        if (!ctx) {
            console.log("ctx 为空");
            return;
        }
        // 计算画布尺寸（尽量使用可用的尺寸信息）
        let width = 454;
        let height = 454;

        console.log(`drawDialTicks width: ${width}, height: ${height}`);
        // 为保证清晰，设置内部像素大小并按比例缩放
        const dpr = (globalThis && globalThis.devicePixelRatio) ? globalThis.devicePixelRatio : 1;
        console.log(`drawDialTicks dpr: ${dpr}`);
        // 将绘图坐标缩放到 CSS 尺寸
        if (ctx && ctx.setTransform) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        // 以 CSS 逻辑尺寸为准进行绘制
        width = Math.floor(width);
        height = Math.floor(height);

        // 清空画布
        if (ctx && ctx.clearRect) {
            ctx.clearRect(0, 0, width, height);
        }

        const cx = width / 2;
        const cy = height / 2;
        const padding = 12; // 内边距，避免刻度贴边
        const radius = Math.min(cx, cy) - padding;
        const tickCount = 120;
        const tickLen = 8; // 刻度长度
        if (ctx) {
            ctx.strokeStyle = '#999999';
            ctx.lineWidth = 2;
            ctx.lineCap = 'butt';
        }

        // 将 0 度指向正上方（-90°），顺时针绘制
        for (let i = 0; i < tickCount; i++) {
            const angle = (i / tickCount) * Math.PI * 2 - Math.PI / 2;
            const x1 = cx + Math.cos(angle) * radius;
            const y1 = cy + Math.sin(angle) * radius;
            const x2 = cx + Math.cos(angle) * (radius - tickLen);
            const y2 = cy + Math.sin(angle) * (radius - tickLen);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        console.log("drawDialTicks end");
    }
};
