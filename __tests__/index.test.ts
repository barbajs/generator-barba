import assert from 'yeoman-assert';
import { yo } from '../__mocks__/yo';

const pkg = 'package.json';
const pug = 'src/layout.pug';
const js = 'src/scripts/app.js';
const ico = 'src/favicon.ico';
const tsConfig = 'tsconfig.json';
const gsap = 'src/scripts/transitions/gsap.js';
const animejs = 'src/scripts/transitions/animejs.js';

describe('file system', () => {
  it('check folder', async () => {
    try {
      await yo({}, true);
    } catch (e) {
      expect(e.message).toMatch(/error/);
    }
  });

  it('copy templates', async () => {
    await yo();

    assert.file(pkg);
    assert.fileContent(pkg, /starter-debug/);
    assert.file(pug);
    assert.file(js);
    assert.file(ico);
    assert.file(gsap);
    assert.file(animejs);
  });
});

describe('release', () => {
  it('use latest', async () => {
    await yo();

    assert.fileContent(pkg, /latest/);
  });

  it('use next', async () => {
    await yo({ release: 'next' });

    assert.fileContent(pkg, /next/);
  });

  it('use linked', async () => {
    await yo({ release: 'linked' });

    assert.noFileContent(pkg, /barba/);
  });

  it('use fixed', async () => {
    await yo({ release: 'fixed', version: '2.0.0' });

    assert.fileContent(pkg, /2\.0\.0/);
  });
});

describe('origin', () => {
  it('use npm', async () => {
    await yo();

    assert.fileContent(js, /import barba/);
    assert.noFileContent(js, /const { barba }/);
    assert.noFileContent(pug, /@barba\/core/);
  });

  it('use cdn', async () => {
    await yo({ origin: 'cdn' });

    assert.noFileContent(js, /import barba/);
    assert.fileContent(js, /const { barba }/);
    assert.fileContent(pug, /@barba\/core/);
    assert.fileContent(pug, /latest/);
  });
});

describe('language', () => {
  it('use Javascript', async () => {
    await yo();

    assert.file(js);
    assert.noFile(tsConfig);
    assert.file(gsap);
    assert.file(animejs);
    assert.noFileContent(gsap, /ITransitionData/);
    assert.noFileContent(animejs, /ITransitionData/);
  });

  it('use TypeScript', async () => {
    await yo({ language: 'ts' });

    const tsify = (n: string) => n.replace('.js', '.ts');

    assert.file(tsify(js));
    assert.file(tsConfig);
    assert.file(tsify(gsap));
    assert.file(tsify(animejs));
    assert.fileContent(tsify(gsap), /ITransitionData/);
    assert.fileContent(tsify(animejs), /ITransitionData/);
  });
});
