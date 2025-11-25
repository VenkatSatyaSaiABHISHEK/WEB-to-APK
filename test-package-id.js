// Test the package ID generation logic
const { v4: uuidv4 } = require('uuid');

function createValidPackageId(appName, appId) {
  // Remove hyphens from UUID and take first 8 characters
  const cleanId = appId.replace(/-/g, '').substring(0, 8);
  
  // Clean app name: remove special chars, spaces, convert to lowercase
  let cleanName = appName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
    .replace(/^[0-9]+/, '') // Remove leading numbers
    .substring(0, 15); // Limit length
  
  // Ensure we have a valid name (fallback to 'app' if empty)
  if (!cleanName || cleanName.length === 0) {
    cleanName = 'webtoapp';
  }
  
  // Ensure name doesn't start with reserved words
  const reservedWords = ['android', 'java', 'javax', 'dalvik', 'system', 'app', 'activity'];
  if (reservedWords.includes(cleanName)) {
    cleanName = 'custom' + cleanName;
  }
  
  // Create package ID (must not start with number, no reserved words)
  const packageId = `com.webtoapp.${cleanName}${cleanId}`;
  
  return {
    original: appName,
    cleaned: cleanName,
    id: cleanId,
    final: packageId
  };
}

// Test cases
const testCases = [
  'Google Search Pro',
  'My App 123',
  'Facebook Clone!',
  'Twitter@2024',
  '123StartWithNumber',
  'android',
  'system',
  '!@#$%^&*()',
  'a',
  ''
];

console.log('🧪 Testing Package ID Generation:\n');

testCases.forEach(testName => {
  const testId = uuidv4();
  const result = createValidPackageId(testName, testId);
  
  console.log(`Input: "${result.original}"`);
  console.log(`Output: ${result.final}`);
  console.log(`Details: "${result.original}" → "${result.cleaned}" + "${result.id}"`);
  console.log('---');
});

console.log('\n✅ All test cases processed. Package IDs should now be valid for Cordova!');