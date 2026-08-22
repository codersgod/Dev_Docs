---
title: "Primitive Types"category: "typescript"chapterId: "ts-basics"slug: "primitive-types"description: "string, number, boolean, null, undefined, symbol, and bigint."playgroundTemplate: "typescript-concept"

---
## Primitive Types core concepts
TypeScript provides several built-in primitive types that you can use to define the shape of your data. The most common primitive types are:
- **Core Primitives**: `string` (text), `number` (integers and floats), and `boolean` (true/false).
- **Emptiness Types**: `null` and `undefined` represent empty values. If `strictNullChecks` is active, they cannot be assigned to other types accidentally.
- **Modern Additions**: `bigint` handles arbitrarily large integers, and `symbol` creates entirely unique identifiers

```ts
// string
let name: string = "Anders";
// number
let age: number = 42;
// boolean
let isActive: boolean = true;
// null
let emptyValue: null = null;
// undefined
let notAssigned: undefined = undefined;
// symbol
let uniqueId: symbol = Symbol("id");
// bigint
let largeNumber: bigint = 9007199254740991n;
```
##  Special Types 

> `any`,`unknown`, and `never` are **Special Types** (often called meta-types or top/bottom types). They ***do not represent physical values***. Instead, ***they are instructions to the TypeScript compiler*** about how strictly it should police your code.

**`any` (The Escape Hatch)**
- Using any ***tells TypeScript to completely stop checking that variable***. It allows you to write dangerous, unpredictable code that ***can crash your website at runtime***.
```ts
let dynamicValue: any = "Hello";

dynamicValue = 42;          // ✅ Allowed by compiler.
dynamicValue.length();      // ✅ Allowed by compiler, but 💥 CRASHES your app!

```
**`unknown` (The Safe Alternative to any)**
- Like any, unknown ***can hold absolutely any type of value***. However, TypeScript ***forces you to verify the data type before you can use it.***.
```ts
let apiData: unknown = "Secret Message";

// ❌ TypeScript blocks this because it doesn't know if it's text yet
let size = apiData.length; 

//  You must verify it first using code logic
if (typeof apiData === "string") {
    let size = apiData.length; //  Allowed now!
}

```

**`never` (The Impossible Type )**
- `never` type ***represents values that can absolutely never occur***, meaning a function with this return type will never successfully finish.
> ***You give it the never type*** not for the code running right now, but ***to protect the code from future changes***.

```ts
// This function never returns a value because it crashes on purpose
function killProcess(): never {
    throw new Error("Fatal System Crash!");
}
// ------------------------------------------------------------------------
// mostly used with switch statements to ensure all cases are handled
type Theme = "dark" | "light";

function handleTheme(theme: Theme) {
  switch (theme) {
    case "dark":
      return "Applying dark mode";
    case "light":
      return "Applying light mode";
    default:
      // This line is logically impossible to reach right now
      const _exhaustiveCheck: never = theme;
      return _exhaustiveCheck;
  }
}

```
> **Note**: The `never` type is ***often used in functions that throw exceptions or have infinite loops, as they do not return a value***. 
>- It is also useful in ***exhaustive type checking***, ensuring that all possible cases are handled in a switch statement or similar constructs.

```ts
// Scenario 1: SOMEONE ADDED another TYPE:  Exhaustive checking ( COMPILATION ERROR )
type Theme = "dark" | "light" | "sunset"; // 🆕 Added a new theme

// ❌ ERROR: Type '"sunset"' is not assignable to type 'never'.
const _exhaustiveCheck: never = theme; 
//--------------------------------------------------------------------
// Scenario 2: INFINTE LOOP : Function that never returns  (COMPILATION ERROR)
function infiniteLoop(): never {
    while (true) {
        // This loop will run forever, so the function never returns
    }
}
//--------------------------------------------------------------------
//Scenario 3: 
// --> YOU PASS NEW TYPE while coding (COMPILATION ERROR) 
// --> DATA COMES DYNAMICALLY FROM API (RUNTIME ERROR)-(JavaScript handles it).
handleTheme("midnight"); 
// ❌ ERROR: Argument of type '"midnight"' is not assignable to parameter of type 'Theme'.

```
> **Note**: If the data comes dynamically handleTheme ( .... ) (like from a website API or user input), you cannot trust TypeScript’s static checks alone because plain JavaScript handles the data at runtime.
```ts
 if (incomingData === "dark" || incomingData === "light") {
    // TypeScript now knows 100% that incomingData is a valid Theme (RUNTIME SAFE)
    handleTheme(incomingData); 
```