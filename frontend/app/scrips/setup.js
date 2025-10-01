#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Configurando vendeSozinho Frontend...')

// Criar estrutura de pastas
const folders = [
  'app/(auth)/login',
  'app/(dashboard)/dashboard',
  'app/(dashboard)/generator',
  'app/(dashboard)/templates',
  'app/(dashboard)/history',
  'app/(dashboard)/profile',
  'app/api/auth',
  'components/ui',
  'components/auth',
  'components/dashboard',
  'components/generator',
  'components/providers',
  'lib',
  'hooks',
  'types',
  'public/images',
]

folders.forEach(folder => {
  const fullPath = path.join(process.cwd(), folder)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`✅ Criado: ${folder}`)
  }
})

// Verificar dependências
console.log('📦 Verificando dependências...')

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const requiredDeps = [
  'next',
  'react',
  'tailwindcss',
  '@tanstack/react-query',
  'framer-motion',
  'lucide-react'
]

const missingDeps = requiredDeps.filter(dep => 
  !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
)

if (missingDeps.length > 0) {
  console.log('⚠️ Dependências faltando:', missingDeps.join(', '))
} else {
  console.log('✅ Todas as dependências estão instaladas')
}

console.log('🎉 Setup concluído!')