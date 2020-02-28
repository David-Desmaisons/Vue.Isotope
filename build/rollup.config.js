import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import { eslint } from 'rollup-plugin-eslint';

export default {
    input: 'src/wrapper.js', // Path relative to package.json
    output: {
        name: 'Isotope',
        exports: 'named',
    },
    plugins: [
        eslint({
            exclude: ['node_modules/**', 'dist/**'],
        }),
        terser({
            output: {
                comments: false,
            },
        }),
        buble(),
        resolve(),
        commonjs(),
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
    ],
};