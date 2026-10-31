import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').pop() || 'wells'

export default defineConfig({ base: `/${repositoryName}/`, plugins: [react()] })
