# Wing Creator

> The Wing Programming Language is a work in progress and is not publicly available as of now.

Wing Creator in an extension to [Microsoft's Visual Studio Code](https://code.visualstudio.com) that provide smart features to help you work with Wing.

To get started with Wing Creator, simply install the extension. To get code completion and insights working, you will need to [install Wing](https://winglang.equestria.horse) as `wing` in one of the valid `PATH` folders. Syntax highlighting, however, works without having installed Wing.

Once the extension is installed, support for `.wing` and `.wjs` files is now working. You can edit Wing code like you would edit any other programming language.

> Wing Creator executes arbitrary code on your computer and can be used for malicious purposes. **Never open untrusted code** with Wing Creator.

## Problems

Wing Creator will automatically run Wing whenever you change your code to analyse it and make sure it does not contain any error. When an error is detected, the line the error is from is underlined, and you can get details about it when you hover over it.

You can also see the version of Wing you are running (on the screenshot `wing-next-20221204-000f91a3bb`) and the internal name of the error message (`ERR_FUNCTION_NOENT`).

### Warnings

Wing Creator underlines warnings in yellow. These typically won't cause Wing to exit and will only display a warning message.

### Errors

Errors in Wing Creator are underlined in red. These will cause Wing to exit after displaying an error message when executed. If strict mode is enabled, all warnings below the `#strict` line are shown as errors.

### Deprecations

Deprecations are underlined in blue, and to ensure you don't attempt to use a deprecated feature, are also crossed out.

## Updates

The Wing developers often release updates of Wing Creator when they are necessary. Updates could improve compatibility with a new version of Wing or fix existing bugs.

It is important that you update Wing Creator as soon as possible every time a new update is released. Updating Wing Creator is the same as updating any Visual Studio Code extension.