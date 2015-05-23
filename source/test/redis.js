var Redis = require("ioredis"),
    redis = new Redis({ showFriendlyErrorStack: true });

//var cmds = redis.getBuiltinCommands();
//console.log(cmds);

redis.on("error", function (err) {
    console.log("!! Redis error:".red + err);
});

redis.set("string key", "string val", Redis.print);
redis.hset("hash key", "hashtest 1", "some value", Redis.print);
redis.hset(["hash key", "hashtest 2", "some other value"], Redis.print);
redis.hkeys("hash key", function (err, replies) {
    note_result("Redis had "+replies.length + " replies:");
    replies.forEach(function (reply, i) {
        note_result("    " + i + ": " + reply);
    });
    redis.quit();
});
