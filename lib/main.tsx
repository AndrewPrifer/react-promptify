"use client";

import { FC, ReactNode } from "react";
import {
  createPrompt,
  dispatch,
  useStore,
  CallbackFn,
  RenderFn,
} from "./Store";

interface PrompterProps {
  /**
   * A function that takes a `children` and `open` prop and returns a React element.
   * @returns
   */
  children: ({
    children,
    open,
  }: {
    children: ReactNode;
    open: boolean;
    cancel: () => void;
  }) => ReactNode;
}

/**
 * The component that renders the prompt. Place it wherever you want the prompt to appear.
 */
const Prompter: FC<PrompterProps> = ({ children }) => {
  const store = useStore();
  const prompt = store.renderStack[0];

  return children({
    children: prompt?.children,
    open: store.renderStack.length > 0,
    cancel: () => {
      prompt?.resolve(null);
    },
  });
};

/**
 * The function that you call to prompt the user. It works the same way as `window.prompt`,
 * except it is asynchronous and you can render whatever you want.
 *
 * @param render A function that takes a `done` function and returns a React element.
 * @returns A promise that resolves to the value the `done` function was called with.
 */
const prompt = <T,>(render: RenderFn<T>): Promise<T | null> => {
  const prompt = createPrompt(render);
  dispatch({ type: "ADD_RENDER", prompt });
  return prompt.promise as Promise<T>;
};

export { Prompter, prompt };
export type { PrompterProps, CallbackFn, RenderFn };
