import { ReactNode } from "react";
import { Prompt, PromptFn, dispatch, useStore } from "./Store";
import { genId } from "./utils";

const createPrompt = (children: ReactNode): Prompt => {
  return {
    children,
    id: genId(),
  };
};

const Prompter = () => {
  const store = useStore();

  return store.renderStack[0]?.children;
};

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
