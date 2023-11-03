import { ReactNode, useEffect, useState } from "react";
import { ControlledPromise, genId, makeControlledPromise } from "./utils";

export type CallbackFn<T> = (value: T) => void;
export type RenderFn<T> = (
  callback: CallbackFn<T | null>
) => React.ReactElement;

export type Prompt = {
  children: ReactNode;
  id: string;
  resolve: CallbackFn<unknown>;
  promise: Promise<unknown>;
};

type Action =
  | {
      type: "ADD_RENDER";
      prompt: Prompt;
    }
  | {
      type: "REMOVE_RENDER";
      id: string;
    };

interface State {
  renderStack: Array<Prompt>;
}

export const createStore = () => {
  const listeners: Array<(state: State) => void> = [];

  let memoryState: State = {
    renderStack: [],
  };

  const createPrompt = (render: RenderFn<unknown>): Prompt => {
    const id = genId();

    const controlledPromise = makeControlledPromise<unknown>();
    const publicPromise = controlledPromise.promise.then((value) => value);

    const resolve = (value: unknown) => {
      controlledPromise.resolve(value);
      dispatch({ type: "REMOVE_RENDER", id });
    };

    return {
      children: render((value) => {
        resolve(value);
      }),
      id,
      resolve,
      promise: publicPromise,
    };
  };

  const reducer = (state: State, action: Action): State => {
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
            (prompt) => prompt.id !== action.id
          ),
        };
    }
  };

  const dispatch = (action: Action) => {
    memoryState = reducer(memoryState, action);

    listeners.forEach((listener) => {
      listener(memoryState);
    });
  };

  const useStore = (): State => {
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

  return {
    useStore,
    createPrompt,
    dispatch,
  };
};
