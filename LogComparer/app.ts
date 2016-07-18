import Reader = require('./Service/CsvReader');
import Matcher = require('./Service/Matcher');
import Model = LogComparer.Model;

class App {
    static main(): number {
        // The first argument is the path to the csv with logs entries.
        const logFile = process.argv[2];
        const parser = new Reader.CsvReader();
        const logs = parser.readAndParse<Model.ILogEntry>(logFile);
        console.log('Requirement #1. All logs.');
        console.log(JSON.stringify(logs, null, ' '));

        // The second argument is the path to the csv with events entries.
        const eventFile = process.argv[3];
        const events = parser.readAndParse<Model.IRegisteredEvent>(eventFile);
        console.log('\n\nRequirement #2. All the events.');
        console.log(JSON.stringify(events, null, ' '));
        const matchedResults = new Matcher.Matcher().matchLogsWithEvents(logs, events);
        console.log('\n\nRequirement #3. All logs matched against the events.');
        console.log(JSON.stringify(matchedResults, null, ' '));
        return 0;
    }
}

App.main();
