//  Main file for Kindred development.
//
//  Builds Kindred, watches for changes, and launches dev server.
//
//  To use, run `$ node dev.js`
//
//  - Aaron Starov

// I know... I'm sorry. Ascii art (*sigh*) courtesy of http://patorjk.com.
var title = "                                                           \n"+
"//  oooo    oooo  /8;                    .o8                           .o8 \n"+ 
"//  `888   .8P'   `\"'                   888                           888 \n"+ 
"//   888  d8'    oooo  ooo. .oo.    .oooo888  oooo d8b  .ooooo.   .oooo888 \n"+ 
"//   88888[      `888  `888P'Y88b  d88' `888  `88p''YP d88' `88b d88' `888 \n"+ 
"//   888`88b.     888   888   888  888   888   88b     888ooo88P 888   888 \n"+ 
"//   888  `88b.   888   888   888  888   888   888     888    .o 888   888 \n"+ 
"//  o888o  o888o o888o o888o o888o `Y8bod88Pb d888b    `Y8bod8P' `Y8bod88Pb\n";
   
var fs = require('fs'),
    watch = require('watch'),
    makedir = require('mkdirp').sync,
    path = require('path'),
    colors = require('colors'),
    uglify = require('uglify-js');

var date_options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
};

var build_dir = path.normalize("../build/"),
    data_dir = path.normalize("../data/"),
    dev_build_dir = path.join(build_dir,"dev"),
    prod_build_dir = path.join(build_dir,"prod"),
    docs_dir = path.join(data_dir,"docs");
    table_of_contents_file = path.join(docs_dir,"table_of_contents.js"),
    documentation_file = path.join(docs_dir,"documentation.md"),
    documented_dirs = ["_","server","client"],

    build_info = [
        { 
            name: "server",
            dirs: ["_","server"],
            dev: "kindred-server.js",
            out: "kindred-server.min.js",
        },
        {
            name: "client",
            dirs: ["_","client"],
            dev: "kindred-client.js",
            out: path.join("dist","kindred-client.min.js"),
        },
    ];


var rmdir = function(dirPath, removeSelf) {
  if (removeSelf === undefined)
    removeSelf = true;
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = path.join(dirPath, files[i]);
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmdir(filePath);
    }
  if (removeSelf)
    fs.rmdirSync(dirPath);
};

var exec = require("child_process").execSync;
var spawn = require("child_process").spawn;

