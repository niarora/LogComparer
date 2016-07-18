import Model = LogComparer.Model;

export class Matcher {
    matchLogsWithEvents(logs: Model.ILogEntry[], events: Model.IRegisteredEvent[]): any {
        if (!logs || !events || !logs.length || !events.length) {
            return [{ unMatchedEntries: [] }];
        }

        // Create a nested hash based on properties of Events to be matched with Logs.
        // Takes O(E) time where E is the number of events and O(E) space.
        var eventsHash = {};
        events.forEach(event => {
            var hashValue = eventsHash[event.applicationType];
            if (hashValue) {
                hashValue = hashValue[event.resourceType];
                if (hashValue) {
                    if (!hashValue[event.resourceName]) {
                        hashValue[event.resourceName] = event;
                    }
                    // Else for this If can be used to detect duplicated Events with
                    // different event names.
                } else {
                    hashValue[event.resourceType] = {};
                    hashValue[event.resourceType][event.resourceName] = event;
                }
            } else {
                eventsHash[event.applicationType] = {};
                eventsHash[event.applicationType][event.resourceType] = {}
                eventsHash[event.applicationType][event.resourceType][event.resourceName] = event;
            }
        });

        var matched = [];
        var unmatched = [];
        // For each log entry, if it doesn't match the computed events hash, 
        // add it to the unmatched array.
        // If there's a match update the existing occurence count or set it to 1.
        logs.forEach(log => {
            var isMatched = false;
            var hashValue = eventsHash[log.applicationType];
            if (hashValue) {
                hashValue = hashValue[log.resourceType];
                if (hashValue) {
                    if (hashValue[log.resourceName]) {
                        isMatched = true;
                        const event = hashValue[log.resourceName];
                        if (!event.isPushed) {
                            event.isPushed = true;
                            event.data = {
                                eventName: event.eventName,
                                count: 1
                            };
                            matched.push(event.data);
                        } else {
                            event.data.count++; // We are leveraging references to increment the count in already pushed match.
                        }
                    }
                }
            }

            if (!isMatched) {
                unmatched.push(log);
            }            
        });
        const results = matched;
        results.push({ unmatchedLogEntries: unmatched });
        return results;
    }

}