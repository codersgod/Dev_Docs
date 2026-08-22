---
title: "Enums"
category: "typescript"
chapterId: "ts-complex-structures"
slug: "enums"
description: "Declaring readable numerical or string-based sets of named constants."
playgroundTemplate: "typescript-concept"
---
## Enums

An Enum (short for enumeration) allows you **to define a human-readable list of related constants with meaningful names.** 

Instead of passing hardcoded numbers or strings across your application (which can lead to typos), Enums organize related choices into a single, clean container.

### 1. Numeric Enums (Default Behavior)
If you do not assign specific values, TypeScript automatically assigns numbers starting at `0` and increments them sequentially.

```typescript
// 1. Define the enum (0, 1, 2)
enum LightState {
  Off, // 0
  On,  // 1
  Dim  // 2
}

// 2. Use it cleanly in code
let livingRoomLight = LightState.Off;

function toggleLight(action: LightState) {
  if (action === LightState.On) { // here 
    console.log("Lights turned on.");
  }
}

// 3. Sent to a database as a tiny number (saves space!)
toggleLight(1); // ✅ Allowed (1 from API = LightState.On) |  but toggleLight(3) ❌ ERROR
console.log(LightState.Dim); // Output: 2
```
> *Note*: While `String Enums` are the industry ***preferred choice*** for standard applications, `Numeric Enums` are still useful for **micro-optimizing memory usage** in performance-critical applications. 
>- You use the `word` so you can ***understand the code*** easily, but the enum connects it to a `number` so the ***computer can process it at maximum speed***.

>***If you initialize the first entry*** with a custom number like `Up = 1`, the ***subsequent values will automatically increment from there*** (`Down` becomes `2`, `Left` becomes `3`, etc.).

```typescript
// TypeScript automatically increments the values
enum Direction {
    Up = 1,    // Explicitly set to 1
    Down,      // TypeScript inferred as 2
    Left,      // TypeScript inferred as 3
    Right      // TypeScript inferred as 4
}
// TypeScript also allows you to mix explicit (YOU) and implicit (TYPESCRIPT) values
enum MixedEnumsDirection {
    Up = 10,    // Explicitly set to 1
    Down,      // TypeScript inferred as 11
    Left = 50,      // Explicitly set as 50  
    Right = "Twenty"     // Explicitly set as Twenty
}

let move: MixedEnumsDirection = MixedEnumsDirection.Down; 
let move2: MixedEnumsDirection = MixedEnumsDirection.Right; 

// 🔍 WHAT HAPPENS BEHIND THE SCENES:
console.log(move);  // Output: 11
console.log(move2); // Output: "Twenty"
// (Uses slightly more storage, but tells you exactly what it means instantly)
```
### 2. String Enums (Industry Preferred)
String enums require you to explicitly initialize every single entry with a text value. They are highly popular because they offer excellent readability when debugging code errors.

```typescript
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}

let currentRole: UserRole = UserRole.Admin; // Value is "ADMIN"

// 1. MATCHING CONDITIONS (Works perfectly with the value behind the scenes):
if (currentRole === UserRole.Admin) { // Where currentRole is "ADMIN"
  console.log("Welcome Admin!"); 
}

// 2. RE-ASSIGNING (What you can and cannot do):
currentRole = UserRole.Guest; // ✅ ALLOWED (Using the official enum name)
// currentRole = "GUEST";     // ❌ BLOCKED (Using the raw value throws an error)

```
> **The Rule**: You use the human-readable word (UserRole.Admin) to safely read and write your code, and you use the underlying value ("ADMIN" or 1) behind the scenes to save data or check database conditions.

> **The Trick**: When changing that variable later, you must always assign it using the full official name (UserRole.Guest), because TypeScript blocks you from using the raw value directly to protect you from typos.

| Enum Type | Compilation Output | Best For | Main Benefit |
| :--- | :--- | :--- | :--- |
| **Number** (`Admin=11`) | Generates minimal JavaScript objects or numeric constants. | Micro-optimizing databases, speed, or legacy hardware integrations. | **Saves maximum memory** |
| **String** (`Admin="ADMIN"`) | Generates readable string values directly in the compiled code. | Large team web applications and everyday development. | **Incredibly easy to read in error logs** |


### 3. The Performance Trick: `const enum`
Standard enums generate code overhead inside your final JavaScript bundle. To keep your application running fast, you can prefix the block with the `const` keyword.

```typescript
const enum Status {
  Active = "ACTIVE",
  Pending = "PENDING"
}

let currentStatus = Status.Active;
```
* **Why it matters:** The TypeScript compiler completely eliminates `const enum` objects during compilation, instantly substituting the direct values (`"ACTIVE"`) straight into the final code. This leaves **zero footprint** in your production code.


| Enum Type | TypeScript Code (What you write) | Final JavaScript Output (What runs in browser) |
| :--- | :--- | :--- |
| **Regular Enum** | `enum Status { Active = 1 }`<br>`let code = Status.Active;` | `var Status;`<br>`(function (Status) {`<br>&nbsp;&nbsp;&nbsp;&nbsp;`Status[Status["Active"] = 1] = "Active";}) `<br> &nbsp;&nbsp;&nbsp;`(Status  (Status = {}));`<br>`let code = Status.Active;` |
| **Const Enum** | `const enum Status { Active = 1 }`<br>`let code = Status.Active;` | `let code = 1;` |


---

### Key Summary Rule for Notes
Use Enums when you have a strict, unchanging set of grouped choices that your app needs to manage, such as roles (`Admin`, `User`), tracking statuses (`Success`, `Fail`), or keyboard keys (`Up`, `Down`). Use **String Enums** or **`const enum`** for the best balance of readability and system speed.
