# baitshop

[![npm](https://img.shields.io/npm/v/baitshop)](https://npmjs.com/package/baitshop)
[![npm](https://img.shields.io/github/size/aarongoin/baitshop/dist/index.esm.js)](https://npm.com/baitshop)
[![license](https://img.shields.io/github/license/aarongoin/baitshop)](https://github.com/aarongoin/baitshop/blob/master/LICENSE)

[![build status](https://img.shields.io/github/workflow/status/aarongoin/baitshop/tests)](https://github.com/aarongoin/baitshop/actions)
[![issues](https://img.shields.io/github/issues/aarongoin/baitshop)](https://github.com/aarongoin/baitshop/issues)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

#

Write your React hooks as JavaScript classes.

"Say what????"

I know. Sounds nuts, but hear me out. Hooks can be a little surprising with their sharp pointy edges. Maybe you've been bitten by weird synchronization issues with props and stale state. Or maybe the scoping has bitten you. Or maybe you miss the more readable class lifecycle api. Maybe you don't like scrolling to the bottom of your effects to know when they run. And sweet merciful mother all that memoization madness!

If any of this rings true with you, then give baitshop a try! For all their edges and gotchas hooks are fantastic for composing behavior in your components. But just because you use hooks to compose behavior doesn't mean you need to use them directly.

Here's what using baitshop looks like when creating a basic fetch hook in JavaScript:

```javascript
import { Hook, createHook } from "baitshop"

class Fetcher extends Hook {
  getInitialState() {
    return {
      stage: "loading",
      response: null,
      error: null,
    }
  }
  onChange() {
    this.doFetch();
  }
  doFetch() {
    const { url } = this.props;
    this.setState({ stage: "loading", response: null, error: null });
    fetch(url)
      .then((response, error) => {
        // prevent setting state if the url has changed!
        if (url != this.props.url) return;
        if (error) this.setState({ stage: "error", response: null, error });
        else this.setState({ stage: "ready", response, error: null });
      });
  }
}

const useFetcher = createHook(Fetcher);

function CuteDoggo({ id }) {
  const { stage, response, error } = useFetcher({ url: `/pics/of/dogs/${id}` });

  ...
}
```

Naturally there's a great deal more you can do with baitshop. And if you prefer using TypeScript, then you're in luck as baitshop is written and fully typed with TypeScript!

---

## Table of Contents

1. [Getting Started](#Getting-Started)
2. [Documentation](#Documentation)
   - [API](#API)
   - [Hook Lifecycle](#Hook-Lifecycle)
3. [Recipes](#Recipes)
4. [Contributing](#Contributing)
5. [FAQ](#FAQ)
6. [License](#License)

---

## Getting Started

Follow these instructions to get baitshop setup in your project. And then scroll on down to the documentation to get a run down on baitshops API and some nifty examples to set you off.

#

### Prerequisites

First of all, baitshop is written with React Hooks and that's it. So react is a peer dependency that you'll need to use baitshop. Or if you're a particularly preact-y that's cool too.

#

### Installing

First you'll need to install baitshop with npm:

```
npm install baitshop
```

Or if you prefer yarn:

```
yarn install baitshop
```

That's it. Nice work! ✋You've successfully installed baitshop.

---

## Documentation

**⚠️ Note:** baitshop is written in TypeScript, and though we distrubute a normal javascript module, you will see TypeScript types throughout the docs. If you're not familiar with TypeScript, check out the [TypeScript Docs](https://www.typescriptlang.org/docs/home.html) for more information.

### API

The core export is the `Hook` class which all your baitshop hooks should extend.

In addition, there are two hook creation functions: `createHook()` and `createSharedHook()`. You will use one or both of these to create hooks which will use your custom Hooks.

---

#### Hook class

The Hook is the core class you should extend and it forms the scaffolding from which you can create any kind of hook you want. You can think of it like a mini class-based component that doesn't render anything and can be composed in parallel to other Hooks. Like in React components: Hooks have props, state, and various lifecycle methods.

Hooks use TypeScript generics to allow you to type out your props (P), state (S), and actions (A). All the generics are optional though and default to an empty object.

#

#### Hook class members:

#

##### props

##### `props: P`

Props are the external inputs to your Hook and are like React props in that they're an object, and changes to them can be "listened" for and can trigger internal changes.

**⚠️ Note:** It's best not to mutate props directly in your hook.

#

##### state

##### `state: S`

State in the Hook class works very much like state in React.Component. It's an object, and setting state merges your updates into the existing state rather than overwrite it completely.

**⚠️ Note:** It's best not to mutate state directly in your hook.

#

##### bait

##### `bait: A & S`

Generally `this.bait` is for consumers of your Hook, and is not really needed inside the Hook instance. Your Hook's `state` and `actions` are merged together into a single object which is returned from your hook function. More broadly: your bait is the public api for your hook.

#

#### Hook class methods:

#

##### update

##### `update(): void`

The update method is much like React's forceUpdate in that it will trigger a rerender of the component, but it is different in that it does not trigger any methods directly in the Hook but instead triggers the external/downstream components to update. This method is called automatically anytime you set the state of the Hook using `setState`.

#

##### setState

##### `setState(update: Partial<S>): void`

This method works just like React's setState except that it does not accept a functional setter. But it does merge the update into the existing state using the spread operator.

#

##### getInitialState

##### `getInitialState(): S`

This method is only called once during the initialization phase of the Hook lifecycle and should return an object that contains the Hooks initial state. If this method is not defined, `state` will default to an empty object.

#

##### getActions

##### `getActions(): A`

This method lets you define the external, functional api for your Hook. It is called only _once_ during the initialization phase of the Hook lifecycle, and should return an object who's keys map to functions (either defined on the Hook itself or arrow functions). Baitshop does **not** auto-bind these actions for you, so it's up to you to ensure your action's have the appropriate `this` binding.

#

##### onMount

##### `onMount(): void`

If you need to hook into the component onMount event, then this method is the place to do it. If your Hook will do things reliant on the changing value of props, you should use the `onChange` method instead. Otherwise if you call a function in your `onMount`, and then call that same function in your `onChange` then it will result in that function being called twice during the initialization phase which is probably not what you want.

#

##### onUnmount

##### `onUnmount(): void`

The `onUnmount` method is your cleanup method which will be called once when the component the Hook is in unmounts. Note that prior to calling `onUnmount`, both the `update` and `setState` methods become noops that will do nothing when called so you don't have to worry about asynchronously calling setState on an unmounted component.

#

##### onRender

##### `onRender(): void`

This method is called unconditionally every update time the parent component renders. This means if you're composing with other React hooks or even other baitshop Hooks: you'll need to call them inside this method to avoid breaking the rule of hooks and causing bugs in your app.

**⚠️ Note:** If you're using the `react-hooks/rules-of-hooks` eslint rule: consider using the baitshop version [eslint-plugin-baitshop-hooks](https://github.com/aarongoin/eslint-plugin-baitshop-hooks) instead. React's `rules-of-hooks` rule does not account for hooks written as classes and will error should you use a hook in the onRender method. The baitshop version of the rule lints for all the same rules of hooks and is mostly a copy of react's with a few necessary tweaks.

#

##### onChange

##### `onChange(prevProps: P): void`

This method is called during any render in which the `didPropsChange` method call returns true. If you haven't changed the default `didPropsChange` then this method will be called during the initialization phase of the hook and it's prevProps will be an empty object.

#

##### didPropsChange

##### `didPropsChange(prevProps: P): boolean`

This method is used to determine if the props have changed since the last time the Hook was rendered. By default this method performs a shallow comparison between the old and new props, but can be overriden to support other strategies. This method is called in every render pass, including the initialization phase of the hook.

#

##### didStateChange

##### `didStateChange(update: S): boolean`

This is the method baitshop uses to determine if an a call to `setState(update)` is actually changing the state or not. By default this method performs a shallow comparison between the update and the existing state using the keys being updated, but can be overriden to support other strategies. This method is called anytime `setState` is called.

---

#### Hook-creating functions:

#

#### createHook

#### `createHook(hookClass: Hook): useHookFn`

The createHook function is how you take a Hook class and create a function that can be used as a hook in your components.

#

#### createSharedHook

#### `createSharedHook(hookClass: Hook): [ SharedHookProvider, useSharedHook ]`

The createSharedHook function works just like how it says. It returns an array with the first element as a React context provider for you to mount anywhere in your component tree, and the second as a hook for your use in any descendant node under the context provider. Each instance of the useSharedHook will then return the `bait` object of the shared Hook class instance. Any props you want to use in the shared Hook must be passed into the `SharedHookProvider`, as props passed into the `useSharedHook` call will be ignored.

---

### Hook Lifecycle

#### Instantiation

1. set [`this.props`](#props)

2. call [`getInitialState()`](#getInitialState)

3. set [`this.state`](#state)

4. call [`getActions()`](#getActions)

5. set [`this.bait`](#bait)

6. your contructor body runs

7. call [`onMount()`](#onMount)

8. call [`didPropsChange(prevProps)`](#didPropsChange)

   - call [`onChange(prevProps)`](#onChange)

9. call [`onRender()`](#onRender)

#### Post-instantiation renders

1. set [`this.props`](#props)

2. call [`didPropsChange(prevProps)`](#didPropsChange)

   - call [`onChange(prevProps)`](#onChange)

3. call [`onRender()`](#onRender)

#### Cleanup

1. change [`update()`](#update) to a noop

2. call [`onUnmount()`](#onRender)

#### When setState() is triggered:

1. [`didStateChange(update)`](#didStateChange)

   - set [`this.state`](#state)

   - set [`this.bait`](#bait)

   - call [`update()`](#update)

---

## Recipes

Here are some "recipes" to help you customize your hook to get the behavior you want.

#### Hook that never updates from props:

```typescript
class Custom extends Hook<P, S, A> {
  didPropsChange(): boolean {
    return false;
  }
}
```

#

#### Hook that does something every render:

```Typescript
class Custom extends Hook<P, S, A> {

  onRender(): void { ... }

}
```

#

#### Hook with initialized state:

```Typescript
class Custom extends Hook<P, S, A> {

  getInitialState(): S {
    return {
      yourState: "here"
      somethingElse: this.props.bar;
    }
  }

}
```

#

#### Hook with no state:

```Typescript
class Custom extends Hook<P, S, A> {
  // you don't have to do anything!
}
```

#

#### Hook with callbacks/actions:

```Typescript
class Custom extends Hook<P, S, A> {

  getActions(): A {
    return {
      doAThing: this.customAction,
      anotherAction: this.anotherAction,
    };
  }

  customAction(...args) { ... }

  anotherAction() { ... }

}
```

#

#### Hook that only updates on mount or unmount:

```Typescript
class Custom extends Hook<P, S, A> {

  onMount(): void { ... }

  onUnmount(): void { ... }

}
```

#

#### Hook that only updates when any props change:

```Typescript
class Custom extends Hook<P, S, A> {

  onChange(prevProps: P): void { ... }

}
```

#

#### Hook that only updates when certain props change:

```Typescript
class Custom extends Hook<P, S, A> {

  didPropsChange(prevProps: P): boolean {
    return this.props.user.id !== prevProps.user.id;
  }

  onChange(prevProps: P): void { ... }

}
```

#

#### Hook that uses other hooks:

```Typescript
class Custom extends Hook<P, S, A> {

  onRender(): void {
    const a = useSomeHookYouDontWantToRewrite();
    const b = useAnotherBaitshopHookEven();
    // remember that all the rules of hooks still apply here
  }

}
```

---

## Contributing

Contributers are welcome. If you see something that could be fixed or improved then please open an issue for it.

---

## FAQ

#### Why the name "baitshop"?

Oh, I'm so glad you asked. Because a baitshop is a hooks store...

---

## License

BSD 3-Clause License

Copyright (c) 2020 Aaron Goin, All rights reserved.
