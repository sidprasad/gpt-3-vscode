# Dev Guide

## What's in the folder

* This folder contains all of the files necessary for your extension.
* `package.json` - this is the manifest file in which you declare your extension and command.
  * The sample plugin registers a command and defines its title and command name. With this information VS Code can show the command in the command palette. It doesn’t yet need to load the plugin.
* `src/extension.ts` - this is the main file where you will provide the implementation of your command.
  * The file exports one function, `activate`, which is called the very first time your extension is activated (in this case by executing the command). Inside the `activate` function we call `registerCommand`.
  * We pass the function containing the implementation of the command as the second parameter to `registerCommand`.

## Get up and running straight away

* Press `F5` to open a new window with your extension loaded.


## Compile to VSIX


Make sure you have the following Node.js package installed.
```
npm install -g @vscode/vsce
```

Now run:
```
vsce package
```


The associated VSIX file represents the extension. DO NOT publish this extension to the VSCode marketplace.

You can isntall the extension following rules here: https://code.visualstudio.com/docs/editor/extension-marketplace#_install-from-a-vsix

