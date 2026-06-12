import React, { useEffect, useState } from "react";

const TodoList = () => {

    const username = "SergiVG";
    const urlAPI = `https://playground.4geeks.com/todo/todos/${username}`;

    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = () => {
        fetch(`https://playground.4geeks.com/todo/users/${username}`)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Error getting tasks.");
                }
                return resp.json();
            })
            .then((data) => {
                setTasks(data.todos || []);
            })
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (inputValue.trim() !== "") {
                const newTask = {
                    label: inputValue.trim(),
                    is_done: false
                };

                fetch(urlAPI, {
                    method: "POST",
                    body: JSON.stringify(newTask),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then((resp) => {
                        if (!resp.ok) throw new Error("Error adding new task.");
                        return resp.json();
                    })
                    .then((newTaskAdded) => {
                        setTasks([...tasks, newTaskAdded]);
                        setInputValue("");
                    })
            } else {
                alert("Invalid task.");
            }
        }
    };

    const deleteTask = (idToDelete) => {
        fetch(`https://playground.4geeks.com/todo/todos/${idToDelete}`, { method: "DELETE" })
            .then((resp) => {
                if (!resp.ok)
                    throw new Error("Error deleting task.");

                const updatedTasks = tasks.filter((task) => task.id !== idToDelete);
                setTasks(updatedTasks);
            })
    };

    const deleteAllTasks = () => {
        tasks.forEach(task => {
            const taskID = task.id;
            fetch(`https://playground.4geeks.com/todo/todos/${taskID}`, { method: "DELETE" })
                .then((resp) => {
                    if (!resp.ok)
                        throw new Error("Error deleting task.");
                })
        });

        setTasks("");
    };

    return (
        <div className="todo-wrapper d-flex flex-column align-items-center w-100 min-vh-100 py-5">
            <h1 className="todo-title display-1 text-center mb-4">todos</h1>

            <div className="todo-box shadow rounded-0 bg-white">
                <div className="todo-input-wrapper border-bottom p-3">
                    <input
                        type="text"
                        className="form-control border-0 shadow-none fs-4 fw-light p-0 ps-3"
                        placeholder="What needs to be done?"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown} />
                </div>

                <ul className="list-unstyled mb-0">
                    {tasks.length === 0 ? (
                        <li className="todo-item border-bottom p-3 text-muted fs-4 fw-light italic-text ps-4">No tasks, add tasks</li>
                    ) : (
                        tasks.map((task) => (
                            <li key={task.id} className="todo-item border-bottom p-3 d-flex justify-content-between align-items-center fs-4 fw-light ps-4">
                                <span>{task.label}</span>
                                <button onClick={() => deleteTask(task.id)} className="btn border-0 p-0 text-danger delete-btn me-2 fs-5">✕</button>
                            </li>
                        ))
                    )}
                </ul>
                <button type="button" className="btn btn-danger m-3" onClick={deleteAllTasks}>Delete Tasks</button>
                <div className="todo-footer p-2 px-3 text-muted fw-light border-top-0">
                    <small> {tasks.length} {tasks.length === 1 ? "item" : "items"} left</small>
                </div>
            </div>

            <div className="todo-shadow-stack w-100 d-flex flex-column align-items-center">
                <div className="stack-layer-1 bg-white shadow-sm border"></div>
                <div className="stack-layer-2 bg-white shadow-sm border"></div>
            </div>
        </div>
    );
};

export default TodoList;