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
    }

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
    const { dest, lib, origin, release, version: v } = this.props;
    const version = release === 'fixed' ? v : release;
    const data = { lib, origin, version };

    // Copy static files
    this.fs.copy(
      this.templatePath('src/**/*'),
      this.destinationPath(`${dest}/src/`)
    );

    // Packages
    const pkg = this.fs.readJSON(this.templatePath('package.json'));

    pkg.name = this.props.name;

    if (origin === 'npm' && release !== 'linked') {
      pkg.dependencies['@barba/core'] = version;
    }

    this.fs.writeJSON(this.destinationPath(`${dest}/package.json`), pkg);

    // Templates
    this.fs.copyTpl(
      this.templatePath('layout.pug'),
      this.destinationPath(`${dest}/src/layout.pug`),
      data
    );
    this.fs.copyTpl(
      this.templatePath('app.js'),
      this.destinationPath(`${dest}/src/scripts/app.js`),
      data
    );
  }

  public install() {
    const { dest } = this.props;

    process.chdir(path.join(process.cwd(), dest));
    this.log(
      `> ${chalk.cyan('📦 Installing dependencies with `yarn install`')}`
    );
    this.yarnInstall();
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
