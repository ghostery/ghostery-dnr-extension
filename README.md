# Ghostery DNR Extension

Ghostery helps you browse smarter by giving you control over ads and tracking technologies to speed up page loads, eliminate clutter, and protect your data.

This repository contains a version built with the new `chrome.declarativeNetRequest` API allowing it to be used in Safari. For non-Safari browsers like Chrome, Firefox, Opera and Edge, we recommended to use instead the "classic" [Ghostery browser extension](https://github.com/ghostery/ghostery-extension/), which is built on the older, but more capable webRequest API.

## Local development

First, you need to install JavaScript dependencies and download additional resources (e.g. block lists):

```sh
$ npm ci
```

Now everything is ready. Change the code, and run it in Chrome:

```sh
$ npm run start
```

To test it in Safari, you will have to use Xcode. The project files are available in the `xcode` folder, but Apple's ecosystem is more complex. Fortunately, most changes can be tested reliably in Chrome.

If you want to contribute, try to get it working in Chrome. Most of the time, your code will work in Safari, too.
