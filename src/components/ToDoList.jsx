import React, { useState, useEffect } from "react";

let URL = "http://localhost:5000/todos"

function todoComponent() {
  const [currentTodo, setCurrentTodo] = useState("");
  const [todos, setTodo] = useState([]);

  useEffect(() => {
    fetch(`${URL}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setTodo(data)
      });
  }, [])


  function createNewTodo() {
    fetch(`${URL}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item: currentTodo
      })
    })
      .then(response => response.json())
      .then(data => {
        let todoArray = [...todos];
        todoArray.push(data);
        setTodo(todoArray);
      })
  }

  function completeTodo(id) {
    const changedItem = todos.find((todo) => todo.id === id);
    fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isComplete: !changedItem.isComplete
      })
    })
      .then(response => response.json())
      .then(data => {
        let todoArray = [...todos];
        const index = todoArray.findIndex((todo) => todo.id === id)
        todoArray[index] = data;
        setTodo(todoArray);
      })
  }

  function deleteTodo(id) {
    fetch(`${URL}/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          const index = todos.findIndex((todo) => todo.id === id);
          if (index > -1) {
            let todoArray = [...todos];
            todoArray.splice(index, 1);
            setTodo(todoArray);
          }
        }
      })
      .catch(err => console.error(err));
  }

  const todosLeft = todos.filter(todo => !todo.isComplete);

  return (
    <div className="list">
      <section className="top">
        <input
          className="inputField"
          value={currentTodo}
          onChange={e => {
            setCurrentTodo(e.target.value);
          }}
          onKeyPress={e => {
            if (e.key === "Enter") {
              createNewTodo(currentTodo);
              setCurrentTodo("");
            }
          }}
          placeholder="ATT-GÖRA LISTA" />
        <button className="add" onClick={() =>
          createNewTodo(currentTodo) & setCurrentTodo("")}>
          +
        </button>
      </section>
      <div className="message">
        {todos.length === 0 && "Din lista är tom - skriv in en aktivitet i rubriken ovan"}
        {todos.length > 0 && todosLeft.length === 0 && `Nu är du färdig med alla saker!`}
        {todosLeft.length > 0 && `Du har ${todosLeft.length} ${todosLeft.length === 1 ? "sak" : "saker"} kvar på listan att göra`}
      </div>
      {todos.map((todo, index) => (
        <div key={todo.id} className="setTodo">
          <button className="checkbox" onClick={() => completeTodo(todo.id)}>
            {todo.isComplete && "✔"}
          </button>
          <div className={todo.isComplete ? "done" : ""}>{`${index + 1}: ${todo.item}`}
          </div>
          <button className="delete" onClick={() => deleteTodo(todo.id)}>
            ⛔
          </button>
        </div>
      ))}
    </div>
  );
}

export default todoComponent;