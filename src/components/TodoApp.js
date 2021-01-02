import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { destroyToDo, loadTodos, saveTodo, updateTodo } from '../lib/service'
import { filterTodos } from '../lib/utils'
import Footer from './Footer'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
export default class TodoApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTodo : '',
      todos: []
    };
    this.handleNewToDoChanges = this.handleNewToDoChanges.bind(this);
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    loadTodos().then(({data}) => {
      this.setState({todos: data});
    })
    .catch(err => this.setState({error: err}))
  }

  handleNewToDoChanges(e) {
    this.setState({currentTodo: e.target.value});
  }

  handleTodoSubmit(e) {
    e.preventDefault();
    const newTodo = {name:this.state.currentTodo, isComplete: false};
    saveTodo(newTodo)
      .then (({data}) => {
        this.setState({
          todos: this.state.todos.concat(data),
          currentTodo: ''
        })
      })
      .catch((err) => this.setState({error: true}))
  }

  handleDelete(id) {
    destroyToDo(id)
      .then(() => {this.setState({todos: this.state.todos.filter(todo =>todo.id !== id)})})
  }

  handleToggle(id) {
    const targetTodo = this.state.todos.filter(todo =>todo.id === id);
    const updated = {...targetTodo[0], isComplete : !targetTodo[0].isComplete};
    console.log('HandleToggle:', updated)
    updateTodo(updated)
      .then(({data}) => {
        this.setState({
        todos: this.state.todos.map(
          t =>t.id === id? data: t
          )
        })
      })
    
  }

  render () {
    const remaining = this.state.todos.filter((todo) =>!todo.isComplete).length
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error?<span className='error'>Oh no!</span>:null}
            <TodoForm 
              currentTodo = {this.state.currentTodo}
              handleNewToDoChanges = {this.handleNewToDoChanges}
              handleTodoSubmit = {this.handleTodoSubmit}
            />
          </header>
          <section className="main">
            <Route path='/:filter?' render={({match}) =>
              <TodoList 
                todos={filterTodos(match.params.filter, this.state.todos)} 
                handleDelete={this.handleDelete} 
                handleToggle={this.handleToggle}
              />
              } />
          </section>
          <Footer remaining={remaining}/>
        </div>
      </Router>
    )
  }
}
