// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://saqut.com',
	integrations: [
		sitemap(),
		starlight({
			title: 'saQut',
			logo: {
				src: './public/saqut-logo.png',
				alt: 'saQut',
			},
			favicon: '/favicon.ico',
			head: [
				// PNG favicon fallback for browsers that prefer it
				{
					tag: 'link',
					attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
				},
				{
					tag: 'link',
					attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
				},
				// Home-screen icon for iOS
				{
					tag: 'link',
					attrs: { rel: 'apple-touch-icon', href: '/favicon-32.png' },
				},
				// Default social share preview image, used by every page unless
				// overridden in that page's own frontmatter `head`.
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://saqut.com/og-image.png' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: 'https://saqut.com/og-image.png' },
				},
			],
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en',
				},
				tr: {
					label: 'Türkçe',
					lang: 'tr',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/saqutlang/saqut' },
			],
			sidebar: [
				{
					label: 'Introduction',
					translations: { tr: 'Giriş' },
					items: [
						{ label: 'What is saQut', translations: { tr: 'saQut Nedir' }, slug: 'what-is-saqut' },
						{ label: 'Hello World', translations: { tr: 'Merhaba Dünya' }, slug: 'hello-world' },
						{ label: 'Getting Started', translations: { tr: 'Hızlı Başlangıç' }, slug: 'getting-started' },
						{ label: 'Editor Setup', translations: { tr: 'Editör Kurulumu' }, slug: 'editor-setup' },
					],
				},
				{
					label: 'Learn the Language',
					translations: { tr: 'Dili Öğren' },
					items: [
						{ label: 'What is Programming', translations: { tr: 'Programlama Nedir' }, slug: 'what-is-programming' },
						{
							label: 'Variables, Data, Operators',
							translations: { tr: 'Değişkenler, Veri, Operatörler' },
							collapsed: true,
							items: [
								{ label: 'Variables', translations: { tr: 'Değişkenler' }, slug: 'variables' },
								{ label: 'Data Types', translations: { tr: 'Veri Tipleri' }, slug: 'data-types' },
								{ label: 'Nullable Types', translations: { tr: 'Nullable Tipler' }, slug: 'nullable-types' },
								{ label: 'Operators', translations: { tr: 'Operatörler' }, slug: 'operators' },
								{ label: 'Type Casting (as)', translations: { tr: 'Tip Dönüşümü (as)' }, slug: 'type-casting' },
							],
						},
						{
							label: 'Control Flow',
							translations: { tr: 'Kontrol Akışı' },
							collapsed: true,
							items: [
								{ label: 'if / else', slug: 'if-else' },
								{ label: 'switch / case', slug: 'switch' },
								{ label: 'for Loop', translations: { tr: 'for Döngüsü' }, slug: 'loops/for-loop' },
								{ label: 'while Loop', translations: { tr: 'while Döngüsü' }, slug: 'loops/while-loop' },
								{ label: 'do-while Loop', translations: { tr: 'do-while Döngüsü' }, slug: 'loops/do-while-loop' },
							],
						},
						{
							label: 'Functions & Data Structures',
							translations: { tr: 'Fonksiyonlar & Veri Yapıları' },
							collapsed: true,
							items: [
								{ label: 'Functions', translations: { tr: 'Fonksiyonlar' }, slug: 'functions' },
								{ label: 'Structs', translations: { tr: 'Struct (Yapılar)' }, slug: 'structs' },
								{ label: 'Arrays', translations: { tr: 'Diziler' }, slug: 'arrays' },
								{ label: 'Strings', translations: { tr: 'Metinler' }, slug: 'strings' },
								{ label: 'Enums', translations: { tr: 'Enum' }, slug: 'enums' },
							],
						},
						{ label: 'Error Handling', translations: { tr: 'Hata Yönetimi' }, slug: 'error-handling' },
						{ label: 'Modules (import / export)', translations: { tr: 'Modüller (import / export)' }, slug: 'modules' },
						{ label: 'Build a Task Tracker', translations: { tr: 'Görev Takip Programı' }, slug: 'tutorial-task-tracker' },
					],
				},
				{
					label: 'Libraries',
					translations: { tr: 'Kütüphaneler' },
					items: [
						{ label: 'Built-in Functions', translations: { tr: 'Yerleşik Fonksiyonlar' }, slug: 'builtin-functions' },
						{ label: 'Standard Library', translations: { tr: 'Standart Kütüphane' }, slug: 'stdlib-overview' },
						{ label: 'fs', translations: { tr: 'fs' }, slug: 'stdlib-fs' },
						{ label: 'path', translations: { tr: 'path' }, slug: 'stdlib-path' },
						{ label: 'utf8', translations: { tr: 'utf8' }, slug: 'stdlib-utf8' },
						{ label: 'stdin / stdout / stderr', slug: 'stdlib-io' },
						{ label: 'sys', translations: { tr: 'sys' }, slug: 'stdlib-sys' },
						{ label: 'process', translations: { tr: 'process' }, slug: 'stdlib-process' },
						{ label: 'os / terminal', slug: 'stdlib-os' },
						{ label: 'math', translations: { tr: 'math' }, slug: 'stdlib-math' },
						{ label: 'date', translations: { tr: 'date' }, slug: 'stdlib-date' },
						{ label: 'FFI', translations: { tr: 'FFI' }, slug: 'ffi' },
						{ label: 'CLI Reference', translations: { tr: 'CLI Referansı' }, slug: 'cli-reference' },
					],
				},
				{
					label: 'Under the Hood',
					translations: { tr: 'Perde Arkası' },
					items: [
						{ label: 'Compiler Tools', translations: { tr: 'Derleyici Araçları' }, slug: 'compiler-tools' },
						{ label: 'Compiler Errors', translations: { tr: 'Derleyici Hataları' }, slug: 'compiler-errors' },
						{ label: 'Optimization', translations: { tr: 'Optimizasyon' }, slug: 'optimization' },
						{ label: 'Memory Management', translations: { tr: 'Bellek Yönetimi' }, slug: 'garbage-collection' },
					],
				},
			],
		}),
	],
});
