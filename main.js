// Main
//
// Builds Kindred, watches for changes, and launches server.

var cliArgs = require("command-line-args");
 
/* define the command-line options */
var cli = cliArgs([
    { name: "build", type: Boolean, alias: "b", description: "Build Kindred files." },
    { name: "tests", type: Boolean, alias: "t", description: "Build and run tests." },
    { name: "serve", type: Boolean, alias: "s", description: "Build and run server." },
    { name: "help", type: Boolean, description: "Print usage instructions" },
]);
 
/* parse the supplied command-line values */
var options = cli.parse();
 
/* generate a usage guide */
var usage = cli.getUsage({
    header: ".---------------------------KINDRED------------------------.\n"+
            "|                                                          |"+
            "|  Running without options builds all client, server, and  |"+
            "|   test files, runs tests, launches server, and watches   |"+
            "|   the directory for changes, rebuilding when necessary.  |"+
            "|                                                          |"+
            "'----------------------------------------------------------'",
    footer: "For more information, email aaron.starov@kindred.website.   " 
});
    
console.log(options.help ? usage : options);

var fs = require('fs'),
    watch = require('watch'),
    makedir = require('mkdirp'),
    path = require('path'),
    colors = require('colors');


var client_dirs = ['aux/','client/'];
var server_dirs = ['aux/','server/'];
var test_dirs   = ['aux/','test/'];

var build_dir = __dirname+'/dist/',
    server_info = {
        name: "server",
        dirs: ["aux/","server/"],
        out: build_dir+"server.js",
    },

    client_info = {
        name: "client",
        dirs: ["aux/","client/"],
        out: build_dir+"client.js",
    },

    test_info = {
        name: "test",
        dirs: ["aux/","test/"],
        out: build_dir+"test.js",
    };

makedir(build_dir);

var build_info = [];


if(!(options.tests || options.serve)) {
    build_info = [server_info, client_info, test_info];
} else {
    if(options.tests) {
        build_info.push(test_info);    
    }
    if(options.serve) {
        build_info.push(server_info);
    }
}

var spawn = require("child_process").spawn;

function spawn_command(cmd, cb) {
    cmd_list = cmd.split(' ');
    var cmd_process = spawn(cmd_list[0], cmd_list.slice(1));

    cmd_process.stdout.on("data", function (data) {
      var str = data.toString().split('\n');
      for(var i in str) {
          console.log("| ".yellow + str[i].gray);
      }
    });

    cmd_process.stderr.on("data", function (data) {
      var str = data.toString().split('\n');
      for(var i in str) {
          console.log("! ".red + str[i].gray);
      }
    });

    cmd_process.on("error", function (data) {
      var str = data.toString().split('\n');
      for(var i in str) {
          console.log("! ".red + str[i].red);
      }
      if(typeof cb !== "undefined") cb(data, null);
    });

    cmd_process.on("exit", function (code) {
      console.log(" "+cmd_list[0].yellow+" exited with code: "+code);
      if(typeof cb !== "undefined") cb(null, code);
    });
       
    return cmd_process;
}

function traverse_tree(root_dir) {
    var dirs = [],
        files = [];    
    var traverse_subtree = function(dir, root) {
        var _dirs = [],
            _files = [];
        //var dir_path = path.join(root,dir);
        var dir_path = dir;
        var contents = fs.readdirSync(dir_path);

        for(var i in contents) {
            var f = contents[i];
            if(f[0] != '.') {
                var fpath = dir_path + f;
                var stat = fs.statSync(fpath);
                if(stat.isDirectory()) {
                   _dirs.push(fpath+'/'); 
                } else {
                    _files.push(fpath);
                }
            }
        }
        _files.sort();
        _dirs.sort();
        for(var i in _dirs) {
            var _dir = _dirs[i];
            _files = traverse_subtree(_dir, dir_path).concat(_files);
        }
        return _files;     
    };
    return traverse_subtree(root_dir, __dirname); 
}

