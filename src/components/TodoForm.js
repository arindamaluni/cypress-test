import React from 'react'

export default props =>
  <form onSubmit={(e)=>props.handleTodoSubmit(e)}>
    <input
      type='text'
      className="new-todo"
      value={props.currentTodo}
      onChange={e=> props.handleNewToDoChanges(e)}
      autoFocus
      placeholder="What needs to be done?"/>
  </form>
