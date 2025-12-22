/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Сдержанная корпоративная цветовая схема с улучшенной контрастностью для мобильных
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        background: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
        },
        // Мобильно-ориентированные цвета для состояний
        mobile: {
          touch: '#3b82f6',
          active: '#2563eb',
          disabled: '#94a3b8',
        }
      },
      
      // Оптимизированные шрифты для мобильных устройств
      fontFamily: {
        sans: [
          'Inter', 
          'SF Pro Display', 
          'SF Pro Text', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
        mobile: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      
      // Расширенные breakpoints для мобильных устройств
      screens: {
        'xs': '375px',   // iPhone SE и подобные
        'sm': '480px',   // Большие смартфоны
        'md': '640px',   // Планшеты в портретной ориентации
        'lg': '768px',   // Планшеты в альбомной ориентации
        'xl': '1024px',  // Десктопы
        '2xl': '1280px', // Большие десктопы
        '3xl': '1536px', // Очень большие экраны
        // Специальные breakpoints для мобильной разработки
        'mobile-sm': {'max': '479px'},
        'mobile-lg': {'min': '480px', 'max': '767px'},
        'tablet': {'min': '640px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
      },
      
      // Расширенный spacing с поддержкой safe areas и touch-friendly размеров
      spacing: {
        // Safe areas для мобильных устройств
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-x': 'env(safe-area-inset-left) env(safe-area-inset-right)',
        'safe-y': 'env(safe-area-inset-top) env(safe-area-inset-bottom)',
        'safe-all': 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        
        // Touch-friendly размеры (минимум 44px согласно iOS Human Interface Guidelines)
        'touch': '44px',
        'touch-sm': '36px',
        'touch-lg': '52px',
        'touch-xl': '60px',
        
        // Дополнительные отступы для мобильных
        'mobile-xs': '0.125rem', // 2px
        'mobile-sm': '0.25rem',  // 4px
        'mobile-md': '0.5rem',   // 8px
        'mobile-lg': '0.75rem',  // 12px
        'mobile-xl': '1rem',     // 16px
        'mobile-2xl': '1.5rem',  // 24px
        'mobile-3xl': '2rem',    // 32px
        'mobile-4xl': '3rem',    // 48px
        
        // Плотность для мобильных интерфейсов
        'dense': '0.75rem',
        'dense-sm': '0.5rem',
        'dense-lg': '1rem',
      },
      
      // Touch-friendly размеры элементов
      minHeight: {
        'touch': '44px',
        'touch-sm': '36px', 
        'touch-lg': '52px',
        'touch-xl': '60px',
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      
      minWidth: {
        'touch': '44px',
        'touch-sm': '36px',
        'touch-lg': '52px',
        'touch-xl': '60px',
      },
      
      // Размеры для мобильных компонентов
      height: {
        'screen-mobile': 'calc(100vh - 4rem)', // Вычитаем высоту мобильной навигации
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        'touch': '44px',
        'touch-sm': '36px',
        'touch-lg': '52px',
        'touch-xl': '60px',
      },
      
      width: {
        'screen-mobile': '100vw',
        'touch': '44px',
        'touch-sm': '36px', 
        'touch-lg': '52px',
        'touch-xl': '60px',
      },
      
      // Улучшенные тени для мобильных
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'mobile': '0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'mobile-lg': '0 4px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.05)',
        'elevation': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevation-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      
      // Анимации для мобильных
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-subtle': 'bounce-subtle 0.3s ease-out',
        'pulse-soft': 'pulse-soft 2s infinite',
      },
      
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      
      // Z-index для мобильных компонентов
      zIndex: {
        'dropdown': '50',
        'sticky': '40',
        'modal': '60',
        'popover': '70',
        'tooltip': '80',
        'mobile-nav': '100',
        'mobile-overlay': '110',
        'mobile-menu': '120',
      },
      
      // Border radius для мобильных
      borderRadius: {
        'mobile': '0.5rem',
        'mobile-sm': '0.375rem',
        'mobile-lg': '0.75rem',
        'mobile-xl': '1rem',
      },
      
      // Typography для мобильных
      fontSize: {
        'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'mobile-base': ['1rem', { lineHeight: '1.5rem' }],
        'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'mobile-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      
      // Gap для мобильных grid/flex layouts
      gap: {
        'mobile-xs': '0.25rem',
        'mobile-sm': '0.5rem',
        'mobile-md': '0.75rem',
        'mobile-lg': '1rem',
        'mobile-xl': '1.5rem',
        'touch': '0.75rem',
      },
      
      // Padding/Margin для мобильных
      padding: {
        'touch': '0.75rem 1rem',
        'touch-sm': '0.5rem 0.75rem',
        'touch-lg': '1rem 1.5rem',
      },
      
      margin: {
        'touch': '0.75rem 0',
        'touch-sm': '0.5rem 0',
        'touch-lg': '1rem 0',
      },
    },
  },
  
  plugins: [
    // Кастомный плагин для мобильных утилит
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Touch-friendly utilities
        '.touch-action-manipulation': {
          'touch-action': 'manipulation',
        },
        '.touch-action-none': {
          'touch-action': 'none',
        },
        '.touch-action-auto': {
          'touch-action': 'auto',
        },
        
        // Safe area utilities
        '.pt-safe': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.pb-safe': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.pl-safe': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.pr-safe': {
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.px-safe': {
          'padding-left': 'env(safe-area-inset-left)',
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.py-safe': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        
        // Mobile-specific utilities
        '.scroll-smooth-mobile': {
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
        },
        '.overscroll-none': {
          'overscroll-behavior': 'none',
        },
        '.overscroll-y-none': {
          'overscroll-behavior-y': 'none',
        },
        '.overscroll-x-none': {
          'overscroll-behavior-x': 'none',
        },
        
        // Mobile typography
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        
        // Mobile focus styles
        '.focus-visible-mobile': {
          '&:focus-visible': {
            outline: '2px solid #3b82f6',
            'outline-offset': '2px',
          },
        },
        
        // Mobile-safe scrolling containers
        '.scroll-container': {
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
          '&::-webkit-scrollbar': {
            'display': 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        
        // Mobile-optimized transforms
        '.transform-gpu': {
          'transform': 'translateZ(0)',
          'will-change': 'transform',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
};