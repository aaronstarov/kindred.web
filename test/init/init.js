console.log("Output from tests will be written to: "+test_output);
fs.writeFileSync(test_output, '', {flag:'w'});

console.log("Running tests.");
