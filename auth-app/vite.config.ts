import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { config } from 'dotenv';

// Load environment variables
config();

export default defineConfig({
	plugins: [sveltekit()],
	// Performance optimizations
	build: {
		target: 'esnext', // Target modern browsers for better performance
		minify: 'esbuild', // Use esbuild for faster minification
		rollupOptions: {
			output: {
				manualChunks: {
					// Split vendor chunks for better caching
					vendor: ['@auth/core', '@auth/sveltekit', '@auth/drizzle-adapter'],
					ui: ['svelte', '@sveltejs/kit']
				}
			}
		}
	},
	// Development optimizations
	server: {
		fs: {
			allow: ['..'] // Allow access to parent directory for better development
		}
	},
	// Optimize dependencies
	optimizeDeps: {
		include: ['@auth/core', '@auth/sveltekit', '@auth/drizzle-adapter', 'drizzle-orm']
	}
});
