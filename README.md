# TicTacToe using LightningJS SDK

This repository is a fork of https://github.com/mlapps/lightning-getting-started-docs/tree/master, additionally containing my result following the guide. I used it to start learning [LightningJS 2.0](https://lightningjs.io/l2landing).
Maybe this will help others learning LightningJS using Typescript too, as the getting started docs are very old, contain some errors and lack important parts to get the app working as exepected.

My results are primarily based on:

* [the getting started docs](https://github.com/mlapps/lightning-getting-started-docs/tree/master)
* [the actual sources next to the starting docs](https://github.com/mlapps/lightning-getting-started-docs/tree/master/src)
* [the Typescript section of Lightnings' docs](https://lightningjs.io/docs/#/lightning-core-reference/TypeScript/index) 

## Using the result contained in this repository

### Getting started

> Before you follow the steps below, make sure you have the
[Lightning-CLI](https://rdkcentral.github.io/Lightning-CLI/#/) installed _globally_ only your system

```
npm install -g @lightningjs/cli
```

#### Running the App

1. Install the NPM dependencies by running `npm install`

2. Build the App using the _Lightning-CLI_ by running `lng build` inside the root of your project

3. Fire up a local webserver and open the App in a browser by running `lng serve` inside the root of your project

#### Developing the App

During development you can use the **watcher** functionality of the _Lightning-CLI_.

- use `lng watch` to automatically _rebuild_ your App whenever you make a change in the `src` or  `static` folder
- use `lng dev` to start the watcher and run a local webserver / open the App in a browser _at the same time_

#### Documentation

Use `lng docs` to open up the Lightning-SDK documentation.
