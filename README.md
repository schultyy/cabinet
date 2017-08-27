# Cabinet

Cabinet is an offline capable in-browser GitHub Issues client. It is able to store issues in the browser's WebSQL or IndexedDB database to allow users to browse issues even when they're not online.

It also ships with basic write functionalities, such as manipulating an issue's state.

## Usage

This app runs completely in your browser. You visit [https://schultyy.github.io/cabinet/](https://schultyy.github.io/cabinet/). The first time you'll see a dialogue which asks you to configure your [GitHub personal access token](https://github.com/settings/tokens/new). You'll need to permit full __repo__ access.

It then loads the first 100 repositories which are available under your user's account. For each repository you're able to download its issues by selecting it in the sidebar.


## Development

* Node 6.10 or greater
* A Serviceworker-enabled browser
* npm 5 or greater
