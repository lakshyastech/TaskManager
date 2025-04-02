import SQLite from 'react-native-sqlite-storage';


SQLite.enablePromise(true);

const database_name = "TaskManager.db";
const database_version = "1.0";
const database_displayname = "Task Manager SQLite Database";
const database_size = 200000;

let dbInstance = null;

const getDBConnection = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const db = await SQLite.openDatabase({
      name: database_name,
      version: database_version,
      displayName: database_displayname,
      size: database_size,
      location: 'default'
    });
    dbInstance = db;
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

let isInitialized = false;

export const initDatabase = async () => {
  if (isInitialized) {
    return getDBConnection();
  }

  try {
    const db = await getDBConnection();
    const createTableQuery = `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;
    await db.executeSql(createTableQuery);

    const [result] = await db.executeSql('SELECT COUNT(*) as count FROM tasks');
    const count = result.rows.item(0).count;

    if (count === 0) {
      const sampleTasks = [
        {
          title: "Morning Workout",
          description: "Complete a 30-minute workout session, including stretching, cardio, and strength exercises."
        },
        {
          title: "Prepare Breakfast",
          description: "Make a healthy breakfast, including eggs, toast, and fresh juice."
        },
        {
          title: "Check Emails",
          description: "Review and respond to important emails before starting the workday."
        },
        {
          title: "Team Meeting",
          description: "Join the daily stand-up meeting to discuss progress and plan the day's tasks."
        },
        {
          title: "Work on Project Tasks",
          description: "Focus on assigned project tasks, such as coding, designing, or writing reports."
        },
        {
          title: "Lunch Break",
          description: "Take a lunch break to eat and relax for an hour before continuing work."
        },
        {
          title: "Client Call",
          description: "Attend a scheduled call with a client to discuss project updates and requirements."
        },
        {
          title: "Review Documents",
          description: "Go through important documents and make necessary revisions or approvals."
        },
        {
          title: "Evening Walk",
          description: "Take a 20-minute walk to refresh the mind and get some fresh air."
        },
        {
          title: "Read a Book",
          description: "Read at least 10 pages of a book to enhance knowledge and relax before bed."
        }
      ];

      for (const task of sampleTasks) {
        await db.executeSql(
          'INSERT INTO tasks (title, description) VALUES (?, ?)',
          [task.title, task.description]
        );
      }
    }

    isInitialized = true;
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default getDBConnection; 