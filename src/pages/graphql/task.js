export const taskPayload = `mutation CreateTask($title: String!, $description: String!, $icon: String!, $deadline: Date!, $userId: ID!, $subtasks: [SubtaskInput], $priority: String, $checklist: [ChecklistItemInput], $important: Boolean, $status: String) {
  createTask(title: $title, description: $description, icon: $icon, deadline: $deadline, userId: $userId, subtasks: $subtasks, priority: $priority, checklist: $checklist, important: $important, status: $status) {
    id
    title
    description
    icon
    important
    priority
    status
    deadline
    reminders
    subtasks {
      title
      completed
    }
    checklist {
      item
      checked
    }
    createdAt
    updatedAt
  }
}
`;

export const queryTasks = `query Tasks($userId: String) {
  tasks(userId: $userId) {
    id
    title
    description
    icon
    important
    priority
    status
    deadline
    reminders
    user {
      id
      name
    }
    subtasks {
      title
      completed
    }
    checklist {
      item
      checked
    }
  }
}`;

export const TasksOfStatus = `query TasksOfStatus($userId: String!) {
  TasksOfStatus(userId: $userId) {
    id
    title
    description
    icon
    important
    priority
    status
    deadline
    reminders
    subtasks {
      title
      completed
    }
    checklist {
      item
      checked
    }
  }
}
`;

export const importantTasks = `query ImportantTasks($userId: String!) {
  importantTasks(userId: $userId) {
    id
    title
    description
    icon
    important
    priority
    status
    deadline
    reminders
    checklist {
      item
      checked
    }
    subtasks {
      title
      completed
    }
  }
}
`;

export const updateTask = `mutation Mutation($updateTaskId: String!, $title: String, $description: String, $icon: String, $important: Boolean, $priority: String, $status: String, $deadline: Date, $reminders: [Date], $subtasks: [SubtaskInput], $checklist: [ChecklistItemInput]) {
  updateTask(id: $updateTaskId, title: $title, description: $description, icon: $icon, important: $important, priority: $priority, status: $status, deadline: $deadline, reminders: $reminders, subtasks: $subtasks, checklist: $checklist) {
    id
    title
    description
    icon
    important
    priority
    status
    deadline
    reminders
    checklist {
      item
      checked
    }
    subtasks {
      title
      completed
    }
  }
}`;

export const deleteTassk = `mutation DeleteTask($deleteTaskId: String!) {
  deleteTask(id: $deleteTaskId)
}`;

export const importantQuery = `mutation IsImportantTask($isImportantTaskId: String!) {
  isImportantTask(id: $isImportantTaskId)
}`;

export const completedTask = `query TasksOfStatus($userId: String!, $status: String) {
  TasksOfStatus(userId: $userId, status: $status) {
    id
    title
    description
    icon
    important
    priority
    status
    deadline
    reminders
    subtasks {
      title
      completed
    }
    checklist {
      item
      checked
    }
  }
}`;

export const updateTaskStatusQuery = `mutation Mutation($updateStatusId: String!, $status: String!) {
  updateStatus(id: $updateStatusId, status: $status)
}
`;

export const DEADLINE_REMINDER_SUBSCRIPTION = `subscription Subscription($userId: String!) {
  deadlineReminder(userId: $userId) {
    task {
      id
      title
      description
      icon
      important
      priority
      status
      deadline
      reminders
    }
    message
  }
}
`;

export const queryLstNoti = `query Notifications($userId: String!) {
  notifications(userId: $userId) {
    content
    userId
    taskId
  }
}
`;
