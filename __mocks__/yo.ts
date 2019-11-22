import fs from 'fs';
import path from 'path';
import helpers from 'yeoman-test';

const defaults = {
  lib: 'gsap',
  name: 'starter-debug',
  origin: 'npm',
  release: 'latest',
};

export function yo(p = {}, folder = false) {
  const prompts = {
    ...defaults,
    ...p,
  };

  return helpers
    .run(path.join(__dirname, '../src/app'), {})
    .inTmpDir(dir => {
      folder && fs.mkdirSync(`${dir}/starter-debug`);
    })
    .withPrompts(prompts);
}
