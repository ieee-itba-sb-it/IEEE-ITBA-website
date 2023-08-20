# ITBA IEEE Website A9

This project contains the source code used for IEEE ITBA's website, developed using Angular, Firebase and Bootstrap.

## Installation

### Node.js

Firstly, a Node.js version [compatible with the Angular version used](https://angular.io/guide/versions) must be installed. Its installation varies on the platform used, but instructions for all can be found on the [Node.js download page](https://nodejs.org/en/download).

A compatible npm version is installed along with node, so we´ll use it to install the rest of things needed.

### Angular & Firebase

Both can be installed via any package manager, such as npm or yarn. To install them using npm, just run:

```shell
$> npm i -g @angular/cli
$> npm i -g firebase-tools
```

These commands will download the latest versions available, and set them globally on the pc (due to the -g flag).

### Yarn

Due to the problems npm has when updating multiple dependencies, this project uses yarn as its package manager. Yarn can be installed using npm with:

```shell
$> npm i -g yarn
```

Then, yarn is used to install the rest of the project's dependencies, running <b>yarn install</b> on the project folder.

## Development server

To run the local server, the user must first select to run on either production mode or development mode.

The main difference is the database used, as running on dev mode starts up a mock database using [firebase emulators](https://firebase.google.com/docs/emulator-suite?hl=es-419), whereas prod mode just connects to the remote database used on the website.

It's recommended to run on development mode when developing the website (hence the name), but in case of needing to visualize a page with remote data or some other task that needs it, the second option is provided.

### Development mode

To run on development mode, both the page server and mock database must be started. Both commands can be executed by running:

```shell
$> yarn run dev
```

Which runs the dev command specified on the project's `package.json`.

Then the website can be accessed on `http://localhost:4200`, and the mock database on `http://localhost:4000`

#### Local database

On the development mode, a local database is set up, and its data is saved on a folder named `mock_data`, located at root level (outside `src`).

### Production mode

To run on production mode, only the website must be run, which can be served and set up on production mode using:

```shell
$> ng serve -c production
```

Then the website can be accessed on `http://localhost:4200`.

## Build & Deploy

To build the project simply run:

```shell
$> ng build
```

Then, a `dist` folder will be created containing the built page, which can be deployed using:

```shell
$> firebase deploy
```

## Color variables

As IEEE requires a certain [color palette](https://brand-experience.ieee.org/guidelines/digital/style-guide/branding-visual-elements/) to be used, the available colors are predefined using bootstrap variables.

These variables are named as `--bs-ieee-palette-color-percentage`, where

- `palette` can be either `bright` or `dark`
- `color` can be one of:
  - blue
  - orange
  - yellow
  - green
  - darker-green
  - red
  - purple
  - cyan
  - darker-cyan (only on bright palette)
  - gray (only on dark palette)
- `percentage` can be:
  - 20
  - 40
  - 60
  - 80
  - 100 (in this case, it's not specified on the color name, e.g. `--bs-ieee-bright-blue` refers to the blue in the bright palette with 100 percent)

White (#FFF) and Black (#000) colors are also accepted, but they don't have a variable that contains them.
