import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px',
			}
		},
		extend: {
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '100%',
						color: 'var(--tw-prose-body)',
						'[class~="lead"]': {
							color: 'var(--tw-prose-lead)',
						},
						a: {
							color: 'var(--tw-prose-links)',
							textDecoration: 'underline',
							fontWeight: '500',
						},
						strong: {
							color: 'var(--tw-prose-bold)',
							fontWeight: '600',
						},
						'ol[type="A"]': {
							'--list-counter-style': 'upper-alpha',
						},
						'ol[type="a"]': {
							'--list-counter-style': 'lower-alpha',
						},
						'ol[type="A" s]': {
							'--list-counter-style': 'upper-alpha',
						},
						'ol[type="a" s]': {
							'--list-counter-style': 'lower-alpha',
						},
						'ol[type="I"]': {
							'--list-counter-style': 'upper-roman',
						},
						'ol[type="i"]': {
							'--list-counter-style': 'lower-roman',
						},
						'ol[type="I" s]': {
							'--list-counter-style': 'upper-roman',
						},
						'ol[type="i" s]': {
							'--list-counter-style': 'lower-roman',
						},
						'ol[type="1"]': {
							'--list-counter-style': 'decimal',
						},
						'ol > li': {
							position: 'relative',
						},
						'ol > li::before': {
							content: 'counter(list-item, var(--list-counter-style, decimal)) "."',
							position: 'absolute',
							fontWeight: '400',
							color: 'var(--tw-prose-counters)',
						},
						'ul > li': {
							position: 'relative',
						},
						'ul > li::before': {
							content: '""',
							position: 'absolute',
							backgroundColor: 'var(--tw-prose-bullets)',
							borderRadius: '50%',
						},
						hr: {
							borderColor: 'var(--tw-prose-hr)',
							borderTopWidth: 1,
						},
						blockquote: {
							fontWeight: '500',
							fontStyle: 'italic',
							color: 'var(--tw-prose-quotes)',
							borderLeftWidth: '0.25rem',
							borderLeftColor: 'var(--tw-prose-quote-borders)',
							quotes: '"\\201C""\\201D""\\2018""\\2019"',
						},
						'blockquote p:first-of-type::before': {
							content: 'open-quote',
						},
						'blockquote p:last-of-type::after': {
							content: 'close-quote',
						},
						h1: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '800',
						},
						'h1 strong': {
							fontWeight: '900',
							color: 'inherit',
						},
						h2: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '700',
						},
						'h2 strong': {
							fontWeight: '800',
							color: 'inherit',
						},
						h3: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '600',
						},
						'h3 strong': {
							fontWeight: '700',
							color: 'inherit',
						},
						h4: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '600',
						},
						'h4 strong': {
							fontWeight: '700',
							color: 'inherit',
						},
						img: {
							maxWidth: '100%',
							height: 'auto',
						},
						'pre': {
							color: 'var(--tw-prose-pre-code)',
							backgroundColor: 'var(--tw-prose-pre-bg)',
							overflowX: 'auto',
							fontWeight: '400',
						},
						'pre code': {
							backgroundColor: 'transparent',
							borderWidth: '0',
							borderRadius: '0',
							padding: '0',
							fontWeight: 'inherit',
							color: 'inherit',
							fontSize: 'inherit',
							fontFamily: 'inherit',
							lineHeight: 'inherit',
						},
						'code': {
							color: 'var(--tw-prose-code)',
							fontWeight: '600',
						},
						'code::before': {
							content: '"`"',
						},
						'code::after': {
							content: '"`"',
						},
						'a code': {
							color: 'inherit',
						},
					},
				},
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				fintech: {
					blue: {
						DEFAULT: 'hsl(var(--fintech-blue))',
						light: 'hsl(var(--fintech-blue-light))',
						dark: 'hsl(var(--fintech-blue-dark))',
					},
					orange: {
						DEFAULT: 'hsl(var(--fintech-orange))',
						light: 'hsl(var(--fintech-orange-light))',
						dark: 'hsl(var(--fintech-orange-dark))',
					},
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				display: ['Lexend', 'system-ui', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-down': {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-right': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'zoom-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				shimmer: {
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.7s ease-out',
				'fade-up': 'fade-up 0.7s ease-out',
				'fade-down': 'fade-down 0.7s ease-out',
				'fade-right': 'fade-right 0.7s ease-out',
				'slide-up': 'slide-up 0.7s ease-out',
				'zoom-in': 'zoom-in 0.7s ease-out',
				'float': 'float 5s ease-in-out infinite',
				'shimmer': 'shimmer 1.5s infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--gradient-color-stops))',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography'),
	],
} satisfies Config;

export default config;
