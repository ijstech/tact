#!/usr/bin/env node

const pkg = require("../package.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const main = require("../dist/node.js");
const meowModule = import("meow");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execFileSync } = require("child_process");

void meowModule.then(
    /** @param meow {import('meow/build/index')} */
    (meow) => {
        const cli = meow.default(
            `
    Usage
      $ tact [...flags] (--config CONFIG | FILE)

    Flags
      -c, --config CONFIG         Specify path to config file (tact.config.json)
      -p, --project ...names      Build only the specified project name(s) from the config file
      -q, --quiet                 Suppress compiler log output
      --with-decompilation        Full compilation followed by decompilation of produced binary code
      --func                      Output intermediate FunC code and exit
      --check                     Perform syntax and type checking, then exit
      -e, --eval EXPRESSION       Evaluate a Tact expression and exit
      -v, --version               Print Tact compiler version and exit
      -h, --help                  Display this text and exit

    Examples
      $ tact --version
      ${pkg.version}

    Learn more about Tact:        https://docs.tact-lang.org
    Join Telegram group:          https://t.me/tactlang
    Follow X/Twitter account:     https://twitter.com/tact_language`,
            {
                importMeta: {
                    url: new URL("file://" + __dirname + __filename).toString(),
                },
                description: `Command-line utility for the Tact compiler:\n${pkg.description}`,
                autoVersion: false,
                flags: {
                    config: {
                        shortFlag: "c",
                        type: "string",
                        isRequired: (flags, _) => {
                            // Require a config when the projects are specified
                            // AND version/help are not specified
                            // AND eval is not specified
                            return (
                                flags.projects.length !== 0 &&
                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                !flags.version &&
                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                                !flags.help &&
                                !flags.eval
                            );
                        },
                    },
                    projects: {
                        shortFlag: "p",
                        type: "string",
                        isMultiple: true,
                    },
                    quiet: { shortFlag: "q", type: "boolean", default: false },
                    withDecompilation: { type: "boolean", default: false },
                    func: { type: "boolean", default: false },
                    check: { type: "boolean", default: false },
                    eval: { shortFlag: "e", type: "string" },
                    version: { shortFlag: "v", type: "boolean" },
                    help: { shortFlag: "h", type: "boolean" },
                },
                allowUnknownFlags: false,
            },
        );

        // Helper function to write less in following checks
        const isEmptyConfigAndInput = () => {
            return cli.flags.config === undefined && cli.input.length === 0;
        };

        // Show help regardless of other flags
        if (cli.flags.help) {
            cli.showHelp(0);
        }

        // Show version regardless of other flags
        if (cli.flags.version) {
            console.log(pkg.version);
            // if working inside a git repository
            // also print the current git commit hash
            try {
                const gitCommit = execFileSync("git", ["rev-parse", "HEAD"], {
                    encoding: "utf8",
                    stdio: ["ignore", "pipe", "ignore"],
                }).trim();
                console.log(`git commit: ${gitCommit}`);
            } finally {
                process.exit(0);
            }
        }

        // Evaluate expression regardless of other flags
        if (cli.flags.eval) {
            const result = main.parseAndEvalExpression(cli.flags.eval);
            switch (result.kind) {
                case "ok":
                    {
                        console.log(main.showValue(result.value));
                        process.exit(0);
                    }
                    break;
                case "error": {
                    console.log(result.message);
                    process.exit(30);
                }
            }
        }

        // Disallow specifying both config or Tact source file at the same time
        if (cli.flags.config !== undefined && cli.input.length > 0) {
            console.log(
                "Error: Both config and Tact file can't be simultaneously specified, pick one!",
            );
            cli.showHelp();
        }

        // Disallow specifying several exclusive compilation mode flags
        const compilationModeFlags = [
            cli.flags.check,
            cli.flags.func,
            cli.flags.withDecompilation,
        ];
        const numOfCompilationModeFlagsSet = compilationModeFlags.filter(
            (flag) => flag,
        ).length;
        if (numOfCompilationModeFlagsSet > 1) {
            console.log(
                "Error: Flags --with-decompilation, --func and --check are mutually exclusive!",
            );
            cli.showHelp();
        }

        // Disallow using compilation mode flags without a config or a file specified
        if (isEmptyConfigAndInput() && numOfCompilationModeFlagsSet > 0) {
            console.log(
                "Error: Either config or Tact file have to be specified!",
            );
            cli.showHelp();
        }

        // Disallow specifying more than one Tact file
        if (cli.input.length > 1) {
            console.log(
                "Error: Only one Tact file can be specified at a time. If you want more, provide a config!",
            );
            cli.showHelp();
        }

        // Show help when all flags and inputs are empty
        // Note, that version/help flags are already processed above and don't need to be mentioned here
        if (
            isEmptyConfigAndInput() &&
            numOfCompilationModeFlagsSet === 0 &&
            cli.flags.projects.length === 0
        ) {
            cli.showHelp(0);
        }

        // Compilation mode
        const mode = cli.flags.check
            ? "checkOnly"
            : cli.flags.func
              ? "funcOnly"
              : cli.flags.withDecompilation
                ? "fullWithDecompilation"
                : undefined;

        // TODO: all flags on the cli should take precedence over flags in the config
        // Make a nice model for it in the src/node.ts instead of the current mess
        // Consider making overwrites right here or something.

        // Main command
        void main
            .run({
                fileName: cli.input.at(0),
                configPath: cli.flags.config,
                projectNames: cli.flags.projects ?? [],
                additionalCliOptions: { mode },
                suppressLog: cli.flags.quiet,
            })
            .then((response) => {
                // https://nodejs.org/docs/v20.12.1/api/process.html#exit-codes
                process.exit(response.ok ? 0 : 30);
            });
    },
);