function build() {
    console.log("\n--|Building Kindred|----------------------------\n\n");

    var index_file = "dist/index.html";
    var index_head = fs.readFileSync("client/index-head.html");
    var index_tail = fs.readFileSync("client/index-tail.html");
    fs.writeFileSync(index_file, index_head, {flag:'w'});

    for(var b in build_info) {
        var files = [];
        var build_obj = build_info[b];
        for(var i in build_obj.dirs) {
            var dir = build_obj.dirs[i];
            files = files.concat(traverse_tree(dir));
        }

        var build_file = build_obj.out;

        console.log("  Constructing "+build_obj.name.yellow+" file with:\n");


        var title = "//============>>>>>>>>-------<<<<<<<<============\\\\\n"+
                    "//============>>>>>>--Kindred--<<<<<<============\\\\\n"+
                    "//============>>>>>>>>-------<<<<<<<<============\\\\\n\n";
        fs.writeFileSync(build_file, title, {flag:'w'});
        var total = 0;
        for(var i in files) {
            var file = files[i];
            var file_parts = file.split('.');
            if(file_parts[file_parts.length - 1] === 'js') {
                var data = fs.readFileSync(file);
                var kb = (data.length/1024).toPrecision(5);
                var file_str = "\t-("+kb+" Kb)\t"+file;
                console.log(file_str.gray);
                var header = "//-------------------------------------------------\n"+
                             "//\n//  "+file+" ("+kb+" Kb)\n//\n"+ 
                             "//-------------------------------------------------\n\n\n";

                switch(build_obj.name) {
                    
                    case "client": 
                        var new_file_name = file.split('/').join('-');
                        var script_include = "        <script src='"+new_file_name+"'></script>\n";
                        fs.writeFileSync("dist/"+new_file_name, data, {flag:'w'}); // copy file to dist
                        fs.writeFileSync(index_file, script_include, {flag:'a'});
                    default:
                        fs.writeFileSync(build_file, header+data+"\n", {flag:'a'});    
                        total += kb;
                }
            }
        }
        fs.writeFileSync(build_file, "\n// Total size: "+total+" Kb\n", {flag:'a'});    
        console.log("\n  Finished building "+build_file.yellow+" ("+total+" Kb).\n\n");

    }

    fs.writeFileSync(index_file, index_tail, {flag:'a'});
    var minify_cmd = "minify dist/client.js --output dist/kindred-client.min.js";
    console.log("  Minifying client code with: \n\n"+
                "    $ "+minify_cmd+"\n\n");
    spawn_command(minify_cmd, function(err, exit_code) {
        if(!err) {
            fs.unlinkSync("dist/client.js"); // remove uncompressed client file
        }
    });

    console.log("------------------------------------------------\n");
}

build();

var watcher = function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
      // Finished walking the tree
    } else {
      // Something's been added, deleted, or removed
      build();  
    }
};

// Watch our files for changes and rebuild when they do
var dirs_to_build = ['aux/','client/','server/','test/'];
for(var _dir in dirs_to_build) {
    var dir = dirs_to_build[_dir];
    var watch_note = "\nWatching "+dir+" for changes.";
    console.log(watch_note.gray);
    watch.watchTree(__dirname+'/'+dir, watcher);
}


// Run the server

var redis_port = 6379;
var redis_cmd = "./redis-stable/src/redis-server ./redis-stable/redis.conf";
console.log("\nStarting redis db with:\n\n"+
            "  $ "+redis_cmd+"\n\n" +
            "Redis output will be logged in redis-stable/redis.log\n");

var server_cmd = "nodemon dist/server.js --watch dist";
console.log("\nStarting server with:\n\n  $ "+server_cmd+"\n\n" +
            "The server output follows.\n");

var test_cmd = "node dist/test.js";

spawn_command(redis_cmd);
spawn_command(server_cmd);
spawn_command(test_cmd);
