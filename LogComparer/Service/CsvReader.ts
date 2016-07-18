import fs = require('fs');
import parse = require('csv-parse/lib/sync');
import csvTypes = require('csv-parse/types');
import telemetry = require('../Util/Telemetry');

export class CsvReader {
    // Assumes csv files to be encoded as 'utf8'.
    // Keeping the file IO Synchronous for simplicity.
    // This should be updated to use 'callbacks'.
    readAndParse<T>(fullPath: string): T[] {
        let results = [];
        try {
            const fileData = fs.readFileSync(fullPath, 'utf8');
            results = this.processFile(fileData);
        } catch (error) {
            telemetry.Telemetry.logEror(error);
        }

        return <T[]>results;
    }

    private processFile<T>(data: string): T[] {
        const options: csvTypes.options = {};
        options.columns = true;
        const results = parse(data, options);
        return results;
    }
}