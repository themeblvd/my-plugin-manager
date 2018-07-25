# {{my}}_Plugin_Manager

[My Plugin Manager](http://mypluginmanager.com) is a drop-in script for your WordPress theme or plugin, which gives your users an interface to manage plugins you suggest be used with your product.

![My Plugin Manager Preview](http://mypluginmanager.com/assets/img/screenshots/intro.gif "My Plugin Manager Preview")

## Download and Usage

Please do not copy the files from this repository directly into your WordPress project. Make sure to use one of the methods below to generate the script for your specific project.

Our goal is to provide you with a drop-in script that complies as closely to WordPress coding standards and best practices, as possible. So by generating a custom build for your project, the following will happen:

* Prefix all PHP class names to match your theme or plugin name.
* Name all class files to correctly correspond to the name of those PHP classes.
* Insert your unique namespacing key for anything submitted to the database.
* Insert the localization text domain that matches your theme or plugin.
* If the "plugin" usage type is selected, `add_theme_page()` will be substituted for `add_submenu_page()` (not allowed in themes).
* Give you an example code snippet to get started, which is customized to your project.

### Method 1: Use the Online Generator

The easiest way to incorporate your new plugin manager into your WordPress theme or plugin is to generate a custom instance for your project at:

http://mypluginmanager.com#download

After you've submitted the form, your plugin manager download will start and you'll be shown instructions specific to your project to get started.

*Note: Curious how mypluginmanager.com is built? It's an open source PHP web app. [Check it out here.](https://github.com/themeblvd/my-plugin-manager-site)*

### Method 2: Clone the Repo

For using this repository to generate a custom build, you'll need to have [NodeJS](https://nodejs.org) and [NPM](https://www.npmjs.com/get-npm) installed on your computer.

1. Clone this repository to your local computer.
2. Edit the variables in `build-config.js` to match your project.
4. Within the clone repo, run `npm install` to install all of dependencies from your terminal.
5. Then run `npm run build` to build out a custom build for your project, using data from the `build-config.js` you edited.
6. Within the `/dist` directory, find the `plugin-manager` directory that was generated, and then copy it to the root of your WordPress theme or plugin.
7. Also within the `/dist` directory you'll see an `example.php` file. You can copy the contents of this file into your theme or plugin's PHP code to implement the script.

## More Information

* [About](http://mypluginmanager.com/about)
* [Frequently Asked Questions](http://mypluginmanager.com/faq)
* [Documentation](http://mypluginmanager.com/docs)

## Copyright and License

Code and documentation copyright 2011-2017 [Jason Bobich](http://jasonbobich.com) and [Theme Blvd](http://themeblvd.com). Code released under the [GPLv2 or later](http://www.gnu.org/licenses/gpl-2.0.html) license.
