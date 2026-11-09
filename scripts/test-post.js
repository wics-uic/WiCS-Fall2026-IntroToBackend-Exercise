import fs from 'node:fs';
import path from 'node:path';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key.trim()] = rest.join('=').trim();
  }
}

const url = env.CONTACT_SCRIPT_URL;
const secret = env.CONTACT_SCRIPT_SECRET;

console.log('--- Testing Google Apps Script POST API ---');
console.log('Script URL:', url);
console.log('Secret    :', secret ? '****' : '(none)');

if (!url) {
  console.error('\n❌ Error: CONTACT_SCRIPT_URL is not defined in .env');
  process.exit(1);
}

try {
  const testPayload = {
    name: 'Test Student',
    email: 'test@uic.edu',
    message: 'Hello! Testing sheet connection from WiCS exercise at ' + new Date().toLocaleString(),
    secret: secret,
  };

  console.log('\nSending test payload:', JSON.stringify(testPayload, null, 2));

  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(testPayload),
  });

  console.log('\nHTTP Status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Response body:', text);

  try {
    const json = JSON.parse(text);
    if (json.ok) {
      console.log('\n🎉 SUCCESS! Row appended to Google Sheet successfully.');
    } else {
      console.error('\n❌ Apps Script returned error:', json.error);
    }
  } catch {
    console.log('\n⚠️  Note: Response body was not JSON. If this is HTML (e.g. login or 404 page), check deployment permissions (must be "Who has access: Anyone").');
  }
} catch (err) {
  console.error('\n❌ Fetch failed:', err);
}
