import fs = require('fs');
import parse = require('csv-parse/lib/sync');
import csvTypes = require('csv-parse/types');
import telemetry = require('../Util/Telemetry');

export class CsvReader {
    // Assumes csv files to be encoded as 'utf8'.
    readAndParse<T>(fullPath: string): T[] {
        var results = [];
        try {
            var fileData = fs.readFileSync(fullPath, 'utf8');
            results = this.processFile(fileData);
        } catch (error) {
            telemetry.Telemetry.logEror(error);
        }

        return <T[]>results;
    }

    private processFile<T>(data: string): T[] {
        var options: csvTypes.options = {};
        options.columns = true;
        var results = parse(data, options);
        return results;
    }
}