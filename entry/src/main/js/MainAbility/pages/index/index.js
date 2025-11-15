export default {
    data: {
        width_: 454,
        height_: 454,
        running_: false,
        countdown_: 0,
        totalCountdown_: 10,
        intervalId_: 0,
        animId_: 0,
        endTs_: 0,
        el_: null,
        currentTime_: '',
        timeIntervalId_: 0,
        arcVal_:100,
        remainingTime_: '00:00:00',
    },
    startFocus() {
        this.running_ = true;
        this.countdown_ = this.totalCountdown_;
        this.remainingTime_ = this.formatSeconds_(this.countdown_);
        //this.endTs_ = Date.now() + this.totalCountdown_ * 1000;
         setTimeout(() => {
             //this.drawDial(this.totalCountdown_,this.countdown_);
             this.drawDialTicks();
         }, 0);
        this.intervalId_ = setInterval(() => {
            this.countdown_--;
            this.arcVal_ = this.countdown_ / this.totalCountdown_*100;
            this.remainingTime_ = this.formatSeconds_(this.countdown_);
            if (this.countdown_ === 0) {
                this.countdown_ = 0;
                this.arcVal_ = 0;
                clearInterval(this.intervalId_);
                this.running_ = false;
            }
        }, 1000);
        // this.animId_ = setInterval(() => {
        //     const now = Date.now();
        //     const remainingMs = Math.max(0, this.endTs_ - now);
        //     this.countdown_ = remainingMs / 1000;
        //     this.drawDial(this.totalCountdown_, this.countdown_);
        //     if (remainingMs <= 0) {
        //         if (this.animId_) { clearInterval(this.animId_); this.animId_ = 0; }
        //     }
        // }, 1000);
    },
    stopFocus() {
        this.running_ = false;
        // 清除倒计时
        clearInterval(this.intervalId_);
        if (this.animId_) { clearInterval(this.animId_); this.animId_ = 0; }
        this.countdown_ = 0;
        this.remainingTime_ = '00:00:00';
    },
    onInit() {
        const fmt = (n) => (n < 10 ? '0' + n : '' + n);
        const tick = () => {
            const d = new Date();
            const h = fmt(d.getHours());
            const m = fmt(d.getMinutes());
            const s = fmt(d.getSeconds());
            this.currentTime_ = `${h}:${m}:${s}`;
        };
        tick();
        this.timeIntervalId_ = setInterval(tick, 1000);
    },
    formatSeconds_(sec) {
        const s = Math.max(0, Math.floor(sec));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const ss = s % 60;
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${pad(h)}:${pad(m)}:${pad(ss)}`;
    },
    // 获取 canvas 元素（通过 $refs.canvas1，避免使用 $element）
    getCanvasEl() {
        return this.$refs.canvas1 || null;
    },
    // 绘制表盘的刻度（100 个灰色刻度）
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
        console.log(`drawDialTicks width: ${this.width_}, height: ${this.height_}`);
        // 为保证清晰，设置内部像素大小并按比例缩放
        const dpr = (globalThis && globalThis.devicePixelRatio) ? globalThis.devicePixelRatio : 1;
        console.log(`drawDialTicks dpr: ${dpr}`);
        // 将绘图坐标缩放到 CSS 尺寸
        if (ctx && ctx.setTransform) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            console.log(`drawDialTicks setTransform dpr: ${dpr}`);
        }

        const cx = this.width_ / 2;
        const cy = this.height_ / 2;
        const padding = 12; // 内边距，避免刻度贴边
        const radius = Math.min(cx, cy) - padding;
        const tickCount = 100;
        const tickLen = 12; // 刻度长度
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
    },
    clearCanvas(){
        const el = this.getCanvasEl();
        const ctx = el && el.getContext ? el.getContext("2d", { antialias: true }) : null;
        if(ctx){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, this.width_, this.height_);
        }
    },
    drawDial(total, remaining) {
        this.clearCanvas();
        this.drawDialTicks();

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


        const cx = this.width_ / 2;
        const cy = this.height_ / 2;
        const padding = 12;
        const radius = Math.min(cx, cy) - padding;

        const tickLen = 8;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.lineWidth = 14;
        ctx.lineCap = 'butt'
        ctx.beginPath();
        ctx.arc(cx, cy, radius - tickLen, 0, 6.28);
        ctx.stroke();
        ctx.beginPath();
            ctx.moveTo(10, 10);
            ctx.lineTo(280, 160);
            ctx.stroke();
        const ratio = Math.max(0, Math.min(1, total > 0 ? remaining / total : 0));
        const alpha = 0.2 + 0.8 * (1 - ratio);
        if (ratio > 0) {
            const start = -Math.PI / 2;
            const end = start + ratio * Math.PI * 2;
            const range = end - start;
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            // 分段绘制模拟沿弧线方向颜色渐变（从 #FFDD00 到 #FFAA00）
            const segments = Math.max(1, Math.floor(12 * ratio));
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
