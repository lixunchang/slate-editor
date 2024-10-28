import { defineConfig } from 'dumi';

export default defineConfig({
    base: '/slate-editor',
    publicPath: '/slate-editor',
    exportStatic: {}, // 将所有路由输出为 HTML 目录结构，以免刷新页面时 404
    // 其他配置
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'slate-editor',
  },
  lessLoader: {}
});
