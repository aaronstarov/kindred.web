The Kindred Web code base is ultimately concatenated into two files--kindred-client.min.js and kindred-server.min.js. The concatenation is done by a simple process, such that the end result is simple the files as they appear in the order they are displayed in simple file-system browswers, following the following rules:

- files in subdirectories are before files in the current directory
- subdirectories and files are arranged alphabetically

There is only one exception to accomodate the separation of client- and server-side code: files in the **client/** folder are only included in the client file, and files in the **server/** folder are included in the server file. 

Across the directory, you'll notice a number of files named something like "_.ext". These should be interpretted as taking the name of the higher-level directory, and are named that way to take advantage of alphabetical ordering. The file then at **kindred-web/source/_/_.md** can be understood as markdown concerning the source of kindred-web. 

Everything in the **kindred-web/source/_/** directory is included at the top of both the client and server files.

The compilation is done by the **source/dev.js** program, which must be run from within **source/**:

```bash
$ cd source
$ node dev.js
```

This will watch for changes, and automatically rebuild whenever you make a change to the source. The build process creates both development and production versions, where the dev version remains unminified for straight-forward debugging.

In addition to concatentation of the source code, **dev.js** also compiles tests and documentation. Anything ending in **.test.js** is wrapped in a testing function, and **.md** files are compiled into documentation. Note that there is no need to manually write headers--they will be created automatically based on the folder structure. Unlike with the source code, files that are deeper in the folder hierarchy will come after higher-level files. 

The build process creates both development and production versions, where the dev version remains unminified for straight-forward debugging. You can see these in the **build/** directory.

