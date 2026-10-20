import { test } from "node:test";
import assert from "node:assert/strict";
import { addTodo, toggleTodo, removeTodo, visibleTodos, remainingCount } from "../src/todo.js";

// The five starter tasks the page ships with: ids 1-2 done, ids 3-5 active.
const todoFixture = [
  { id: 1, title: "Sign in to Orbi Cloud", done: true },
  { id: 2, title: "Connect your demo repository", done: true },
  { id: 3, title: "Ask Orbi to add Clear completed", done: false },
  { id: 4, title: "Open your delivered change", done: false },
  { id: 5, title: "Connect your own project", done: false },
];

test("addTodo appends a trimmed title with the next id", () => {
  const one = addTodo([], "  Buy milk ");
  assert.deepEqual(one, [{ id: 1, title: "Buy milk", done: false }]);
  assert.equal(addTodo(one, "Walk dog")[1].id, 2);
});

test("addTodo ignores an empty title", () => {
  assert.deepEqual(addTodo([], "   "), []);
});

test("toggleTodo flips only the matching todo", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  const toggled = toggleTodo(todos, 2);
  assert.equal(toggled[0].done, false);
  assert.equal(toggled[1].done, true);
});

test("removeTodo drops the matching todo", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  assert.deepEqual(removeTodo(todos, 1).map((t) => t.title), ["b"]);
});

test("visibleTodos filters by active and done", () => {
  const todos = toggleTodo(addTodo(addTodo([], "a"), "b"), 1);
  assert.deepEqual(visibleTodos(todos, "active").map((t) => t.title), ["b"]);
  assert.deepEqual(visibleTodos(todos, "done").map((t) => t.title), ["a"]);
  assert.equal(visibleTodos(todos, "all").length, 2);
});

test("remainingCount counts unfinished todos and ignores done ones", () => {
  const todos = toggleTodo(addTodo(addTodo(addTodo([], "a"), "b"), "c"), 2);
  assert.equal(remainingCount(todos), 2);
  assert.equal(remainingCount(todoFixture), 3);
  assert.equal(remainingCount([]), 0);
});

test("remainingCount follows add, toggle and remove", () => {
  const todos = todoFixture;
  assert.equal(remainingCount(addTodo(todos, "new")), 4);
  assert.equal(remainingCount(toggleTodo(todos, 3)), 2);
  assert.equal(remainingCount(toggleTodo(todos, 1)), 4);
  assert.equal(remainingCount(removeTodo(todos, 4)), 2);
  assert.equal(remainingCount(removeTodo(todos, 1)), 3);
  assert.equal(remainingCount(toggleTodo(toggleTodo(todos, 3), 3)), 3);
});

test("remainingCount is 0 left once every todo is done", () => {
  const allDone = todoFixture.map((t) => ({ ...t, done: true }));
  assert.equal(remainingCount(allDone), 0);
  assert.equal(remainingCount(visibleTodos(allDone, "done")), 0);
});
