import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import PeerDepsExternalPlugin from 'rollup-plugin-peer-deps-external'
import { readFile } from 'fs/promises'

const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.url)))

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: packageJson.main,
				format: 'cjs',
				sourcemap: false
			},
			{
				file: packageJson.module,
				format: 'esm',
				sourcemap: false
			}
		],
		watch: {
			exclude: ['/__mocks__/', '/__tests__/']
		},
		plugins: [
			resolve(),
			commonjs(),
			PeerDepsExternalPlugin(),
			typescript({
				tsconfig: './tsconfig.json',
				sourceMap: false
			}),
			terser()
		],
		external: ['react', 'react-dom']
	},
	{
		input: 'dist/esm/types/index.d.ts',
		output: [{ file: 'dist/index.d.ts', format: 'esm' }],
		plugins: [dts()]
	}
]
