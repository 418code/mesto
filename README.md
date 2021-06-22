# Project Mesto (The Place) - Yandex Practicum web development program

[Demo @ github pages](https://bliss-code.github.io/mesto/)

[По-русски](./README-RU.md)

## Description

An interactive responsive web app for sharing photos of places with the main focus on Javascript.\
Sprints: 4 -

## Technologies used

JavaScript
- editable profile information with an interactive popup
- event listeners on edit, close and save buttons
- place card creation by cloning its template
- add initial place cards from an array
- place card addition with a popup
- enlarge photo from place card in a popup
- place card like and delete functionality
- custom form validation
- close popup with a click on overlay and with the Esc key
- refactor card logic with Card class: commit 556cbbb
- refactor form validation logic with FormValidator class: commit a9a836c
- refactor card view logic with Section class: commit d815505
- refactor photo popup with PopupWithImage class: commit e23748f
- refactor profile add popup with PopupWithForm class: commit e155e34
- refactor profile edit popup with PopupWithForm and UserInfo classes: commit 9bb16e3

CSS
- responsive layout with flexbox/grid and media queries
- buttons changing opacity with transition mix-in
- smooth popup fade in and out
- card photo flip on hover
- custom fonts imported
- normalize.css

HTML
- semantic tags
- emmet abbreviations

Webpack
- use npm to install packages
- build and dev scripts
- development server
- transpile JS with Babel for older browsers and auto insert script tag
- import images and fonts
- use HtmlWebpackPlugin to process HTML and load images with lodash
- use CleanWebpackPlugin to empty the dist folder on build
- process CSS with MiniCssExtractPlugin, css-loader, postcss-loader, autoprefixer, and cssnano

Figma
- [Sprint 4 Figma design](https://www.figma.com/file/2cn9N9jSkmxD84oJik7xL7/JavaScript.-Sprint-4?node-id=0%3A1)
- [Sprint 5 Figma design](https://www.figma.com/file/bjyvbKKJN2naO0ucURl2Z0/JavaScript.-Sprint-5?node-id=0%3A1)
- implement 320px and 1280px designs

BEM
- CSS classes organized according to Block Element Modifier system
- files organized with BEM nested file structure
- CSS files imported from BEM folders with @import
- [DIY bash script for dealing with nested BEM file structure](https://github.com/bliss-code/instruments)

Git
- gitflow workflow
- commands: commit, log, status, diff, branch, merge, push, pull
- commits organization: feat, fix, refactor
- GitHub pages
- SSH
