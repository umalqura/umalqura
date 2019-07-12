import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
    input: './src/index.ts',
    output: [{
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
        },
        {
            file: pkg.umd,
            format: 'iife',
            name: pkg.umd_name,
        }
    ],
    plugins: [
        typescript({
            typescript: require('typescript')
        })
    ]
};
