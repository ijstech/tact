# Tact Language Compiler

<img src="https://raw.githubusercontent.com/tact-lang/tact-docs/main/public/banner.jpeg">

A next-gen smart contract language for TON focused on efficiency and simplicity.

- [Changelog](./CHANGELOG.md)
- [How to contribute to Tact development](./CONTRIBUTING.md)
- [Roadmap](./ROADMAP.md)
- [Examples](./examples/)

## Key Resources

- [Tact By Example](https://tact-by-example.org/00-hello-world)
- [Tact Documentation](https://docs.tact-lang.org)
- [Awesome Tact](https://github.com/tact-lang/awesome-tact)

## Community

- [Tact Discussion Group](https://t.me/tactlang)
- [Tact Updates Channel](https://t.me/tact_kitchen)

TACT doesn't have development environment dependencies and has everything built in. TACT's stdlib also distributed together with a compiler.

For Visual Studio Code syntax support, please download the [Tact extension](https://marketplace.visualstudio.com/items?itemName=KonVik.tact-lang-vscode).

## Setup and Installation

To get started, follow these steps:

### 1: Install the required packages using the following command:

```bash
docker-compose up install
```

### 2: Build and bundle the library using the following command:

Before building the library, you need to update the `multiformats` types in `node_modules/multiformats/types/src/cid.d.ts` file.

```bash
export type MultibaseEncoder<Prefix extends string> = import('./bases/interface').MultibaseEncoder<Prefix>;
export type MultibaseDecoder<Prefix extends string> = import('./bases/interface').MultibaseDecoder<Prefix>;
```

This command will generate a `bundle` folder with all the necessary files to use on @ijstech/compiler.

```bash
docker-compose up bundle
```

## 10 Commandments of Tact

We have formed a large-scale vision for the philosophy of Tact to make sure that community has something to refer to.

1. ### Familiar syntax

   Tact features modern post-C syntax familiar to developers who know TypeScript, Swift, Kotlin and Rust.

2. ### First-class data structures

   Tact makes it easy to declare, decode and encode data structures according to their TL-B schemas.

3. ### Safe contract interfaces and ABI

   Tact offers strong compile-time checks for contract interfaces, typed addresses and lets you describe messages natively in a subset of TL-B.

4. ### Message dispatch

   Tact offers a convenient yet flexible way to declare, receive and send messages between contracts.

5. ### Plaintext commands

   Tact offers an innovative way for securely sending commands to the contracts by the users using plaintext commands that are parsed on-chain.

6. ### Composition of contracts

   Tact offers traits to extract commonly used behaviors into reusable and verified components.

7. ### Statically bounded iterators

   Tact offers convenient iterators and arrays are bounded and do not hurt scalability of the contracts.

8. ### Batteries-included standard library

   Tact comes with a rich standard library that offers data handling functions and standardized behaviors.

9. ### Interactive

   Tact comes with a live playground, explorer and easy to use deployment tools.

10. ### Verifiable

    Tact produces deterministic builds. Compiler helps analyze gas usage and storage costs.

## License

MIT
