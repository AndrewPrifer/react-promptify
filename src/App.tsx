import { useState } from "react";
import { Prompter, prompt } from "../lib/main";

export function App() {
  return (
    <div>
      <Prompter />
      <MyComponent />
      <MyOtherComponent />
    </div>
  );
}

const MyComponent = () => {
  const handleClick = async () => {
    const value = await prompt((done) => {
      return (
        <div>
          <button onClick={() => done("yes")}>Yes</button>
          <button onClick={() => done("no")}>No</button>
        </div>
      );
    });

    console.log(value);
  };

  return <button onClick={handleClick}>Click me</button>;
};

const Form = ({ done }: { done: (value: string) => void }) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={() => done(value)}>Submit</button>
    </div>
  );
};

const MyOtherComponent = () => {
  const handleClick = async () => {
    const value = await prompt((done) => {
      return (
        <div>
          <Form done={done} />
        </div>
      );
    });

    console.log(value);
  };

  return <button onClick={handleClick}>Click me</button>;
};
