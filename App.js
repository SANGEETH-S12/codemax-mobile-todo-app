
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const categories = ['Personal', 'Study', 'Work'];

// HOME SCREEN
function HomeScreen({
  navigation,
  tasks,
  completeTask,
  deleteTask,
  updateTask,
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Personal');

  const filteredTasks = tasks.filter(item => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      filter === 'All' || item.category === filter;

    return matchesSearch && matchesCategory;
  });

  function saveEdit(id) {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Task name cannot be empty.');
      return;
    }

    updateTask(id, editTitle.trim(), editCategory);
    setEditingId(null);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Welcome Back!</Text>
      <Text style={styles.subtitle}>
        Manage your daily activities.
      </Text>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.number}>{tasks.length}</Text>
          <Text>All Tasks</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.number}>
            {tasks.filter(t => t.completed).length}
          </Text>
          <Text>Completed</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.buttonText}>+ Add New Task</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Search Tasks</Text>

      <TextInput
        style={styles.input}
        placeholder="Search your tasks..."
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.heading}>Filter by Category</Text>

      <View style={styles.categoryRow}>
        {['All', ...categories].map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              filter === item && styles.selectedCategory,
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.categoryText,
                filter === item && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.heading}>
        Tasks ({filteredTasks.length})
      </Text>

      {filteredTasks.length === 0 && (
        <Text style={styles.empty}>
          No matching tasks found.
        </Text>
      )}

      {filteredTasks.map(item => (
        <View key={item.id} style={styles.taskCard}>

          {editingId === item.id ? (

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Edit Task</Text>

              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Enter task name"
              />

              <Text style={styles.label}>Select Category</Text>

              <View style={styles.categoryRow}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      editCategory === cat && styles.selectedCategory,
                    ]}
                    onPress={() => setEditCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        editCategory === cat && styles.selectedText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.mainButton}
                onPress={() => saveEdit(item.id)}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setEditingId(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

          ) : (

            <>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.finished,
                  ]}
                >
                  {item.title}
                </Text>

                <Text style={styles.category}>
                  {item.category}
                </Text>
              </View>

              <View style={styles.actionColumn}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => completeTask(item.id)}
                >
                  <Text style={styles.buttonText}>
                    {item.completed ? 'Undo' : 'Done'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingId(item.id);
                    setEditTitle(item.title);
                    setEditCategory(item.category);
                  }}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTask(item.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>

          )}

        </View>
      ))}
    </ScrollView>
  );
}

// ADD TASK SCREEN
function AddTaskScreen({ navigation, addTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');

  function handleAdd() {
    if (!title.trim()) {
      Alert.alert('Missing Task', 'Please enter a task name.');
      return;
    }

    addTask(title.trim(), category);
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create New Task</Text>

      <Text style={styles.label}>Task Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your task..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Select Category</Text>

      <View style={styles.categoryRow}>
        {categories.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category === item && styles.selectedCategory,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>Save Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// CATEGORIES SCREEN
function CategoriesScreen({ tasks }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Task Categories</Text>

      {categories.map(category => {
        const filtered = tasks.filter(
          t => t.category === category
        );

        return (
          <View key={category} style={styles.taskCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.taskTitle}>{category}</Text>

              <Text style={styles.category}>
                {filtered.length} tasks
              </Text>

              {filtered.map(item => (
                <Text key={item.id} style={styles.categoryItem}>
                  • {item.title}
                </Text>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// COMPLETED SCREEN
function CompletedScreen({ tasks }) {
  const completed = tasks.filter(item => item.completed);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Completed Tasks</Text>

      {completed.length === 0 && (
        <Text style={styles.empty}>
          No completed tasks yet.
        </Text>
      )}

      {completed.map(item => (
        <View key={item.id} style={styles.taskCard}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.taskTitle, styles.finished]}>
              {item.title}
            </Text>

            <Text style={styles.category}>{item.category}</Text>
          </View>

          <Text style={{ color: '#16A34A' }}>✓ Done</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// MAIN APP
export default function App() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Learn React Native',
      category: 'Study',
      completed: false,
    },
    {
      id: '2',
      title: 'Complete internship work',
      category: 'Work',
      completed: false,
    },
  ]);

  function addTask(title, category) {
    const newTask = {
      id: Date.now().toString(),
      title,
      category,
      completed: false,
    };

    setTasks(previous => [newTask, ...previous]);
  }

  function completeTask(id) {
    setTasks(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  function deleteTask(id) {
    setTasks(previous =>
      previous.filter(item => item.id !== id)
    );
  }

  function updateTask(id, title, category) {
    setTasks(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, title, category }
          : item
      )
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#172554' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#F1F5F9' },
        }}
      >
        <Stack.Screen name="Home">
          {props => (
            <HomeScreen
              {...props}
              tasks={tasks}
              completeTask={completeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AddTask">
          {props => (
            <AddTaskScreen
              {...props}
              addTask={addTask}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Categories">
          {props => (
            <CategoriesScreen
              {...props}
              tasks={tasks}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Completed">
          {props => (
            <CompletedScreen
              {...props}
              tasks={tasks}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 20,
    marginBottom: 10,
  },

  subtitle: {
    color: '#64748B',
    marginBottom: 15,
  },

  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },

  summaryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 14,
  },

  number: {
    fontSize: 27,
    color: '#2563EB',
    fontWeight: 'bold',
  },

  mainButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 13,
    marginVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  taskTitle: {
    color: '#172554',
    fontSize: 15,
    fontWeight: 'bold',
  },

  category: {
    color: '#64748B',
    marginTop: 5,
    fontSize: 12,
  },

  finished: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },

  actionColumn: {
    gap: 6,
  },

  doneButton: {
    backgroundColor: '#16A34A',
    padding: 9,
    borderRadius: 7,
  },

  editButton: {
  backgroundColor: '#7C3AED',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 65,
},

  deleteButton: {
    backgroundColor: '#DC2626',
    padding: 9,
    borderRadius: 7,
  },

  label: {
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 15,
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  categoryButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },

  selectedCategory: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  categoryText: {
    color: '#334155',
  },

  selectedText: {
    color: '#FFFFFF',
  },

  categoryItem: {
    color: '#475569',
    marginTop: 8,
  },

  cancelText: {
    color: '#DC2626',
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  empty: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 25,
  },
});
