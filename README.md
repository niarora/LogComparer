# LogComparer

Compares the log entries against registered events.
The Csv file containing the data must be UTF-8 encoded.

Uses Visual Studio to build a TypeScript project.
Restore the NPM packages first before trying to debug.

Usage:
node app.js CsvLogFilePath CsvEventFilePath
e.g.
node app.js logs.csv events.csv

The app returns "[{ unMatchedEntries: [] }]" if there's ANY exception in reading and parsing the csv files.
The exception is logged via the Telemetry class.

The Algorigthm for matching logs with events runs in
O(E + L) time with O(E) space.
To be more precise it only iterates through the Events and the Logs once.
There's a hash maintained which takes approximately as much memory as all Registered Events.