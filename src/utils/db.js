import Dexie from 'dexie';

// 1. Initialize the database
export const db = new Dexie('CafeteriaDB');

// 2. Define the tables and the data we want to index (search by)
// The first item 'studentID' automatically becomes the Primary Key.
db.version(1).stores({
  eligibleStudents: 'studentID, temporaryClaimStatus, syncStatus'
});