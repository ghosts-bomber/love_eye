export default {
    data: {
        running: false,
        countdown: 0,
        totalCountdown: 0,
        intervalId: 0,
        el: null,
        ctx: null,
        progressColor: 'rgba(255,221,0,0.2)',
        progressBgColor: 'rgba(180,180,180,0.25)',
        progressPercent: 0,
    },
    startFocus() {
        this.running = true;
        this.totalCountdown = 10;
        this.countdown = this.totalCountdown;
        setTimeout(() => {
            this.drawDial(this.totalCountdown, this.countdown);
        }, 0);
        this.intervalId = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.intervalId);
                this.running = false;
                this.drawDial(this.totalCountdown, 0);
                return;
            }
            this.drawDial(this.totalCountdown, this.countdown);
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
        return this.$refs.canvas1 || null;
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
        console.log("getCanvasEl");
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
        // 基础满环覆盖上一帧的进度
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(180,180,180,0.25)';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy, radius - tickLen - 6, -Math.PI / 2, 1.5 * Math.PI, false);
        ctx.stroke();
        console.log("drawDialTicks end");
    }
    ,
    drawDial(total, remaining) {
        console.log("drawDial begin");
        const el = this.getCanvasEl();
        console.log("getCanvasEl");
        if (!el) {
            console.log("el 为空");
            setTimeout(() => this.drawDial(total, remaining), 50);
            return;
        }
        console.log("getCanvasEl end");
        const ctx = el && el.getContext ? el.getContext("2d", { antialias: true }) : null;
        console.log("getContext");
        if (!ctx) {
            console.log("ctx 为空");
            return;
        }
        console.log("ctx 不为空");
        let width = 454;
        let height = 454;

        console.log(`drawDial width: ${width}, height: ${height}`);
        width = Math.floor(width);
        height = Math.floor(height);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(0, 0, width, height);
        const cx = width / 2;
        const cy = height / 2;
        const padding = 12;
        const radius = Math.min(cx, cy) - padding;
        const tickCount = 120;
        const tickLen = 8;
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 2;
        ctx.lineCap = 'butt';
         
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
       
        const ratio = Math.max(0, Math.min(1, total > 0 ? remaining / total : 0));
        const percent = Math.round(ratio * 100);
        this.progressPercent = percent;
        const alpha = 0.2 + 0.8 * (1 - ratio);
        this.progressColor = `rgba(255,221,0,${alpha})`;
        this.progressBgColor = 'rgba(180,180,180,0.25)';

        if (ratio > 0) {
            const start = -Math.PI / 2;
            const end = start + ratio * Math.PI * 2;
            const range = end - start;
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            // 分段绘制模拟沿弧线方向颜色渐变（从 #FFDD00 到 #FFAA00）
            const segments = Math.max(1, Math.floor(60 * ratio));
            for (let i = 0; i < segments; i++) {
                const t = segments > 1 ? i / (segments - 1) : 0;
                const r = 255;
                const g = Math.round(221 + (170 - 221) * t);
                const b = 0;
                ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
                const s = start + (range * i) / segments;
                const e = start + (range * (i + 1)) / segments;
                ctx.beginPath();
                ctx.arc(cx, cy, radius - tickLen - 6, s, e, false);
                ctx.stroke();
            }
        }
        console.log("drawDial end");
        
        
    }
};
