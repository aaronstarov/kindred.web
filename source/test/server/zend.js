// Same message repeated twice, once above test results, once below,
// just to make them easier to see.
if(Test.report.num_errors > 0) {
    console.log("Finished testing without errors! Yay! Results below.\n".green);
} else {
    console.log("Finished testing with "+Test.report.num_errors+" errors. Results below.\n".red);
}
console.log(Test.report);
if(Test.report.num_errors > 0) {
    console.log("Finished testing without errors! Yay! Results above.\n".green);
} else {
    console.log("Finished testing with "+Test.report.num_errors+" errors. Results above.\n".red);
}
