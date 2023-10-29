import { ReactNode, useEffect, useState } from "react";
import { genId } from "./utils";

export type CallbackFn<T> = (value: T) => void;
export type RenderFn<T> = (callback: CallbackFn<T>) => React.ReactElement;
export type PromptFn = <T>(fn: RenderFn<T>) => Promise<T>;

export type Prompt = {
  children: ReactNode;
  id: string;
};

type Action =
  | {
      type: "ADD_RENDER";
      prompt: Prompt;
    }
  | {
      type: "REMOVE_RENDER";
      prompt: Prompt;
    };

interface State {
  renderStack: Array<Prompt>;
}

const listeners: Array<(state: State) => void> = [];

let memoryState: State = {
  renderStack: [],
};

export const createPrompt = (children: ReactNode): Prompt => {
  return {
    children,
    id: genId(),
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_RENDER":
      return {
        ...state,
        renderStack: [action.prompt, ...state.renderStack],
      };

    case "REMOVE_RENDER":
      return {
        ...state,
        renderStack: state.renderStack.filter(
          (prompt) => prompt.id !== action.prompt.id
        ),
      };
  }
};

export const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);

  listeners.forEach((listener) => {
    listener(memoryState);
  });
};

export const useStore = (): State => {
  const [state, setState] = useState<State>(memoryState);
  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return state;
};
