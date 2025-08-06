#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Geo Dashboard Deployment Script');
console.log('=====================================');

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ Not a git repository. Initializing...');
  execSync('git init');
  console.log('✅ Git repository initialized');
}

// Check for uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('📝 Committing changes...');
    execSync('git add .');
    execSync('git commit -m "Ready for deployment - Mind Webs Venture Assignment"');
    console.log('✅ Changes committed');
  }
} catch (error) {
  console.log('⚠️  Could not commit changes:', error.message);
}

console.log('\n🎯 Deployment Options:');
console.log('1. Vercel (Recommended for Next.js)');
console.log('   - Visit: https://vercel.com');
console.log('   - Import your GitHub repository');
console.log('   - Deploy with default settings');
console.log('');
console.log('2. Netlify');
console.log('   - Visit: https://netlify.com');
console.log('   - Connect GitHub repository');
console.log('   - Build command: npm run build');
console.log('');
console.log('3. Manual build for other hosting:');
console.log('   - Run: npm run build');
console.log('   - Upload .next folder to your host');

console.log('\n✅ Project is ready for deployment!');
console.log('📋 Don\'t forget to update README.md with your deployed URL');