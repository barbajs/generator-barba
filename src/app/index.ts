import chalk from 'chalk';
import kebabcase from 'dashify';
import fs from 'fs';
import path from 'path';
import Generator from 'yeoman-generator';

interface IProps {
  dest: string;
  name?: string;
  release?: 'latest' | 'next' | 'linked' | 'fixed';
  version?: string;
  origin?: string;
  language?: 'js' | 'ts';
  lib?: 'gsap' | 'animejs';
}

export default class BarbaGenerator extends Generator {
  public props: IProps = { dest: '.' };
  public initializing() {
    console.time('yo');
  }

  public async prompting() {
    await this.prompt([
      // Project name and destination folder.
      {
        message: 'Give me a name: ',
        name: 'name',
      },
      // Release (latest, next, linked for local dev and fixed).
      {
        choices: [
          {
            name: 'latest',
            value: 'latest',
          },
          {
            name: 'next',
            value: 'next',
          },
          {
            name: 'linked (local)',
            value: 'linked',
          },
          {
            name: 'fixed',
            value: 'fixed',
          },
        ],
        default: 0,
        message: 'Choose a release: ',
        name: 'release',
        type: 'list',
      },
    ]).then(answers => {
      this.props.name = answers.name;
      this.props.dest = kebabcase(answers.name);
      this.props.release = answers.release;
    });

    // Fixed semantic version.
    if (this.props.release === 'fixed') {
      await this.prompt([
        {
          message: 'Tell me your version (x.x.x): ',
          name: 'version',
          validate: /* istanbul ignore next */ input =>
            /\d+\.\d+\.\d+/.test(input),
        },
      ]).then(answers => (this.props.version = answers.version));
    } else {
      this.props.version =
        this.props.release === 'linked' ? 'latest' : this.props.release;
    }

    // Origin: NPM or CDN.
    if (this.props.release !== 'linked') {
      await this.prompt([
        {
          choices: ['npm', 'cdn'],
          default: 0,
          message: 'Get it from? : ',
          name: 'origin',
          type: 'list',
        },
      ]).then(answers => (this.props.origin = answers.origin));
    } else {
      this.props.origin = 'npm';
    }

    // JS or TS.
    await this.prompt([
      {
        choices: [
          {
            name: 'JavaScript',
            value: 'js',
          },
          {
            name: 'TypeScript',
            value: 'ts',
          },
        ],
        default: 0,
        message: 'Preferred language? : ',
        name: 'language',
        type: 'list',
      },
    ]).then(answers => (this.props.language = answers.language));

    // Animation library
    await this.prompt([
      {
        choices: ['gsap', 'animejs'],
        default: 'gsap',
        message: 'Any preferred lib? ',
        name: 'lib',
        type: 'list',
      },
    ]).then(answers => (this.props.lib = answers.lib));
  }

  public configuring() {
    // Create project directory
    const { dest } = this.props;

    if (fs.existsSync(dest)) {
      this.env.error(
        (`
> ${chalk.red(`Ooops! Non-empty directory! [${process.cwd()}/${dest}]`)}
> ${chalk.red('I don’t want to erase your stuff… 😅')}
> ${chalk.red('Retry with another name/location')}
      ` as unknown) as Error
      );
    } else {
      fs.mkdirSync(dest);
    }
  }

  public writing() {
    const { dest, language: ext, lib, origin, release, version } = this.props;
    const data = { ext, lib, origin, version };

    // Copy static files
    this.fs.copy(
      this.templatePath('src/**/*'),
      this.destinationPath(`${dest}/src/`)
    );

    // Packages
    const pkg = this.fs.readJSON(this.templatePath('package.json'));

    pkg.name = dest;

    if (origin === 'npm' && release !== 'linked') {
      pkg.dependencies['@barba/core'] = version;
    }
    if (ext === 'ts') {
      pkg.devDependencies['@types/animejs'] = '3.1.0';
    }

    this.fs.writeJSON(this.destinationPath(`${dest}/package.json`), pkg);

    // Files
    if (ext === 'ts') {
      this.fs.copy(
        this.templatePath('tsconfig.json'),
        this.destinationPath(`${dest}/tsconfig.json`)
      );
    }

    // Templates
    this.fs.copyTpl(
      this.templatePath('src.layout.pug'),
      this.destinationPath(`${dest}/src/layout.pug`),
      data
    );

    this.fs.copyTpl(
      this.templatePath('src.scripts.app.js'),
      this.destinationPath(`${dest}/src/scripts/app.${ext}`),
      data
    );

    const transitions = ['gsap', 'animejs'];

    transitions.forEach(t => {
      this.fs.copyTpl(
        this.templatePath(`src.scripts.transitions.${t}.js`),
        this.destinationPath(`${dest}/src/scripts/transitions/${t}.${ext}`),
        data
      );
    });
  }

  public install() {
    const { dest } = this.props;

    process.chdir(path.join(process.cwd(), dest));
    this.log(
      `> ${chalk.cyan('📦 Installing dependencies with `yarn install`')}`
    );
    this.yarnInstall();

    // TODO for 'linked', add @barba/core to package.json and run `npm link @barba/core`
  }

  public end() {
    this.log(
      `> ${chalk.cyan(
        '🚀 Almost done! Copy-paste next line and happy barba.js!'
      )}`
    );
    this.log(chalk.green(`cd ${this.props.dest} && yarn start`));
    console.timeEnd('yo');
  }
}
