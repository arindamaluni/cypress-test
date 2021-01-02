export const filterTodos = (filter, todos) => 
  filter? todos.filter(t=>t.isComplete === (filter === 'completed')) : todos
