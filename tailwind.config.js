/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        classroom: {
          bg: '#F4F7F5',
          stage: '#FFFFFF',
          playground: '#E8EEEA',
          border: '#9BB0A6',
        },
        // 近黑字优先对比度，略带绿意；辅文同样够深，方便白天投影
        text: {
          primary: '#0A1210',
          secondary: '#1F2E28',
        },
        accent: {
          DEFAULT: '#0A5C4F',
          hover: '#084A40',
          muted: '#C5E0D6',
        },
        // 揭示、提示等关键节点的暖色点缀，与青绿形成冷暖对比
        highlight: {
          DEFAULT: '#9A3412',
          muted: '#FDEAD7',
        },
        error: '#b3261e',
        success: '#166534',
        // 代码与程序输出区：深墨绿黑，与主色调呼应而非纯黑
        code: {
          bg: '#12211c',
          border: '#2c453c',
          text: '#eef5f0',
          muted: '#9ab5a8',
          error: '#ff8a80',
        },
      },
      fontSize: {
        xs: ['0.9375rem', { lineHeight: '1.5' }],
        sm: ['1.125rem', { lineHeight: '1.5' }],
        base: ['1.375rem', { lineHeight: '1.6' }],
        lg: ['1.625rem', { lineHeight: '1.5' }],
        xl: ['1.875rem', { lineHeight: '1.4' }],
        '2xl': ['2.25rem', { lineHeight: '1.3' }],
        '3xl': ['2.875rem', { lineHeight: '1.2' }],
        '4xl': ['3.25rem', { lineHeight: '1.15' }],
        // 舞台字号抬一档：后排投影可读（body≈42px，sub≈34px）
        'stage-hero': ['5.75rem', { lineHeight: '1.1', letterSpacing: '0.01em' }],
        'stage-headline': ['3.75rem', { lineHeight: '1.2', letterSpacing: '0.01em' }],
        'stage-body': ['2.625rem', { lineHeight: '1.55' }],
        'stage-sub': ['2.125rem', { lineHeight: '1.5' }],
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
        // 楷体仅用于金句/引言；大标题用无衬线加粗
        display: ['"Kaiti SC"', 'STKaiti', '"华文楷体"', 'KaiTi', '楷体', 'serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 52, 43, 0.04), 0 8px 24px rgba(20, 52, 43, 0.06)',
        lift: '0 2px 4px rgba(20, 52, 43, 0.06), 0 16px 40px rgba(20, 52, 43, 0.10)',
      },
      borderRadius: {
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
