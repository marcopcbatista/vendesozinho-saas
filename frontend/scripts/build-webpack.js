import { spawnSync } from 'child_process';

// For�a build tradicional com webpack
process.env.NEXT_DISABLE_TURBOPACK = '1';
console.log('??  For�ando build com Webpack cl�ssico...');

const result = spawnSync('npx', ['next', 'build'], { stdio: 'inherit', shell: true });
process.exit(result.status);
