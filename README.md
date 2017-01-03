# wp-get-go

`wp-get-go` (*get-go* = get going) is a framework for bootstrapping WordPress theme development.

## Command
`wpgg [--no-validate --no-autofix --no-push --no-css [--silly | --verbose | --debug]]`

**Arguments**
 1. `--no-validate` Don't validate the git repositories (if you know they are fine, this can speed up build.
 1. `--no-autofix` `wpgg` can fix and update a lot of errors in the package and build information. Using this argument will prevent that and throw errors instead.
 1. `--no-push` Once the build is completed, the code will be commited and pushed to remote. To do that manually, use this argument.
 1. `--no-css` Once the build is completed, a `style.css` will be generated from the built `style.scss`. Use this argument to prevent that. 
 1. `--silly` | `--verbose` | `--debug` The detail of logs. `--silly` is meant for developers of the framework and is silly for you to use. `--verbose` will give you very detailed log. `--debug` is useful if you wish to see a little more detail than what's logged normally and can help in identifying issues and reporting errors.


### Example `package.json`
```json
{
	"name": "my-theme",
	"version": "0.0.1",
	"author": {
		"name": "Yapapaya",
		"url": "https://yapapaya.com"
	},
	"homepage": "https://yapapaya.com/my-project-name/",
	"description": "A custom description for My Project Name",
	"repository": "git@git.yapapaya.in:yapapaya/my-project-name.git",
	"bugs": "https://git.yapapaya.in:yapapaya/my-project-name/issues/",
	"wpgg": {
		"prettyName": "Baap Theme",
		"functionPrefix" : "my_theme",
		"starter": {
			"repository": "git@git.yapapaya.in:yapapaya/yapapaya_s.git",
			"replace": "_s",
			"gitHeader": "Repo",
			"gitHeaderType": "git",
			"colophon" : {
				"author" : "Automattic",
				"url" : "automattic.com"
			}
		},
		"components": {
			"names": [ "flex-grid", "font-awesome", "testimonial", "section-with-aside" ],
			"repository": "git@git.yapapaya.in:yapapaya/theme-components.git",
			"replace": "component"
		}
	}
}
```

#### Theme slug, `text-domain`

These can be generated using the package `name`

```json
"name": "my-project-name"
```

#### Theme Headers
This part of the `package.json` can be used to generate the theme headers.

```json
{
	"name": "my-project-name",
	"version": "0.0.1",
	"author": {
		"name": "Yapapaya",
		"url": "https://yapapaya.com/"
	},
	"homepage": "https://yapapaya.com/my-project-name/",
	"description": "A custom description for My Project Name",
	"repository": "git@git.yapapaya.in:yapapaya/my-project-name.git"
}
```

The `json` above will create the theme headers in `style.css` as follows:

```php
<?php
/*
Theme Name: My Project Name
Theme URI: https://yapapaya.com/my-project-name/
Author: Yapapaya
Author URI: https://yapapaya.com/
Description: A custom description for My Project Name
Version: 0.0.1
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: my-project-name
*/
```
#### `wpgg` Data

This part contains information that the `wpgg` framework needs. 

```json
{
	"wpgg": {
		"prettyName": "Baap Theme",
		"functionPrefix" : "my_theme",
		"starter": {
			"repository": "git@git.yapapaya.in:yapapaya/yapapaya_s.git",
			"replace": "_s",
			"gitHeader": "Repo",
			"gitHeaderType": "git",
			"colophon" : {
				"author" : "Automattic",
				"url" : "automattic.com"
			}
		},
		"components": {
			"names": [ "flex-grid", "font-awesome", "testimonial", "section-with-aside" ],
			"repository": "git@git.yapapaya.in:yapapaya/theme-components.git",
			"replace": "component"
		}
	}
}
```

This is an example of an internal version we are working on.
 1. **prettyName**: (*optional*) `Theme Name:` header. If not supplied, will be generated from package `name` by replacing hyphens(`-`) with spaces and capitalising each word. (`my-theme` will make `My Theme`)
 1. **functionPrefix**: (*optional*) Prefix for function names. If not supplied, will be generated from package `name` by replacing hyphens(`-`) with underscores (`_`). (`my-theme` will make `my_theme`)
 1. **starter**: (*required*) Information about the starter theme. We use a custom flavour of [`_s` theme by Automattic](https://github.com/Automattic/_s).
  * **repository**: (*required*) is the `git` url of the repository of the starter
  * **replace**: (*optional*) The namespace of the starter. This will be replaced in function names, text-domain, documentation, etc . See the idea behind it, using [*_s* theme](https://github.com/Automattic/_s#getting-started). If not supplied, no replacements will be made.
  * **gitHeader**: (*optional*) An optional git header. For example, if you use something like [GitHub Updater](https://github.com/afragen/github-updater) you'd set this to `GitHub Theme URI`.
  * **gitHeaderType**: (*optional*) Whether to use `git` style URL or `https` urls for the git header. For example, if you use something like [GitHub Updater](https://github.com/afragen/github-updater) you'd set this to `https`.
  * **colophon**: (*optional*) (*=a publisher's emblem or imprint, especially one on the title page or spine of a book.*) This is the footer credit information ( Baap Theme by Yapapaya) or the copyright information ( &copy; 2017 by Yapapaya.). This will be used for replacing the name and url in footer.php. If not supplied, the colophon will be left, as it is.
    * **author**: The copyright holder or Theme author.
    * **url**: The copyright holder's or Theme author's url.
 3. **components**: (*optional*) contains information about the components
  * **names** (*optional*) is an array of components that are needed for this theme.
  * **repository** (*required*) the repository where the archive containing all the components is.
  * **replace** (*optional*) a common namespace used by all the components for function prefixes, etc, just like the `replace` field of `starter`.

## Resource Requirements
A remote `git` server (GitLab, BitBucket, GitHub, etc) for repositories involved (because they support `git archive` command, GitHub workaround is for later; we wish to avoid `git clone` or downloading a `.zip` of the whole repo because it's too much unnecessary data).

## Concept
While developing a new custom theme, a developer usually
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

### Framework Parts
 1. A *node* plugin
 2. A starter theme/plugin repository.
 3. A component (reusable code modules) repository

### Envisioned Dev Workflow
When starting a new custom theme, a developer will

 1. install **wpgg**'s node plugin
 1. create a new folder for the theme.
 1. create (or clone or copy and modify) a `package.json` in this folder (see example below) that describes the starter theme and the components needed for this theme.
 1. install **wpgg**'s node plugin.
 1. run `wpgg` command.
 1. start writing code.
