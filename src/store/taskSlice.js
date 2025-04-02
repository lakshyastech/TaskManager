import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getDBConnection from '../database/database';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} = taskSlice.actions;

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const db = await getDBConnection();
      const [result] = await db.executeSql(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );
      const tasks = [];
      for (let i = 0; i < result.rows.length; i++) {
        tasks.push(result.rows.item(i));
      }
      dispatch(setTasks(tasks));
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ title, description }, { dispatch }) => {
    try {
      dispatch(setError(null));
      const db = await getDBConnection();
      const [result] = await db.executeSql(
        'INSERT INTO tasks (title, description) VALUES (?, ?)',
        [title, description]
      );
      const newTask = {
        id: result.insertId,
        title,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dispatch(addTask(newTask));
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      dispatch(setError(error.message));
      throw error;
    }
  }
);

export const updateTaskInDB = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, title, description }, { dispatch }) => {
    try {
      dispatch(setError(null));
      const db = await getDBConnection();
      await db.executeSql(
        'UPDATE tasks SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, description, id]
      );
      const updatedTask = {
        id,
        title,
        description,
        updated_at: new Date().toISOString(),
      };
      dispatch(updateTask(updatedTask));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      dispatch(setError(error.message));
      throw error;
    }
  }
);

export const deleteTaskFromDB = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { dispatch }) => {
    try {
      dispatch(setError(null));
      const db = await getDBConnection();
      await db.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch(setError(error.message));
      throw error;
    }
  }
);

export default taskSlice.reducer; 