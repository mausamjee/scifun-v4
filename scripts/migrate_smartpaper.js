const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'D:\\Vicky Kumar\\project\\qustion paper pdf\\v4\\questionpapergenerator\\src';
const TARGET_DIR = 'd:\\Vicky Kumar\\tution\\website\\scifun-v4\\src';

function replaceLinks(content) {
  let newContent = content;
  // Dashboard mapping
  newContent = newContent.replace(/href="\/dashboard"/g, 'href="/smartpaper"');
  newContent = newContent.replace(/pathname === '\/dashboard'/g, 'pathname === \'/smartpaper\'');

  // Other routes
  const routes = ['create-paper', 'chemistry', 'physics', 'upload', 'upload-json', 'generator'];
  for (const route of routes) {
    newContent = newContent.replace(new RegExp(`href="/${route}"`, 'g'), `href="/smartpaper/${route}"`);
    newContent = newContent.replace(new RegExp(`pathname === '/${route}'`, 'g'), `pathname === '/smartpaper/${route}'`);
  }

  // Handle generic @/components and so on. They will point correctly if we place them in the same relative paths,
  // but wait, we are copying components/ to components/smartpaper or components/?
  // Let's copy components/ to components/, data/ to data/, lib/ to lib/ so that @/components works without changes.
  return newContent;
}

function processDirectory(src, dest, transform = null) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      processDirectory(srcPath, destPath, transform);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      if (transform && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
        content = transform(content);
      }
      fs.writeFileSync(destPath, content);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  }
}

// 1. Copy /app/* (except page.tsx and layout.tsx) to /app/smartpaper
const smartpaperAppDest = path.join(TARGET_DIR, 'app', 'smartpaper');
if (!fs.existsSync(smartpaperAppDest)) {
  fs.mkdirSync(smartpaperAppDest, { recursive: true });
}

const appSrc = path.join(SOURCE_DIR, 'app');
const appEntries = fs.readdirSync(appSrc, { withFileTypes: true });

for (const entry of appEntries) {
  if (entry.name === 'globals.css' || entry.name === 'layout.tsx' || entry.name === 'page.tsx' || entry.name === 'landing-page') {
    continue; // Skip root layout, globals.css, home page, and landing page
  }
  const srcPath = path.join(appSrc, entry.name);
  if (entry.isDirectory()) {
    if (entry.name === 'dashboard') {
      // For dashboard, we copy its contents to the root of /smartpaper
      const dashEntries = fs.readdirSync(srcPath, { withFileTypes: true });
      for (const dEntry of dashEntries) {
        const dSrc = path.join(srcPath, dEntry.name);
        const dDest = path.join(smartpaperAppDest, dEntry.name);
        if (dEntry.isDirectory()) {
          processDirectory(dSrc, dDest, replaceLinks);
        } else {
          let content = fs.readFileSync(dSrc, 'utf8');
          content = replaceLinks(content);
          fs.writeFileSync(dDest, content);
        }
      }
    } else {
      const destPath = path.join(smartpaperAppDest, entry.name);
      processDirectory(srcPath, destPath, replaceLinks);
    }
  }
}

// 2. Copy components, data, lib, services, types.ts
const dirsToCopy = ['components', 'data', 'lib', 'services'];
for (const d of dirsToCopy) {
  processDirectory(path.join(SOURCE_DIR, d), path.join(TARGET_DIR, d), replaceLinks);
}

// Copy types.ts
const typesSrc = path.join(SOURCE_DIR, 'types.ts');
if (fs.existsSync(typesSrc)) {
  let content = fs.readFileSync(typesSrc, 'utf8');
  fs.writeFileSync(path.join(TARGET_DIR, 'types.ts'), replaceLinks(content));
}

console.log('Migration complete');
