import { useEffect, useState } from "react";
/** @jsxImportSource react */
import {Input, TextField, useAuthenticator} from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: todo });
    setTodo("");
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>My todos</h1>
      <TextField
        isRequired
        placeholder="What are you going to do today?"
        id="todo"
        name="todo"
        onChange={(e) => {
          setTodo(e.currentTarget.value);
        }}
        value={todo}
        variation="quiet"
        onKeyUp={(e) => {
            if (e.key === "Enter") {
                createTodo()
                setTodo("");
            }
        }}
        data-testid="todo-input"
        style={{border: "1px solid black", borderRadius: "8px", marginBottom: "4px", backgroundColor: "white"}}
      />
      <button onClick={createTodo}>Add</button>
      {todos.length == 0
          ? <p><i>Add your todos</i></p>
          : <ul data-testid="todos-count">
              {todos.map((todo, i) => (
                  <li
                      onClick={() => deleteTodo(todo.id)}
                      data-testid={`todo-${i}`}
                      key={todo.id}
                  >
                      {i+1}) {todo.content}
                  </li>
              ))}
          </ul>}
      <div>
        🥳 App successfully hosted. Try creating a new todo.
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