function spawn_command(cmd_name, cmd, cb) {
    cmd_list = cmd.split(' ');
    var cmd_process = spawn(cmd_list[0], cmd_list.slice(1));

    cmd_process.stdout.on("data", function (data) {
      var str = data.toString().split('\n');
      for(var i in str) {
          process_str = "| ["+cmd_name+"] ";
          console.log(process_str.yellow + str[i].gray);
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
    var traverse_subtree = function(dir, root) {
        var dirs = [],
            top_files = [],
            files = [];
        //var dir_path = path.join(root,dir);
        var dir_path = path.normalize(dir);
        var contents = fs.readdirSync(dir_path);

        for(var i in contents) {
            var f = contents[i];
            if(f[0] != '.') {
                var fpath = path.join(dir_path, f);
                var stat = fs.statSync(fpath);
                if(stat.isDirectory()) {
                    dirs.push(fpath); 
                } else {
                    top_files.push(fpath);
                }
            }
        }
        dirs.sort();
        for(var i = 0, len = dirs.length; i < len; i++) {
            var _dir = dirs[i];
            files = files.concat(traverse_subtree(_dir, dir_path));
        }
        return files.concat(top_files.sort());
    };
    return traverse_subtree(root_dir, __dirname); 
}

function traverse_tree_breadth(root_dir) {
    var traverse_subtree = function(dir, root) {
        var dirs = [],
            top_files = [],
            files = [];
        //var dir_path = path.join(root,dir);
        var dir_path = path.normalize(dir);
        var contents = fs.readdirSync(dir_path);

        for(var i in contents) {
            var f = contents[i];
            if(f[0] != '.') {
                var fpath = path.join(dir_path, f);
                var stat = fs.statSync(fpath);
                if(stat.isDirectory()) {
                    dirs.push(fpath); 
                } else {
                    top_files.push(fpath);
                }
            }
        }
        dirs.sort();
        for(var i = 0, len = dirs.length; i < len; i++) {
            var _dir = dirs[i];
            files = files.concat(traverse_subtree(_dir, dir_path));
        }
        return top_files.sort().concat(files);
    }

    return traverse_subtree(root_dir, __dirname); 
}

function build(debug_mode) {
    console.log("\n--| Building Kindred |---------------------------\n");

    rmdir(build_dir, false);
    makedir(dev_build_dir);
    makedir(prod_build_dir);
    makedir(docs_dir);

    // Read and write index files.
    var html_source_dir = path.join("client","html");
    var dev_index_file = path.join(dev_build_dir,"index.html");
    var dev_index_head = fs.readFileSync(path.join(html_source_dir,"index-head.html"));
    var dev_index_tail = fs.readFileSync(path.join(html_source_dir,"index-tail.html"));
    fs.writeFileSync(dev_index_file, dev_index_head, {flag:'w'});
    var prod_index_file = path.join(prod_build_dir,"index.html");
    var prod_index = fs.readFileSync(path.join(html_source_dir,"min-index.html"));
    fs.writeFileSync(prod_index_file, prod_index, {flag:'w'});

    // Write test header
    var test_helper = fs.readFileSync(path.join("test","_","helper.js"));
    makedir(path.join(dev_build_dir,"dist"));
    fs.writeFileSync(path.join(dev_build_dir,"dist","test.js"), test_helper, {flag:'w'});

    // Initialize documentation object -- all sub-sections will mirror this pattern
    var documentation = fs.readFileSync(path.join(__dirname,"..","README.md")),
        table_of_contents = "";
     
    makedir(path.join(prod_build_dir,"dist"));

    var files_breadth_first = [];

    // assemble documentation
    for(var i = 0, len = documented_dirs.length; i < len; i++) {
        var dir = documented_dirs[i];
        files_breadth_first = files_breadth_first.concat(traverse_tree_breadth(dir));
    }

    for(var i in files_breadth_first) {
        var file = files_breadth_first[i];
        var file_path = path.parse(file);
        if(file_path.ext === '.md') {
            var data = fs.readFileSync(file);
            var header = "\n\n",
                path_parts = file_path.dir.split('/'),
                path_part = path_parts.length,
                header_title = file_path.name;
            while(header_title === '_') {
                header_title = path_parts[--path_part];
            }

            var header_depth = path_part + 2; 
            if(!header_title) { // special case for title with all underscores
                header_title = "Source";
                header_depth++;
            }
            for(var p = path_part; p > base_depth; p--) {
                // reduce header depth for underscores present in path
                if(path_parts[p] == '_') {
                    --header_depth; 
                }
            }
            capitalized_header = header_title.charAt(0).toUpperCase()+header_title.slice(1);
            header = "\n\n<h"+header_depth+" id='"+capitalized_header+"'>"+capitalized_header+"</h"+header_depth+">\n\n";
            
            documentation += header + data;

            contents_entry = "\n\n<h"+header_depth+"><a href='#"+capitalized_header+"'>"+capitalized_header+"</a>";
            table_of_contents += contents_entry;
        }
    }
    
    for(var b in build_info) {
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - -");
        var files = [];
        var build_obj = build_info[b];
        // Collect all the files in the order they appear in the directory
        // tree.
        for(var i = 0, len = build_obj.dirs.length; i < len; i++) {
            var dir = build_obj.dirs[i];
            files = files.concat(traverse_tree(dir));
            files_breadth_first = files_breadth_first.concat(traverse_tree_breadth(dir));
        }

        // These will wrap every test.
        var test_head = fs.readFileSync(path.join("test",build_obj.name,"head.js"));
        var test_tail = fs.readFileSync(path.join("test",build_obj.name,"tail.js"));

        var dev_build_file =  path.join(__dirname,dev_build_dir, build_obj.dev);
        var prod_build_file = path.join(__dirname,prod_build_dir,build_obj.out);
        var base_depth = path.parse(__dirname).dir.split('/').length; 

        console.log("  Constructing "+build_obj.name.yellow+" file with:\n");
                    
        var total_kb = 0;
        var files_to_compress = [];

        for(var i in files) {
            var file = files[i];
            var file_path = path.parse(file); 
            var file_parts = file.split('.');

            var test_location = file_parts.length - 2;

            if(file_path.ext === '.js') {
                var data = fs.readFileSync(file);
                var kb = (data.length/1024);
                total_kb += kb;
                var file_str = "\t-("+kb.toPrecision(5)+" Kb)\t"+file;
                var file_dir = path.join(dev_build_dir,"dist",path.dirname(file));
                console.log(file_str.gray);
                var header = "//-------------------------------------------------\n"+
                             "//\n//  "+file+" ("+kb.toPrecision(5)+" Kb)\n//\n"+ 
                             "//-------------------------------------------------\n\n\n";

                switch(build_obj.name) {
                    case "client": 
                        if(file_parts[test_location] === 'test') {
                            // Wrap this into a test unit and append to the dev file.
                            var original_file = file_parts.slice(0,test_location).concat(['js']).join('.');     
                            var original_path = path.join(dev_build_dir,"dist",original_file);
                            
                            fs.writeFileSync(original_path, test_head, {flag:'a'});
                            fs.writeFileSync(original_path, '\nTest.begin("'+original_file+'");\n\n', {flag:'a'});
                            fs.writeFileSync(original_path, data, {flag:'a'});
                            fs.writeFileSync(original_path, test_tail, {flag:'a'});
                        } else {
                            // We'll copy to one file for minification, and add an include script
                            // for an unminified version to make tracking down issues simpler during
                            // development. 
                            var file_name = path.basename(file);
                            makedir(path.join(__dirname,file_dir));
                            var script_include = "        <script src='"+file+"'></script>\n";
                            fs.writeFileSync(path.join(file_dir,file_name), data, {flag:'w'}); 
                            fs.writeFileSync(dev_index_file, script_include, {flag:'a'});
                            files_to_compress.push(file);
                            fs.writeFileSync(path.join(prod_build_dir,"dist","client.js"), data+"\n", {flag:'a'});    
                        }
                        break
                    case "server":
                        if(file_parts[test_location] === 'test') {
                            
                        } else {
                            fs.writeFileSync(dev_build_file, header+data+"\n", {flag:'a'});    
                            files_to_compress.push(file);
                        }
                }
                
            }
        }
        console.log("\n  Total size: "+total_kb.toPrecision(5)+" Kb\n");    
        console.log("\n  Minifying the files above.\n");
        if(debug_mode) {
            for(var i = 0; i < files_to_compress.length; i++) {
                console.log("  -minifying "+files_to_compress[i]);
                uglify.minify(files_to_compress[i]);
            }
        }
        var minified = uglify.minify(files_to_compress);
        
        fs.writeFileSync(prod_build_file, minified.code, {flag:'w'});
        console.log("\n  Finished building "+build_obj.out.yellow+" ("+(minified.code.length/1024.0).toPrecision(5)+" Kb).");

    }

    fs.writeFileSync(documentation_file, documentation, {flag:'w'});
    fs.writeFileSync(table_of_contents_file, table_of_contents, {flag:'w'});
    fs.writeFileSync(dev_index_file, dev_index_tail, {flag:'a'});

    console.log("\n-------------------------------------------------\n  "
                    +(new Date(Date.now())).toLocaleTimeString("en-us", date_options).dim+'\n');

}

build(true); 

var watcher = function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
        // Finished walking the tree
    } else {
        // Something's been added, deleted, or removed
        //try { 
        build();  
        //} catch(err) {
        //   console.log("Oops: build failed. It failed because: \n".red);
        //   console.log(err);
        //}
    }
};

// Watch our files for changes and rebuild when they do
var dirs_to_build = ['_','client','server','test'];
for(var _dir in dirs_to_build) {
    var dir = dirs_to_build[_dir];
    var watch_note = "\n  Watching "+dir+" for changes.";
    console.log(watch_note.gray);
    watch.watchTree(path.join(__dirname,dir), watcher);
}

//require("./dist/test.js")();

// Run the server

//var redis_port = 6379;
//var redis_cmd = "../redis-stable/src/redis-server ../redis-stable/redis.conf";
//console.log("\n  Starting redis db with:\n\n"+
//              "    $ "+redis_cmd+"\n\n" +
//              "  Redis output will be logged in log/redis.log\n");
//spawn_command("redis", redis_cmd);

//makedir(path.normalize("../data/"));
//var mongo_cmd = "mongod --dbpath=../data --port 22488";
//console.log("\n  Starting mongodb with:\n\n"+
//              "    $ "+mongo_cmd+"\n\n" +
//              "  Output will be spilled below.\n");
//spawn_command("mongo", mongo_cmd);

// kill any existing kindred server
var is_windows = /^win/.test(process.platform);
var kill_cmd =  "kill $(ps aux | grep 'kindred-server' | awk '{print $2}')";
//console.log("\n  $ "+kill_cmd.red);
if(!is_windows) {
    exec(kill_cmd);
}

var server_cmd = "nodemon "+" --watch "+dev_build_dir+" "+path.join(dev_build_dir,"kindred-server.js");
console.log("\n  Starting server with:\n\n"+
              "    $ "+server_cmd+"\n\n" +
              "  The server will automatically restart when you make changes. Its output follows.\n");
spawn_command("kindred", server_cmd);
