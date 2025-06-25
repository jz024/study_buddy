#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Study Buddy development environment...\n');

// Function to run a command
const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

const main = async () => {
  try {
    console.log('📦 Installing backend dependencies...');
    await runCommand('npm', ['install']);

    console.log('\n📦 Installing frontend dependencies...');
    await runCommand('npm', ['install'], { cwd: 'frontend' });

    console.log('\n🌱 Starting development servers...');
    console.log('   Backend: http://localhost:5001');
    console.log('   Frontend: http://localhost:3000\n');

    // Start both servers concurrently
    await runCommand('npm', ['run', 'dev:full']);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

main(); 