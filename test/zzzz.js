
} catch(err) {
    test_report.sections[current_section].push({
        error: err,
    });
}

test_report.summary = "Finished testing with "+num_errors.toString()+" errors.";
