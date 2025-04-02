import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { createTask, updateTaskInDB } from '../store/taskSlice';
import InputField from '../components/InputField';

const TaskFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const task = route.params?.task;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Title and Description are required');
      return;
    }

    try {
      if (task) {
        await dispatch(updateTaskInDB({ id: task.id, title, description })).unwrap();
      } else {
        await dispatch(createTask({ title, description })).unwrap();
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }, [title, description, task, dispatch, navigation]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {task ? 'Edit Task' : 'New Task'}
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
          />
          <InputField
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            multiline
          />
          <TouchableOpacity
            style={[styles.submitButton, (!title.trim() || !description.trim()) && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!title.trim() || !description.trim()}
          >
            <Text style={styles.submitButtonText}>
              {task ? 'Update Task' : 'Create Task'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1976D2',
    borderBottomWidth: 1,
    borderBottomColor: '#1565C0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default TaskFormScreen; 