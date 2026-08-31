# 情景背景图提示词

出图后按「建议文件名」放到 `public/scenes/`，再在 [`src/game/scenes.ts`](../src/game/scenes.ts) 把对应幕的 `imageSrc` 填成例如 `/scenes/lesson-1.png`。游戏会优先铺图，没图则继续用占位纯色。

适用对象：**初中美术课**（约 12–15 岁）。画面气质要像校园青春插画，不要小学低龄绘本，也不要写实校园写真。

插画在页面里是**卡片顶部横条**（`object-cover` 居中裁切），不是整卡 16:9。请按 3:1 出图（建议 2400×800）。桌面会切掉上下约 15%，手机可能略切左右，主体必须放在正中水平带。

## 统一风格

- 青少年水彩插画，纸纤维纹理清晰；构图克制，略带手账页眉质感
- 超宽横幅 3:1；主体在画面正中；上下各留可裁切的水彩边缘，关键道具不要贴上下边
- 横向铺开：课桌、画架、展墙沿左右延伸，不要天花板到地板的大纵深全景
- 角色为十三四岁中学生：只出半身 / 上半身，比例接近真实青少年，校服或简单休闲装，不要幼圆脸、不要儿童绘本那种短手短脚
- 画面中不要出现任何文字、字母、数字、水印、UI
- 柔和教室日光，边缘略有水彩晕染
- 不要写实照片，不要过度饱和的二次元厚涂，不要幼稚贴纸风

---

## lesson-1

- 用途：第一节课核心情境区
- 占位色：`#E8D5B7`
- 建议文件名：`public/scenes/lesson-1.png`

### 中文提示词

青少年水彩插画，超宽横幅 3:1。暖米色初中静物课桌特写横铺画面：正中是未完成的写生——陶罐、衬布、皱起的水彩纸，颜料盘混浊，一支水彩笔停在不满意的笔触上。左右用画桌边缘和虚化画架延伸，不要天花板到地板的全景。午后柔和阳光，纸纤维纹理，画面中不要出现任何文字。

### English prompt

Youth watercolor illustration, ultra-wide 3:1 banner (2400x800). A close-up of a warm beige middle-school still-life desk stretching horizontally: in the center an unfinished study with a ceramic jar, draped cloth, crumpled watercolor paper, a muddy palette, and a brush on an unsatisfying stroke. Desk edges and blurred easels extend left and right; no floor-to-ceiling classroom. Soft afternoon light, paper grain, subject in the vertical center, no text, no letters, no watermark.

---

## lesson-2

- 用途：第二节课核心情境区
- 占位色：`#7A8B99`
- 建议文件名：`public/scenes/lesson-2.png`

### 中文提示词

青少年水彩插画，超宽横幅 3:1。略冷的灰蓝初中美术教室横条构图：两名十三四岁中学生上半身分列画架两侧争执，画架微微倾侧，主体在正中。左右用虚化的同学与画架延伸，不要全身站姿，不要大纵深教室。紧张但克制，柔和教室光线，纸纹理，画面中不要出现任何文字。

### English prompt

Youth watercolor illustration, ultra-wide 3:1 banner (2400x800). A cool gray-blue middle-school art classroom as a horizontal strip: two teenagers around 13–14 shown from the waist up, arguing on either side of a slightly tilting easel in the center. Blurred classmates and easels extend left and right; no full-body standing poses, no deep classroom perspective. Tense but restrained, soft classroom light, paper texture, teenage proportions, no text, no letters, no watermark.

---

## lesson-3

- 用途：第三节课核心情境区
- 占位色：`#3D4F4A`
- 建议文件名：`public/scenes/lesson-3.png`

### 中文提示词

青少年水彩插画，超宽横幅 3:1。墨青色调的初中画桌横铺特写：正中一幅几乎完成的静物作业被打翻的水渍和一道误笔贯穿，颜料沿水平方向向纸边晕开，左右是调色盘和素描本。可惜又安静，柔和侧光，纸纹理，关键细节不要贴上下边，画面中不要出现任何文字。

