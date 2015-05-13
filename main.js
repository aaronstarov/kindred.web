// Main
//
// Builds Kindred, watches for changes, and launches server.


var fs = require('fs'),
    watch = require('watch'),
    makedir = require('mkdirp'),
    walk = require('walkdir'),
    path = require('path'),
    colors = require('colors');


var client_dirs = ['aux/','client/'];
var server_dirs = ['aux/','server/'];

var build_dir = __dirname+'/dist/',
    server_file = build_dir+'server.js',
    client_file = build_dir+'client.js';
makedir(build_dir);

var build_info = [
    { name: "client", dirs: client_dirs, out: client_file },
    { name: "server", dirs: server_dirs, out: server_file },
];

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
            _files = _files.concat(traverse_subtree(_dir, dir_path));
        }
        return _files;     
    };
    return traverse_subtree(root_dir, __dirname); 
}

function build() {
    console.log("\n--|Building Kindred|----------------------------\n\n");
    var client_files = [],
        server_files = [];
    for(var b in build_info) {
        var files = [];
        var build_obj = build_info[b];
        for(var i in build_obj.dirs) {
            var dir = build_obj.dirs[i];
            files = files.concat(traverse_tree(dir));
        }

        var build_file = build_obj.out;

        console.log("  Constructing "+build_obj.name+" file with:\n");

        var title = "//============>>>>>>>>-------<<<<<<<<============\\\\\n"+
                    "//============>>>>>>--Kindred--<<<<<<============\\\\\n"+
                    "//============>>>>>>>>-------<<<<<<<<============\\\\\n\n";
        fs.writeFileSync(build_file, title, {flag:'w'});
        var total = 0;
        for(var i in files) {
            var file = files[i];
            var file_parts = file.split('.');
            if(file_parts[file_parts.length - 1] === 'js') {
                console.log("\t-"+file.gray);
                var data = fs.readFileSync(file);
                var header = "//-------------------------------------------------\n"+
                             "//\n//  "+file+" ("+data.length+" bytes)\n//\n"+ 
                             "//-------------------------------------------------\n\n\n";
                fs.writeFileSync(build_file, header+data+"\n", {flag:'a'});    
                total += data.length;
            }
        }
        fs.writeFileSync(build_file, "\n// Total size: "+total/1000+" Kb\n", {flag:'a'});    
        console.log("\n  Finished building "+build_file+" ("+total/1000+" Kb).\n\n");

    }

    console.log("------------------------------------------------\n");
}

build();

var watcher = function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
      // Finished walking the tree
    } else {
      build();  
    }
};

// Watch our files for changes and rebuild when they do
var dirs_to_build = ['aux/','client/','server/'];
for(var _dir in dirs_to_build) {
    var dir = dirs_to_build[_dir];
    var watch_note = "\nWatching "+dir+" for changes.";
    console.log(watch_note.gray);
    watch.watchTree(__dirname+'/'+dir, watcher);
}


// Run the server
var spawn = require('child_process').spawn,
    child;

var server_cmd = 'nodemon dist/server.js --watch dist';
console.log("\nStarting server with:\n\n  $ "+server_cmd+"\n\n" +
            "The server output follows.\n");

var cmd_list = server_cmd.split(' ');

var server = spawn(cmd_list[0], cmd_list.slice(1));

server.stdout.on('data', function (data) {
  var str = data.toString().split('\n');
  for(var i in str) {
      console.log('| '.yellow + str[i].gray);
  }
});

server.stderr.on('data', function (data) {
  var str = data.toString().split('\n');
  for(var i in str) {
      console.log('! '.red + str[i].gray);
  }
});

server.on('error', function (data) {
  console.log('! '.red + data.toString().red);
  var str = data.toString().split('\n');
  for(var i in str) {
      console.log('! '.red + str[i].red);
  }
});

server.on('exit', function (code) {
  console.log('Server exited with code: ' + code);
});
