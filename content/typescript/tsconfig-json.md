---
title: "Configuring tsconfig.json"
category: "typescript"
chapterId: "ts-introduction"
slug: "tsconfig-json"
description: "Setting up build options, target environments, and strict type-checking modes."
playgroundTemplate: "typescript-concept"
---
## Configuring tsconfig.json
The `tsconfig.json` file ***marks the `root directory` of a TypeScript project***.
- It directs the compiler exactly ***how to translate your code, which folders to manage, and how aggressively to enforce syntax correctness***.

## Key Concepts
- **Initialization**: Created by running the terminal command `npx tsc --init`.
- **target**: Determines the target JavaScript version outputted by the compiler (e.g., ES6, ES2022).
- **strict**: Turning this to true ***activates strict type-checking rules (like noImplicitAny and strictNullChecks)*** for the strongest possible code quality barriers.

## Key Sections of tsconfig.json
- **compilerOptions**: This section contains various options ***that control the behavior of the TypeScript***.
- **include**: This section specifies the files or directories ***that should be `included` in the compilation process***.
- **exclude**: This section specifies the files or directories ***that should be `excluded` from the compilation process***.
```json
{
  "compilerOptions": {
    "target": "ES6", // Specify ECMAScript target version
    "module": "commonjs", // Specify module code generation
    "strict": true, // Enable all strict type-checking options
    "outDir": "./dist", // Redirect output structure to the directory
    "rootDir": "./src", // Specify the root directory of input files
    "esModuleInterop": true, // Enables emit interoperability between CommonJS and ES Modules
    "forceConsistentCasingInFileNames": true // Disallow inconsistently-cased references to the same file
  },
  "include": ["src/**/*"], // Include all TypeScript files in the src directory
  "exclude": ["node_modules", "**/*.spec.ts"] // Exclude node_modules and test files
}
```