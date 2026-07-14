// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://abdussamedulutas.github.io/saqut',
	integrations: [
		starlight({
			title: 'saQut',
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
					label: 'Start Here',
					translations: { tr: 'Başlangıç' },
					items: [
						{ label: 'Getting Started', translations: { tr: 'Hızlı Başlangıç' }, slug: 'getting-started' },
						{ label: 'Variables', translations: { tr: 'Değişkenler' }, slug: 'variables' },
						{ label: 'Data Types', translations: { tr: 'Veri Tipleri' }, slug: 'data-types' },
						{ label: 'Operators', translations: { tr: 'Operatörler' }, slug: 'operators' },
					],
				},
				{
					label: 'Control Flow',
					translations: { tr: 'Kontrol Akışı' },
					items: [
						{ label: 'if / else', slug: 'if-else' },
						{ label: 'switch / case', slug: 'switch' },
						{ label: 'for Loop', translations: { tr: 'for Döngüsü' }, slug: 'loops/for-loop' },
						{ label: 'while Loop', translations: { tr: 'while Döngüsü' }, slug: 'loops/while-loop' },
						{ label: 'do-while Loop', translations: { tr: 'do-while Döngüsü' }, slug: 'loops/do-while-loop' },
					],
				},
				{
					label: 'Functions & Data',
					translations: { tr: 'Fonksiyonlar & Veri' },
					items: [
						{ label: 'Functions', translations: { tr: 'Fonksiyonlar' }, slug: 'functions' },
						{ label: 'Structs', translations: { tr: 'Struct (Yapılar)' }, slug: 'structs' },
						{ label: 'Arrays', translations: { tr: 'Diziler' }, slug: 'arrays' },
						{ label: 'Strings', translations: { tr: 'Metinler' }, slug: 'strings' },
					],
				},
				{
					label: 'Built-ins & Modules',
					translations: { tr: 'Yerleşikler & Modüller' },
					items: [
						{ label: 'Built-in Functions', translations: { tr: 'Yerleşik Fonksiyonlar' }, slug: 'builtin-functions' },
						{ label: 'Modules (import / export)', translations: { tr: 'Modüller (import / export)' }, slug: 'modules' },
					],
				},
				{
					label: 'Advanced',
					translations: { tr: 'İleri Konular' },
					items: [
						{ label: 'Error Handling', translations: { tr: 'Hata Yönetimi' }, slug: 'error-handling' },
						{ label: 'Compiler Errors', translations: { tr: 'Derleyici Hataları' }, slug: 'compiler-errors' },
					],
				},
				{
					label: 'Under the Hood',
					translations: { tr: 'Perde Arkası' },
					items: [
						{ label: 'Compiler Tools', translations: { tr: 'Derleyici Araçları' }, slug: 'compiler-tools' },
						{ label: 'Optimization', translations: { tr: 'Optimizasyon' }, slug: 'optimization' },
						{ label: 'Garbage Collection', translations: { tr: 'Çöp Toplama' }, slug: 'garbage-collection' },
					],
				},
			],
		}),
	],
});
