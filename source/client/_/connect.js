var connect_socket = function(host) {
    return host ? io(host) : io();
};

Kindred.socket = connect_socket();
