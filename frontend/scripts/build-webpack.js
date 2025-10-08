import { spawnSync } from 'child_process';

// Força build tradicional com webpack
process.env.NEXT_DISABLE_TURBOPACK = '1';
console.log('??  Forçando build com Webpack clássico...');

const result = spawnSync('npx', ['next', 'build'], { stdio: 'inherit', shell: true });
process.exit(result.status);
