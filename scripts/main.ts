import {generateMissingUsers} from "./clean-unauthenticated";
import {migrateEventDates} from "./migrate-event-dates";

function main() {
    migrateEventDates();
}

main();
