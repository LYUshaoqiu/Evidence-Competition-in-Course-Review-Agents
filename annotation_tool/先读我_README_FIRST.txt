先读我：离线标注包使用说明

不需要安装任何依赖。
只需要一台电脑和现代浏览器，例如 Edge、Chrome、Firefox。

正确使用方式：
1. 先把整个 zip 解压到一个普通文件夹，例如桌面。
2. 打开 annotation_tool 文件夹。
3. 推荐双击 START_HERE_单文件版.html。
4. 在右上角填写 annotator_id / 标注人 ID。
5. 点击“导入评论 CSV”。
6. 选择 data 文件夹里的 selected_38_courses_ge8_comments_20260706.csv。
7. 只标自己被分配到的课程。
8. 每天结束前导出三份 CSV 并发回。

不要这样做：
- 不要直接在 zip 压缩包里面双击 index.html。
- 不要直接从微信/QQ临时目录打开后开始正式标注。
- 不要清浏览器缓存，否则 localStorage 里的未导出标注可能丢失。

如果打开后页面像没有排版一样，通常是因为没有解压 zip，CSS/JS 没有加载。
解决方法：完整解压 zip，然后打开 START_HERE_单文件版.html。