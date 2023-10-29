import { ReactNode } from "react";
import { Prompt, PromptFn, dispatch, useStore } from "./Store";
import { genId } from "./utils";

const createPrompt = (children: ReactNode): Prompt => {
  return {
    children,
    id: genId(),
  };
};

/**
 * The component that renders the prompt. Place it wherever you want the prompt to appear.
 */
const Prompter = () => {
  const store = useStore();

  return store.renderStack[0]?.children;
};

/**
 * The function that you call to prompt the user. It works the same way as `window.prompt`,
 * except it is asynchronous and you can render whatever you want.
 *
 * @param render A function that takes a `done` function and returns a React element.
 * @returns A promise that resolves to the value the `done` function was called with.
 */
const prompt: PromptFn = (render) => {
  return new Promise((resolve) => {
    const prompt = createPrompt(
      render((value) => {
        resolve(value);
        dispatch({ type: "REMOVE_RENDER", prompt });
      })
    );

    dispatch({
      type: "ADD_RENDER",
      prompt,
    });
  });
};

export { Prompter, prompt };
