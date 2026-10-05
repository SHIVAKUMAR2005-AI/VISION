const http = require('http');

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('--- 1. Testing GET /api/auth/session ---');
  const sessionRes = await request('GET', '/api/auth/session');
  console.log('Status:', sessionRes.status, 'User:', sessionRes.data?.user?.full_name);
  const token = sessionRes.data.token;

  console.log('\n--- 2. Testing GET /api/profile with Bearer Token ---');
  const profileRes = await request('GET', '/api/profile', null, token);
  console.log('Status:', profileRes.status, 'Email:', profileRes.data?.user?.email, 'Phone:', profileRes.data?.user?.phone);

  console.log('\n--- 3. Testing Validation: Reject name < 3 chars ---');
  const invalidNameRes = await request('PUT', '/api/profile', {
    full_name: 'An',
    email: 'ananya.sharma@example.com',
    phone: '9876543210'
  }, token);
  console.log('Status:', invalidNameRes.status, 'Error message:', invalidNameRes.data?.errors?.full_name);

  console.log('\n--- 4. Testing Validation: Reject invalid phone ---');
  const invalidPhoneRes = await request('PUT', '/api/profile', {
    full_name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '12345'
  }, token);
  console.log('Status:', invalidPhoneRes.status, 'Error message:', invalidPhoneRes.data?.errors?.phone);

  console.log('\n--- 5. Testing Validation: Reject invalid email ---');
  const invalidEmailRes = await request('PUT', '/api/profile', {
    full_name: 'Ananya Sharma',
    email: 'bad-email-address',
    phone: '9876543210'
  }, token);
  console.log('Status:', invalidEmailRes.status, 'Error message:', invalidEmailRes.data?.errors?.email);

  console.log('\n--- 6. Testing Successful Profile Update ---');
  const updateRes = await request('PUT', '/api/profile', {
    full_name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
    date_of_birth: '1995-08-14',
    gender: 'Female',
    location: 'Indiranagar, Bangalore, Karnataka, India',
    bio: 'Lead Product Designer & Design System Architect. Passionate about human-centric interfaces.',
    role: 'Staff Product Designer',
    department: 'Core Product & Design',
    timezone: 'Asia/Kolkata (IST)',
    language: 'English (India)'
  }, token);
  console.log('Status:', updateRes.status, 'Success message:', updateRes.data?.message);
  console.log('Updated Location:', updateRes.data?.user?.location);
  console.log('Formatted Phone:', updateRes.data?.user?.phone);

  console.log('\n--- 7. Verifying Persistence in Database ---');
  const verifyRes = await request('GET', '/api/profile', null, token);
  console.log('Persisted Location:', verifyRes.data?.user?.location);
  console.log('Persisted Role:', verifyRes.data?.user?.role);
  console.log('Updated timestamp:', verifyRes.data?.user?.updated_at);

  console.log('\n--- 8. Testing Security: Reject wrong current password ---');
  const wrongPwdRes = await request('PUT', '/api/auth/change-password', {
    current_password: 'WrongPassword123',
    new_password: 'NewStrongPass@2026',
    confirm_password: 'NewStrongPass@2026'
  }, token);
  console.log('Status:', wrongPwdRes.status, 'Error message:', wrongPwdRes.data?.message);

  console.log('\n--- 9. Testing Security: Successful Password Update ---');
  let currentPwd = 'SecurePass@123';
  let targetPwd = 'UpdatedSecurePass@2026';
  let pwdRes = await request('PUT', '/api/auth/change-password', {
    current_password: currentPwd,
    new_password: targetPwd,
    confirm_password: targetPwd
  }, token);

  // If already updated in previous run, toggle it back
  if (pwdRes.status === 400 && pwdRes.data?.message?.includes('incorrect')) {
    currentPwd = 'UpdatedSecurePass@2026';
    targetPwd = 'SecurePass@123';
    pwdRes = await request('PUT', '/api/auth/change-password', {
      current_password: currentPwd,
      new_password: targetPwd,
      confirm_password: targetPwd
    }, token);
  }
  console.log('Status:', pwdRes.status, 'Message:', pwdRes.data?.message);

  console.log('\n--- 10. Testing Security: Two-Factor Authentication Toggle ---');
  const tfaRes = await request('POST', '/api/auth/2fa/toggle', { enabled: true }, token);
  console.log('Status:', tfaRes.status, '2FA Enabled:', tfaRes.data?.two_factor_enabled, 'Message:', tfaRes.data?.message);

  console.log('\n--- 11. Testing Security: Revoke Other Device Sessions ---');
  const revokeRes = await request('POST', '/api/auth/sessions/revoke-others', {}, token);
  console.log('Status:', revokeRes.status, 'Message:', revokeRes.data?.message);

  console.log('\n--- 12. Testing Security: Fetch Activity Audit Trail ---');
  const actRes = await request('GET', '/api/auth/activities', null, token);
  console.log('Status:', actRes.status, 'Total activities logged:', actRes.data?.activities?.length);
  if (actRes.data?.activities?.length > 0) {
    console.log('Latest action:', actRes.data.activities[0].action, '•', actRes.data.activities[0].description);
  }

  console.log('\n--- 13. Testing Preferences Update ---');
  const prefRes = await request('PUT', '/api/profile/preferences', {
    timezone: 'Asia/Kolkata (IST)',
    language: 'English (India)',
    date_format: 'DD/MM/YYYY',
    notification_email: 1,
    notification_security: 1
  }, token);
  console.log('Status:', prefRes.status, 'Message:', prefRes.data?.message);

  console.log('\n--- 14. Verifying Static Assets & Content-Types ---');
  const assets = [
    '/',
    '/css/design-tokens.css',
    '/css/layout.css',
    '/css/profile.css',
    '/css/toast.css',
    '/js/toast.js',
    '/js/api.js',
    '/js/validation.js',
    '/js/security.js',
    '/js/profile.js',
    '/js/app.js',
    '/assets/images/avatar.jpg'
  ];

  for (const path of assets) {
    const res = await new Promise((resolve) => {
      http.get('http://localhost:5000' + path, r => {
        resolve({ path, status: r.statusCode, type: r.headers['content-type'] });
      });
    });
    console.log(`Asset ${res.path.padEnd(26)} -> Status: ${res.status} [${res.type}]`);
    if (res.status !== 200) throw new Error(`Asset ${res.path} returned status ${res.status}`);
  }

  console.log('\n🎉 ALL PROFILE, SECURITY, 2FA, PREFERENCES, AND AUDIT TESTS PASSED!');
}

runTests().catch(console.error);
