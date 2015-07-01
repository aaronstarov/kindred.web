Kindred.get_file = function(file_path) {
    Kindred.socket.emit("file", file_path);
};
