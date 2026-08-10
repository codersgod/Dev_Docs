---
title: "Modern Form Actions (React 19+)"
category: "react"
chapterId: "all-hooks-apis"
slug: "form-actions-hooks"
description: "useActionState, useFormStatus, and useOptimistic for immediate UI updates."
---

# Modern Form Actions (React 19+)

React 19 introduces three hooks designed specifically for modern form handling with server actions, optimistic updates, and built-in pending states.

## useActionState — managing form actions

## What is it?

`useActionState` replaces the old `useFormState` hook. It manages the lifecycle of an async action (like submitting a form) and tracks its result and pending state.

```jsx
import { useActionState } from 'react';

async function createUserAction(prevState, formData) {
  const name = formData.get('name');
  // Simulate server call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: `User ${name} created!` };
}

export default function UserForm() {
  const [state, action, isPending] = useActionState(createUserAction, null);

  return (
    <form action={action}>
      <input name="name" required />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
```

The form automatically calls `action` on submit — no `onSubmit` handler needed.

## useFormStatus — reading parent form status

## What is it?

`useFormStatus` reads the pending/submitting state of the **closest parent `<form>`**. This is useful for submit buttons or loading indicators inside a form — they can reactively show their state without prop drilling.

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// Usage inside a form
<form action={myAction}>
  <input name="email" />
  <SubmitButton /> {/* automatically shows pending state */}
</form>
```

## useOptimistic — instant UI updates

## What is it?

`useOptimistic` lets you update the UI **immediately** with an optimistic value while an async action runs in the background. If the action succeeds, the optimistic value becomes real. If it fails, React reverts to the original value.

Classic use case: instant "like" button feedback.

```jsx
import { useOptimistic } from 'react';

export default function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (current) => current + 1
  );

  async function handleLike() {
    addOptimisticLike(); // Show +1 instantly
    await fetch(`/api/like/${postId}`, { method: 'POST' });
    // If successful, optimistic value becomes real
    // If failed, React reverts to initialLikes
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  );
}
```

The button shows the new count immediately — no waiting for the server.

## Why these matter

These hooks shift React toward a **server-first** mental model:
- Forms submit directly to server actions (no client-side state).
- Pending states are built-in (no manual `isLoading` flags).
- Optimistic updates prevent waiting spinners.

> ⚠️ **Warning:** `useFormStatus` only works inside a component that is a **child** of a `<form>`. Calling it outside a form returns `{ pending: false }` always.
