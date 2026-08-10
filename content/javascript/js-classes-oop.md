---
title: "Classes & OOP"
category: "javascript"
chapterId: "js-oop-patterns"
slug: "js-classes-oop"
description: "Private fields, getters/setters, static methods, inheritance."
---

# Classes & OOP

## What is it?

ES6 classes are syntactic sugar over prototype-based inheritance. They provide a clean OOP syntax for creating objects with shared behavior.

## How to use it

```js
class BankAccount {
  #balance = 0; // private field — inaccessible outside

  constructor(owner, initial = 0) {
    this.owner = owner;
    this.#balance = initial;
  }

  // Getter — access like a property
  get balance() { return this.#balance; }

  // Regular method
  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
  }

  // Static — called on the class, not an instance
  static currency() { return 'USD'; }
}

const acc = new BankAccount('Alice', 100);
acc.deposit(50);
console.log(acc.balance);        // 150
console.log(acc.#balance);       // SyntaxError — private!
console.log(BankAccount.currency()); // 'USD'
```

## Inheritance

```js
class SavingsAccount extends BankAccount {
  #interestRate;

  constructor(owner, initial, rate) {
    super(owner, initial); // must call before using this
    this.#interestRate = rate;
  }

  applyInterest() {
    this.deposit(this.balance * this.#interestRate);
  }
}

const savings = new SavingsAccount('Bob', 1000, 0.05);
savings.applyInterest();
console.log(savings.balance); // 1050
```

> ⚠️ **Warning:** Private fields (`#`) are truly private — not even subclasses can access them. Use protected naming conventions (`_field`) if subclasses need access.