### English prompt

Youth watercolor illustration, ultra-wide 3:1 banner (2400x800). An ink-teal middle-school desk in a close horizontal still-life: centered, a nearly finished painting ruined by a spilled wash and one accidental stroke, pigment blooming sideways across the paper; palette and sketchbook to the left and right. Quiet regret, soft side light, paper grain, keep key details off the top and bottom edges, no text, no letters, no watermark.

---

## lesson-4

- 用途：第四节课核心情境区
- 占位色：`#C4A574`
- 建议文件名：`public/scenes/lesson-4.png`

### 中文提示词

青少年水彩插画，超宽横幅 3:1。干赭色初中课桌横铺：正中只剩空材料篮和几张素描纸，椅子拉开像刚发现东西丢了；左右桌面留空，水粉管和彩纸不在。空荡但温暖的教室光线，不要远处全景静物台，纸纹理，画面中不要出现任何文字。

### English prompt

Youth watercolor illustration, ultra-wide 3:1 banner (2400x800). A dry ochre middle-school desk stretching horizontally: in the center an empty supply basket and a few blank sketch sheets, a chair pulled back as if the loss was just discovered; empty desk surface left and right, gouache tubes and colored paper missing. Empty but warm classroom light, no distant full classroom, paper texture, subject in the vertical center, no text, no letters, no watermark.

---

## rescue

- 用途：成绩低于 A 时的补救弹层顶部
- 占位色：`#4A3F55`
- 建议文件名：`public/scenes/rescue.png`

### 中文提示词

青少年水彩插画，超宽横幅 3:1。暗紫色速写本横铺在课桌正中摊开，一盏温暖台灯在本子上方投下光晕，左右散落彩色便签和一支铅笔。思考与转机的横条静物，像课后自己想办法，纸纹理，画面中不要出现任何文字。

### English prompt

Youth watercolor illustration, ultra-wide 3:1 banner (2400x800). A dark violet sketchbook open across the center of a desk, a warm lamp glowing above it with a soft halo, colorful sticky notes and a pencil scattered left and right. A horizontal still-life of second chances and after-class problem-solving, paper texture, no text, no letters, no watermark.

---

## ending-pass

- 用途：通关成功结算页
- 占位色：`#D4A84B`
- 建议文件名：`public/scenes/ending-pass.png`

### 中文提示词

青少年水彩插画，超宽横幅 3:1。暖金色初中期末校园艺术展：白色展墙横贯画面，四幅学生写生与创作在正中一字排开，阳光从侧窗洒落，左右可见画架边缘和淡淡纸屑彩带。喜悦而庄重，像正式的学生作品展横条，不要从天花板到地板的展厅全景，纸纹理，画面中不要出现任何文字。

### English prompt

Youth watercolor illustration, ultra-wide 3:1 banner (2400x800). A warm golden middle-school end-of-term art show: a white gallery wall running across the frame, four student studies and original works hung in a row at center, sunlight from a side window, easel edges and faint paper confetti left and right. Joyful and ceremonial, a horizontal exhibition strip rather than a floor-to-ceiling hall, paper texture, no text, no letters, no watermark.

---

## ending-fail

- 用途：未通关结算页
- 占位色：`#6B7280`
- 建议文件名：`public/scenes/ending-fail.png`

### 中文提示词

青少年水彩插画，超宽横幅 3:1。灰蓝色调的速写本在正中横铺摊开，页边有未干的水彩泼溅，左右散落橡皮、未完成的小稿、削过的铅笔和一支放下的笔。安静反思，不阴暗恐怖，像中学生课后复盘的横条静物，纸纹理，画面中不要出现任何文字。

### English prompt

Youth watercolor illustration, ultra-wide 3:1 banner (2400x800). A gray-blue sketchbook lying open across the center, fresh watercolor splashes at the page edges, an eraser, unfinished studies, sharpened pencils, and a resting pen scattered left and right. Quiet after-class reflection as a horizontal still-life, not gloomy or scary, paper texture, no text, no letters, no watermark.
