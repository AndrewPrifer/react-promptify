import { useState } from "react";
import { createPrompter } from "../lib/main";

const { Prompter, prompt } = createPrompter();

export function App() {
  return (
    <div>
      <Prompter>
        {({ children, open, cancel }) =>
          open ? (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                border: "1px solid black",
                padding: "1rem",
              }}
            >
              {children}
              <button onClick={cancel}>Cancel</button>
            </div>
          ) : null
        }
      </Prompter>
      <Example />
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

const promptEmail = () =>
  prompt<{
    email: string;
    marketing: boolean;
  }>((done) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        done({
          email: formData.get("email") as string,
          marketing: formData.get("marketing") === "on",
        });
      }}
    >
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <br />
      <label>
        Allow marketing emails:
        <input type="checkbox" name="marketing" />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  ));

const Example = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    marketing: false,
  });

  async function updateUserDetails() {
    setUserInfo((await promptEmail()) ?? userInfo);
  }

  return (
    <div>
      <p>Email: {userInfo.email}</p>
      <p>Marketing Emails Allowed: {userInfo.marketing ? "Yes" : "No"}</p>
      <button onClick={updateUserDetails}>Update Details</button>
    </div>
  );
};
