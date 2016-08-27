# wpBootStrap
A framework for bootstrapping WordPress theme/plugin development.

**Note**: Right now focusing only on getting theme bootstrapping to work, plugins are the next step.

## Concept
While developing a custom theme, a developer usually
 1. Downloads a starter theme.
 2. Performs a find/replace for `theme-slug` and manually edits the theme header information in `style.scss` or `style.css`.
 2. Creates or copies additional files: `.js`, `.scss`, `.php` *template files*, (for eg. `event-single.php`) to achieve the desired look and feel
 3. Creates additional code in `functions.php` required to achieve the desired functionality (for eg, enqueueing scripts and styles)

A lot of these additional work can be repetitive and often follow patterns. It often takes hours to finally get all the basic repetitive stuff in place before the developer can start working on code that they are writing for the first time. Such additional code can be separated and arranged as *reusable modules* or **components**.

### Component Examples
 * *High level* `slideshow`, `testimonial`, `staff-profile`, `related-posts`, `gallery`, `portfolio`, `call-to-action`, etc
 * *Low level* `section-with-aside`, `hero`, `hero-with-cta`, `section-with-image`, `section-with-round-image`, `section-with-square-image`, `hero-with-quote`, etc
 * *Libraries/ Frameworks* `font-awesome`, `masonry`, `infinite-scroll`, a post meta framework like [ButterBean](http://themehybrid.com/weblog/butterbean-post-meta-framework-beta), etc

This framework is an attempt to automate and modularise development of custom themes (and plugins) so that the developer can quickly start writing the *actual* custom part of the code instead of spending hours just getting things in place.

## Skill Requirements
 1. `git`
 2. `grunt`
 3. `sass`

## Resource Requirements
GitLab or BitBucket `git` server for repositories involved (because they support `git archive` command, GitHub workaround is for later; we wish to avoid `git clone` or downloading a `.zip` of the whole repo because it's too much unnecessary data).

## Concept

### Framework Components
 1. A grunt plugin
 2. A starter theme/plugin repository.
 3. A component (reusable code modules) repository

### Envisioned Dev Workflow
When starting a new custom theme, a developer will

 1. create a new folder for the theme.
 2. create (or clone or copy and modify) a `package.json` in this folder (see example below) that describes the starter theme and the components needed for this theme.
 2. install **wpBootStrap**'s grunt plugin
 3. create (or clone or copy and modify) a `Gruntfile.js` and with a `bootstrap` task for the grunt plugin in 2.
 4. run `grunt bootstrap`
 5. start writing code.

### Example `package.json`
```json
{
  "name": "my-project-name",
  "version": "0.0.1",
  "author": {
    "name": "Yapapaya",
    "url": "https://yapapaya.com"
  },
  "homepage": "https://yapapaya.com/my-project-name/",
  "description": "A custom description for My Project Name",
  "repository": "git@git.yapapaya.in:yapapaya/my-project-name",
  "bugs": "git@git.yapapaya.in:yapapaya/my-project-name/issues/",
  "devDependencies": {
    "grunt": "^0.4.5",
    "grunt-cli": "~0.1.9",
    "load-grunt-tasks": "~0.4.0",
    "grunt-contrib-watch": "~0.6.1",
    "grunt-contrib-sass": "~0.7.3",
    "grunt-autoprefixer": "~0.7.2",
    "grunt-csscomb": "~2.0.1",
    "grunt-contrib-concat": "~0.3.0",
    "grunt-contrib-uglify": "~0.4.0",
    "grunt-wp-i18n": "~0.4.3",
    "wp-bootstrap": "git+ssh://git@git.yapapaya.in:yapapaya/wp-bootstrap.git"
  },
  "wpBootStrap": {
    "name": "My Project Name",
    "starter": {
      "repository": "git@git.yapapaya.in:yapapaya/yapapaya_s.git",
      "keyword": "_s"
    },
    "components": [
      "flex-grid", "font-awesome", "testimonial", "section-with-aside"
    ],
    "componentArchive": {
      "repository": "git@git.yapapaya.in:yapapaya/theme-components.git",
      "keyword": "component"
    }
  }
}

```
