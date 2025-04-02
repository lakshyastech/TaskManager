# Task Manager Mobile App

A React Native mobile application that demonstrates offline data storage, state management with Redux, and basic CRUD operations.

## Features

- Create, read, update, and delete tasks
- Offline data storage using SQLite
- State management with Redux Toolkit
- Clean and modern UI design
- Form validation
- Error handling

## Technical Stack

- React Native
- Redux Toolkit for state management
- React Native SQLite Storage for offline data
- React Navigation for screen navigation

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment setup
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TaskManager
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install CocoaPods dependencies:
```bash
cd ios
pod install
cd ..
```

## Running the App

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```


## Features Implementation

### Offline Storage
- Uses SQLite for local data persistence
- Database is initialized when the app starts
- All CRUD operations are performed on the local database

### State Management
- Redux Toolkit is used for state management
- Actions and reducers are organized in taskSlice.js
- Async thunks handle database operations

### CRUD Operations
- Create: Add new tasks with title and description
- Read: View list of all tasks
- Update: Modify existing task details
- Delete: Remove tasks from the list

## Error Handling

- Form validation for required fields
- Error messages for database operations
- Loading states for async operations
- Confirmation dialogs for destructive actions

## Known Limitations

- No data synchronization with remote server
- Limited to basic task management features
- No user authentication

