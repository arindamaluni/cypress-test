describe('Smoke tests', ()=>{
  beforeEach(()=>{
    cy.request('GET', '/api/todos')
      .its('body')
      .each(todo => cy.request('DELETE', `/api/todos/${todo.id}`))
  })

  context('No todos', ()=>{
    it('Save new todos', ()=>{
      const todos = [{text:"Buy Milk", expectedLength:1}, 
        {text:"Buy Egg", expectedLength:2}, 
        {text:"Buy Bread", expectedLength:3}]
      cy.visit('/');
      //Set up wait for the post req to complete
      cy.server();
      cy.route('POST', '/api/todos')
        .as('create');

      cy.wrap(todos)
        .each(item=>{
          cy.focused()
            .type(item.text)
            .type('{enter}');
          
          //wait for POST to complete
          cy.wait('@create')
    
          cy.get('.todo-list li')
            .should('have.length', item.expectedLength)
        })
    })
  })

  context('With active todos', ()=>{
    beforeEach(()=>{
      cy.fixture('todos')
        .each(item => {
          const newTodo = Cypress._.merge(item, {isComplete:false});
          cy.request('POST', '/api/todos', newTodo)
        })
      cy.visit('/')
    })

    it('Only have data for the fixture', ()=>{
      cy.get('.todo-list li')
        .should('have.length', 4)
    })

    it.only('Toggles todos', ()=>{
      cy.server();
      cy.route('PUT', '/api/todos/*')
        .as('toggle');
      
      const clickAndWait = ($el=>{
        cy.wrap($el)
        .as('item')
        .find('.toggle')
        .click()
        cy.wait('@toggle')
      })

      cy.get('.todo-list li')
        .each($el=> {
          clickAndWait($el)
          cy.get('@item')
            .should('have.class', 'completed')
        })
        .each($el=> {
          clickAndWait($el)
          cy.get('@item')
            .should('not.have.class', 'completed')
        })
    })

    it('Deletes todos', ()=>{
      cy.server();
      cy.route('DELETE', '/api/todos/*')
        .as('delete');
      
      cy.get('.todo-list li')
        .each($el=> {
          cy.wrap($el)
            .find('.destroy')
            .invoke('show')
            .click();

          cy.wait('@delete')
        })
        .should('not.exist')
    })
  })

})