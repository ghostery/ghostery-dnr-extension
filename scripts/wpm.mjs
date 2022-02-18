import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

export default function wpm(source, options = {}) {
  // generate dist folder
  execSync(`rm -rf ${options.outDir} && mkdir -p ${options.outDir}`);

  // copy static assets
  options.staticDirs.forEach((path) => {
    execSync(`mkdir -p ${options.outDir}/${path}`);
    execSync(`cp -r ${source}/${path}/* ${options.outDir}/${path}`);
  });

  // manifest.json
  const manifest = JSON.parse(
    readFileSync(resolve(source, 'manifest.json'), 'utf8'),
  );
  const input = {};
  const add = (src) => {
    input[src] = resolve(source, src);
  };

  // default popup options
  if (manifest.action?.default_popup) {
    add(manifest.action.default_popup);
  }

  // options page
  if (manifest.options_page) {
    add(manifest.options_page);
  }

  // content scripts
  manifest.content_scripts.forEach(({ js = [], css = [] }) => {
    [...js, ...css].forEach(add);
  });

  // web-accessible resources
  manifest.web_accessible_resources.forEach((entry) => {
    entry.resources.forEach(add);
  });

  // Adopt manifest for Safari
  if (options.target === 'safari') {
    manifest.manifest_version = 2;

    manifest.browser_action = manifest.action;
    delete manifest.action;

    manifest.background = {
      'page': 'background/background.html',
      'persistent': false,
    };
    manifest.web_accessible_resources =
      manifest.web_accessible_resources.reduce((acc, entry) => {
        return acc.concat(entry.resources);
      }, []);
  }

  // background
  if (manifest.background) {
    add(manifest.background.service_worker || manifest.background.page);
  }

  // Write output manifest
  writeFileSync(
    resolve(options.outDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
  );

  return input;
}
