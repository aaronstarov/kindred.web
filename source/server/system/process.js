var System = {};

var spawn = require("child_process").spawn;

System.spawn_command = function(cmd, cb) {
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
};

