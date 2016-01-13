# Gigaleet Development Kit
Gigaleet Development Kit is an opinionated boilerplate for web development; based off of Google's Web Stater Kit.

##Install
- Make sure you have npm installed; download from https://nodejs.org/en/
- Make sure you have gulp installed; run `$ npm install --global gulp`
- Clone Repo; run `$ git clone https://github.com/Gigaleet/gigaleet-dev-kit.git`
- Install Package; run `$ npm install` in the gigaleet-dev-kit directory

##Usage

### Watch For Changes & Automatically Refresh Across Devices

```sh
$ gulp serve
```

This outputs an IP address you can use to locally test and another that can be used on devices
connected to your network.
`serve` does not use [service worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
caching, so your site will stop being available when the web server stops running.

### Build & Optimize

```sh
$ gulp
```

Build and optimize the current project, ready for deployment.
This includes linting as well as image, script, stylesheet and HTML optimization and minification.
Also, a [service worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
script will be automatically generated, which will take care of precaching your sites' resources.
On browsers that [support](https://jakearchibald.github.io/isserviceworkerready/) service
workers, the site will be loaded directly from the service worker cache, bypassing the server.
This means that this version of the site will work when the server isn't running or when there is
no network connectivity.

### Serve the Fully Built & Optimized Site

```sh
$ gulp serve:dist
```

This outputs an IP address you can use to locally test and another that can be used on devices
connected to your network.
`serve:dist` includes will serve a local copy of the built and optimized site generated as part
of the `default` task.
Because the optimized site includes a service worker which serves your site directly from the
cache, you will need to reload the page after regenerating the site to pick up the latest changes.
`serve:dist` uses a different HTTP port than `serve`, which means that the service workers are
kept isolated in different [scopes](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Registering_your_worker).
