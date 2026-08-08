import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

function logStep(msg="") {
  console.log(`\n=== ${msg} ===`);
}

function runCmd(cmd="") {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: projectRoot });
}

async function prepareDeployment() {
  console.log('Starting Pre-Deployment Quality Audit & Vercel Readiness Check...');

  // 1. TypeScript Validation
  logStep('1/4 Running TypeScript Type Check');
  try {
    runCmd('npx tsc --noEmit');
    console.log('TypeScript check passed with 0 errors.');
  } catch (err) {
    console.error('TypeScript check failed. Please resolve type errors before deploying.');
    process.exit(1);
  }

  // 2. Production Build Validation
  logStep('2/4 Running Next.js Production Build Validation');
  try {
    runCmd('npx next build');
    console.log('Production build validation succeeded.');
  } catch (err) {
    console.error('Production build failed. Please fix build issues before deploying.');
    process.exit(1);
  }

  // 3. Environment & Configuration Check
  logStep('3/4 Auditing Project Configuration & Security Exclusions');
  const gitignorePath = path.join(projectRoot, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes('.env*')) {
      console.warn('Warning: .env files are not explicitly ignored in .gitignore');
    }
  }

  const vercelJsonPath = path.join(projectRoot, 'vercel.json');
  if (!fs.existsSync(vercelJsonPath)) {
    console.warn('Warning: vercel.json missing. Defaulting to Next.js Vercel preset.');
  } else {
    console.log('vercel.json verified.');
  }

  // 4. Git Repository & Vercel Auto-Deployment Link Creation
  logStep('4/4 Git Repository Status & Vercel Deployment Link');
  let remoteUrl = '';
  try {
    remoteUrl = execSync('git config --get remote.origin.url', { cwd: projectRoot }).toString().trim();
  } catch {
    console.log('Git remote origin not yet set.');
  }

  let vercelDeployUrl = 'https://vercel.com/new';
  if (remoteUrl) {
    // Normalize SSH git URL to HTTPS if needed
    let httpUrl = remoteUrl.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
    vercelDeployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(httpUrl)}`;
  }

  console.log('\n================================================================');
  console.log(' PRE-DEPLOYMENT AUDIT PASSED 100% SUCCESSFUL!');
  console.log('================================================================');
  if (remoteUrl) {
    console.log(`Git Remote Origin: ${remoteUrl}`);
  }
  console.log(`\nDirect Vercel Deployment Link:\n${vercelDeployUrl}\n`);

  // Attempt to automatically open the browser deployment link
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${vercelDeployUrl}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${vercelDeployUrl}"`);
    } else {
      execSync(`xdg-open "${vercelDeployUrl}"`);
    }
    console.log('Opening Vercel import page in browser...');
  } catch {
    console.log('Copy and paste the URL above into your browser to complete Vercel setup.');
  }
}

prepareDeployment().catch((err) => {
  console.error('Pre-deployment script error:', err);
  process.exit(1);
});
