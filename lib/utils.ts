export const genId = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

export interface ControlledPromise<PromiseType> {
  resolve: (d: PromiseType) => void;
  reject: (d: unknown) => void;
  promise: Promise<PromiseType>;
  status: "pending" | "resolved" | "rejected";
}

export function makeControlledPromise<
  PromiseType
>(): ControlledPromise<PromiseType> {
  let resolve: (d: PromiseType) => void;
  let reject: (d: unknown) => void;
  const promise = new Promise<PromiseType>((rs, rj) => {
    resolve = (v) => {
      rs(v);
      controlledPromise.status = "resolved";
    };
    reject = (v) => {
      rj(v);
      controlledPromise.status = "rejected";
    };
  });

  const controlledPromise: ControlledPromise<PromiseType> = {
    resolve: resolve!,
    reject: reject!,
    promise,
    status: "pending",
  };
  return controlledPromise;
}
