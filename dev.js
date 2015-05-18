// Main
//
// Builds Kindred, watches for changes, and launches server.
    
var fs = require('fs'),
    watch = require('watch'),
    makedir = require('mkdirp').sync,
    path = require('path'),
    colors = require('colors'),
    uglify = require('uglify-js');

var build_dir = "build/",
    dev_build_dir = build_dir+"dev/",
    prod_build_dir = build_dir+"prod/",

    build_info = [
        { 
            name: "server",
            dirs: ["aux/","server/"],
            dev: "server.js",
            out: "server.min.js",
        },
        {
            name: "client",
            dirs: ["aux/","client/"],
            dev: "client.js",
            out: "dist/kindred-client.min.js",
        },
    ];

makedir(dev_build_dir);
makedir(prod_build_dir);

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
      if(typeof cb !== "undefined") {
          if(code === 1) {
               cb(1, 1);
          } else {
              cb(null, code);
          }
      }
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

    // Read and write index files.
    var dev_index_file = dev_build_dir+"index.html";
    var dev_index_head = fs.readFileSync("client/index-head.html");
    var dev_index_tail = fs.readFileSync("client/index-tail.html");
    fs.writeFileSync(dev_index_file, dev_index_head, {flag:'w'});
    var prod_index_file = prod_build_dir+"index.html";
    var prod_index = fs.readFileSync("client/min-index.html");
    fs.writeFileSync(prod_index_file, prod_index, {flag:'w'});

    makedir(prod_build_dir+"dist/");
    
    for(var b in build_info) {
        var files = [];
        var build_obj = build_info[b];
        // Collect all the files in the order they appear in the directory
        // tree.
        for(var i in build_obj.dirs) {
            var dir = build_obj.dirs[i];
            files = files.concat(traverse_tree(dir));
        }

        // These will wrap every test.
        var test_head = fs.readFileSync("test/"+build_obj.name+"/head.js");
        var test_tail = fs.readFileSync("test/"+build_obj.name+"/tail.js");

        var dev_build_file = __dirname+'/'+dev_build_dir+build_obj.dev;
        var prod_build_file = __dirname+'/'+prod_build_dir+build_obj.out;

        console.log("  Constructing "+build_obj.name.yellow+" file with:\n");

        var title = "//============>>>>>>>>-------<<<<<<<<============\\\\\n"+
                    "//============>>>>>>--Kindred--<<<<<<============\\\\\n"+
                    "//============>>>>>>>>-------<<<<<<<<============\\\\\n\n";
        fs.writeFileSync(dev_build_file, title, {flag:'w'});
        fs.writeFileSync(prod_build_file, "// Kindred\n", {flag:'w'});
        var total_kb = 0;
        var files_to_compress = [];
        for(var i in files) {
            var file = files[i];
            var file_parts = file.split('.');

            var test_location = file_parts.length - 2;

            if(file_parts[file_parts.length - 1] === 'js') {
                var data = fs.readFileSync(file);
                var kb = (data.length/1024);
                total_kb += kb;
                var file_str = "\t-("+kb.toPrecision(5)+" Kb)\t"+file;
                var file_dir = dev_build_dir+"dist/"+path.dirname(file)+'/';
                console.log(file_str.gray);
                var header = "//-------------------------------------------------\n"+
                             "//\n//  "+file+" ("+kb.toPrecision(5)+" Kb)\n//\n"+ 
                             "//-------------------------------------------------\n\n\n";

                switch(build_obj.name) {
                    case "client": 
                        if(file_parts[test_location] === 'test') {
                            // Wrap this into a test unit and append to the dev file.
                            var original_file = file_parts.slice(0,test_location).concat(['js']).join('.');     
                            var original_path = dev_build_dir+"dist/"+original_file;
                            
                            fs.writeFileSync(original_path, test_head, {flag:'a'});
                            fs.writeFileSync(original_path, '\nTest.begin("'+original_file+'");\n\n', {flag:'a'});
                            fs.writeFileSync(original_path, data, {flag:'a'});
                            fs.writeFileSync(original_path, test_tail, {flag:'a'});
                        } else {
                            // We'll copy to one file for minification, and add an include script
                            // for an unminified version to make tracking down issues simpler during
                            // development. 
                            var file_name = path.basename(file);
                            makedir(__dirname+'/'+file_dir);
                            var script_include = "        <script src='"+file+"'></script>\n";
                            fs.writeFileSync(file_dir+file_name, data, {flag:'w'}); 
                            fs.writeFileSync(dev_index_file, script_include, {flag:'a'});
                            files_to_compress.push(file);
                            fs.writeFileSync(prod_build_dir+"dist/client.js", data+"\n", {flag:'a'});    
                        }
                        break
                    case "server":
                        if(file_parts[file_parts.length - 2] === 'test') {
                            
                        } else {
                            fs.writeFileSync(dev_build_file, header+data+"\n", {flag:'a'});    
                        }
                }
                
            }
        }
        fs.writeFileSync(dev_build_file, "\n// Total size: "+total_kb.toPrecision(5)+" Kb\n", {flag:'a'});    
        console.log("\n  Finished building "+dev_build_file.yellow+" ("+total_kb.toPrecision(5)+" Kb).\n\n");

    }

    console.log("minifying: "+JSON.stringify(files_to_compress));
    for( var f in files_to_compress) {
        var fil = files_to_compress[f];
        try { 
            var _minified = uglify.minify(fil);
        } catch(err) {
            console.log("error while minifying "+fil);
        }
    }
    var minified = uglify.minify(files_to_compress);
    fs.writeFileSync(build_obj.out, minified.code, {flag:'w'});

    fs.writeFileSync(dev_index_file, dev_index_tail, {flag:'a'});
    //var minify_cmd = "minify "+prod_build_dir+"dist/client.js --clean --output "+prod_build_dir+"dist/kindred-client.min.js";
    //console.log("  Minifying production client code with: \n\n"+
    //            "    $ "+minify_cmd+"\n\n");
    //spawn_command(minify_cmd, function(err, exit_code) {
    //    if(!err) {
    //        //fs.unlinkSync(prod_build_dir+"client.js"); // remove uncompressed client file
    //    }
    //});

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

//require("./dist/test.js")();

// Run the server

var redis_port = 6379;
var redis_cmd = "./redis-stable/src/redis-server ./redis-stable/redis.conf";
console.log("\nStarting redis db with:\n\n"+
            "  $ "+redis_cmd+"\n\n" +
            "Redis output will be logged in redis-stable/redis.log\n");

spawn_command(redis_cmd);

//var test_cmd = "node dist/test.js";
//spawn_command(test_cmd, function(err, code){
//
//    if(err) { process.exit(1); }

    var server_cmd = "nodemon build/dev/server.js --watch build/dev";
    console.log("\nStarting server with:\n\n  $ "+server_cmd+"\n\n" +
                "The server output follows.\n");
    spawn_command(server_cmd);
//});
