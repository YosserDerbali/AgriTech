const { makeRedirectUri } = require('expo-auth-session');

function print() {
  try {
    console.log('makeRedirectUri() =>', makeRedirectUri());
    console.log('makeRedirectUri({ useProxy: true }) =>', makeRedirectUri({ useProxy: true }));
    console.log('makeRedirectUri({ useProxy: true, projectNameForProxy: "mobile" }) =>', makeRedirectUri({ useProxy: true, projectNameForProxy: 'mobile' }));
    console.log('makeRedirectUri({ scheme: "com.anonymous.mobile" }) =>', makeRedirectUri({ scheme: 'com.anonymous.mobile' }));
    console.log('makeRedirectUri({ native: true }) =>', makeRedirectUri({ native: true }));
  } catch (e) {
    console.error('Error computing redirect URIs:', e && e.message ? e.message : e);
    process.exit(1);
  }
}

print();
