# react-promptify

`window.prompt` replacement for React. Render any prompt, return any value, right where you need it.

## Features

- Render custom prompts, return any value
- Just like `window.prompt`, the modal state is managed for you
- Full TypeScript support
- 0.5kb minified and gzipped
- Platform agnostic
- Zero dependencies

## Installation

```sh
yarn add react-promptify
```

## Quick start

```tsx
import { useState } from "react";
import { Prompter, prompt } from "../lib/main";

// Create a custom prompt function. We can call this anywhere in our app.
const promptEmail = () =>
  prompt<boolean>((done) => (
    <div>
      <button onClick={() => done(true)}>Yes</button>
      <button onClick={() => done(false)}>No</button>
    </div>
  ));

function App() {
  const [allowed, setAllowed] = useState(false);

  return (
    <div>
      {/* Where the prompt will be rendered. */}
      <Prompter>
        {/* You can bring your own modal. The prompt and the open state are managed for you. */}
        {({ children, open }) => <SomeModal open={open}>{children}</SomeModal>}
      </Prompter>

      <p>Marketing Emails Allowed: {allowed ? "Yes" : "No"}</p>
      <button onClick={() => setAllowed(await promptEmail())}>
        Update Details
      </button>
    </div>
  );
}
```

## Why?

Ever noticed that whenever you just need to get a simple value from the user, you have to add a bunch of boilerplate to your app? You have to create a modal component, manage the open state in the parent component (open state + onClose handler), add the modal to the component tree, pass in a handler for the data, then when you need the data, open the modal, wait for the user to enter the data, and then handle the data. Aside from the added complexity, it creates a lot of distance between where you need the data and where you handle it.

With promptify, you define _once_ where and how you want to render modals, and call the `prompt()` function anywhere in your app to render a modal and get the data you need, _where_ you need it. The modal state is managed for you, you can render any content, and you can return any value you want.

## API

### `Prompter`

The component that renders the prompt. You can place it wherever you want the prompt to appear.

**Props**

- `children({children, open})`: A render function that takes children and open prop and returns a modal element.
  - `children: ReactNode`: The prompt contents to render.
  - `open`: A boolean indicating whether the modal should be open or closed.

**Returns**

The modal element to render.

**Example**

```tsx
<Prompter>
  {({ children, open }) => <SomeModal open={open}>{children}</SomeModal>}
</Prompter>
```

### `prompt(render)`

A function you call to prompt the user. It works similarly to `window.prompt`, except it is asynchronous and you can render whatever you want.

**Parameters**

- `render: (done) => ReactNode`: A render function that takes a `done` function and returns the prompt contents to render. The `done` function takes the data to return as an argument.

**Returns**

A promise that resolves to the value the done function was called with.

**Example**

```tsx
const answer = await prompt((done) => (
  <div>
    <button onClick={() => done("yes")}>Yes</button>
    <button onClick={() => done("no")}>No</button>
  </div>
));
```

## Caveats

Do not use hooks inside the `render` function. This will cause undefined behavior. If you need to use hooks, create a separate component and render that instead.

**Bad**

```tsx
const answer = await prompt((done) => {
  const [value, setValue] = useState("");
  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => done(value)}>Submit</button>
    </div>
  );
});
```

**Good**

```tsx
const answer = await prompt((done) => <Prompt done={done} />);

function Prompt({ done }: { done: CallbackFn<string> }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => done(value)}>Submit</button>
    </div>
  );
}
```

## Acknowledgements

- [@timolins/react-hot-toast](https://github.com/timolins/react-hot-toast)
