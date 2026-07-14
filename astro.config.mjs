// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://abdussamedulutas.github.io/saqut',
	integrations: [
		starlight({
			title: 'saQut',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/abdussamedulutas/saqut' },
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Getting Started', slug: 'getting-started' },
						{ label: 'Variables', slug: 'variables' },
						{ label: 'Data Types', slug: 'data-types' },
						{ label: 'Operators', slug: 'operators' },
					],
				},
				{
					label: 'Control Flow',
					items: [
						{ label: 'if / else', slug: 'if-else' },
						{ label: 'switch / case', slug: 'switch' },
						{ label: 'for Loop', slug: 'loops/for-loop' },
						{ label: 'while Loop', slug: 'loops/while-loop' },
						{ label: 'do-while Loop', slug: 'loops/do-while-loop' },
					],
				},
				{
					label: 'Functions & Data',
					items: [
						{ label: 'Functions', slug: 'functions' },
						{ label: 'Structs', slug: 'structs' },
						{ label: 'Arrays', slug: 'arrays' },
						{ label: 'Strings', slug: 'strings' },
					],
				},
				{
					label: 'Built-ins & Modules',
					items: [
						{ label: 'Built-in Functions', slug: 'builtin-functions' },
						{ label: 'Modules (import / export)', slug: 'modules' },
					],
				},
				{
					label: 'Advanced',
					items: [
						{ label: 'Error Handling', slug: 'error-handling' },
						{ label: 'Compiler Errors', slug: 'compiler-errors' },
					],
				},
				{
					label: 'Under the Hood',
					items: [
						{ label: 'Compiler Tools', slug: 'compiler-tools' },
						{ label: 'Optimization', slug: 'optimization' },
						{ label: 'Garbage Collection', slug: 'garbage-collection' },
					],
				},
			],
		}),
	],
});
