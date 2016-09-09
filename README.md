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
 2. ~~`grunt`~~* 
 3. `sass`

* No longer involves grunt since bootstrapping is a one time task. It makes more sense to take it out of the repetitive workflow and task management. This also separates it from the `grunt` vs `gulp` or any other workflow, now or in the future. 

## Resource Requirements
GitLab or BitBucket `git` server for repositories involved (because they support `git archive` command, GitHub workaround is for later; we wish to avoid `git clone` or downloading a `.zip` of the whole repo because it's too much unnecessary data).

## Concept

### Framework Components
 1. A ~~grunt~~ *node* plugin
 2. A starter theme/plugin repository.
 3. A component (reusable code modules) repository

### Envisioned Dev Workflow
When starting a new custom theme, a developer will

 1. install **wpBootStrap**'s node plugin
 1. create a new folder for the theme.
 1. create (or clone or copy and modify) a `package.json` in this folder (see example below) that describes the starter theme and the components needed for this theme.
 1. install **wpBootStrap**'s node plugin
 1. create (or clone or copy and modify) a `Gruntfile.js` and with a `bootstrap` task for the grunt plugin in 2.
 1. run `wpbootstrap` command
 1. start writing code.

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
	"repository": "git@git.yapapaya.in:yapapaya/my-project-name.git",
	"bugs": "https://git.yapapaya.in:yapapaya/my-project-name/issues/",
	"wpBootStrap": {
		"prettyName": "My Project Name",
		"starter": {
			"repository": "git@git.yapapaya.in:yapapaya/yapapaya_s.git",
			"replace": "_s"
		},
		"components": {
			"names": [ "flex-grid", "font-awesome", "testimonial", "section-with-aside" ],
			"repository": "git@git.yapapaya.in:yapapaya/theme-components.git",
			"replace": "component"
		}
	}
}
```

#### Theme slug, `text-domain`, prefixes

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
#### `wpBootStrap` Data

This part contains information that the `wpBootStrap` framework needs. 

```json
{
	"wpBootStrap": {
		"name": "My Project Name",
		"starter": {
			"repository": "git@git.yapapaya.in:yapapaya/yapapaya_s.git",
			"replace": "_s"
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
 1. **name**: (*optional*) can be used for `Theme Name:` header.
 2. **starter**: (*required*) contains information about the starter theme/framework
  * **repository**: (*required*) is the `git` url of the repository of the starter (only BitBucket and GitLab supported, as of now)
  * **replace**: (*optional*) is the namespace of the starter. This will be replaced with variations of the package name See the idea behind it, using [*_s* theme](https://github.com/Automattic/_s#getting-started).
 3. **components**: (*optional*) is an array of components that are needed for this theme.
 4. **componentArchive** (required if `components` field is present.
  * **repository** (*required*) the repository where the archive containing all the components is.
  * **replace** (*optional*) a common namespace used by all the components for function prefixes, etc, just like the `replace` field of `starter`.
