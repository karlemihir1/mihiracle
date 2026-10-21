import os from 'os';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import qrcode from 'qrcode-terminal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const cloudflaredExe = path.join(__dirname, 'cloudflared.exe');

function getLocalIp() {
  const nets = os.networkInterfaces();
  // Prioritize Wi-Fi or Wireless adapters
  for (const name of Object.keys(nets)) {
    if (/wi-fi|wireless|wlan/i.test(name)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }
  // Fallback to any non-internal IPv4
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

function checkPort3001() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001/api/health', { timeout: 1200 }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  console.log('\n===================================================================');
  console.log('   MIHIRACLE - MOBILE & ONLINE LAUNCHER');
  console.log('===================================================================\n');

  const localIp = getLocalIp();

  // 1. Automatically compile any recent frontend changes
  console.log('[*] Checking & compiling latest frontend changes...');
  try {
    const { execSync } = await import('child_process');
    execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
    console.log('[✓] Frontend build ready.');
  } catch (err) {
    console.warn('[!] Using current build.');
  }

  // 2. Ensure backend/frontend server is running on port 3001
  const alreadyRunning = await checkPort3001();
  if (alreadyRunning) {
    console.log('[✓] Mihiracle Server is already active on port 3001.');
  } else {
    console.log('[*] Starting Mihiracle Full-Stack Server on port 3001...');
    const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
      cwd: rootDir,
      shell: true,
      stdio: 'ignore',
      detached: true,
    });
    serverProcess.unref();

    // Wait until server responds
    let ready = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 600));
      ready = await checkPort3001();
      if (ready) break;
    }
    if (ready) {
      console.log('[✓] Mihiracle Server successfully started.');
    } else {
      console.warn('[!] Note: Server is still starting or binding port 3001.');
    }
  }

  console.log('\n[*] Launching Cloudflare Secure Tunnel for remote mobile access...');
  
  // 2. Launch cloudflared tunnel
  const tunnel = spawn(cloudflaredExe, ['tunnel', '--url', 'http://localhost:3001'], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let urlFound = false;

  const processOutput = (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !urlFound) {
      urlFound = true;
      const publicUrl = match[0];

      console.log('\n===================================================================');
      console.log('   MIHIRACLE IS READY FOR MOBILE USE!  🚀');
      console.log('===================================================================\n');

      console.log('📱 OPTION 1: Same Wi-Fi Network (Fastest, zero lag)');
      console.log(`   Link: http://${localIp}:3001\n`);

      console.log('🌐 OPTION 2: Online Anywhere via Cloudflare HTTPS (4G / 5G / Remote)');
      console.log(`   Link: ${publicUrl}\n`);

      console.log('📷 Scan this QR code with your phone camera to open immediately:\n');
      qrcode.generate(publicUrl, { small: true }, (qr) => {
        console.log(qr);
      });

      console.log('💡 TIP FOR MOBILE APPS:');
      console.log('   - iOS Safari: Tap Share -> "Add to Home Screen"');
      console.log('   - Android Chrome: Tap Menu (3 dots) -> "Install app" / "Add to Home Screen"');
      console.log('\n🔄 LIVE CODE UPDATES:');
      console.log('   - Whenever you edit code on PC, double-click `rebuild_app.cmd` (or restart this launcher).');
      console.log('   - Your installed phone app checks for updates automatically and refreshes instantly!');
      console.log('   (Keep this window open while using Mihiracle on your phone)\n');
      console.log('===================================================================\n');
    }
  };

  tunnel.stdout.on('data', processOutput);
  tunnel.stderr.on('data', processOutput);

  tunnel.on('close', (code) => {
    console.log(`[Tunnel closed with code ${code}]`);
  });

  // Handle process termination cleanly
  process.on('SIGINT', () => {
    tunnel.kill();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Fatal launcher error:', err);
});
