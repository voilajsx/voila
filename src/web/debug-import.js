// Debug import test
async function testImport() {
  try {
    console.log('Testing import path: ./main/features/home/pages/root.tsx');
    const module = await import('./main/features/home/pages/root.tsx');
    console.log('Import successful:', module);
    console.log('Default export:', module.default);
  } catch (error) {
    console.error('Import failed:', error);
  }
}

testImport();