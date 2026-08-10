---
title: "Complex UI Components"
category: "javascript"
chapterId: "js-polyfills-machine-coding"
slug: "js-ui-components"
description: "Autocomplete, infinite scroll, nested comments from scratch."
---

# Complex UI Components

## Autocomplete / Typeahead with debounce + cache

```js
const cache = new Map();

async function fetchSuggestions(query) {
  if (cache.has(query)) return cache.get(query);
  const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  cache.set(query, data);
  return data;
}

const search = debounce(async (query) => {
  if (query.length < 2) return clearDropdown();
  const suggestions = await fetchSuggestions(query);
  renderDropdown(suggestions);
}, 300);

input.addEventListener('input', e => search(e.target.value));
```

## Infinite Scroll with IntersectionObserver

```js
let page = 1;
let loading = false;

const sentinel = document.querySelector('#sentinel'); // empty div at bottom

const observer = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting || loading) return;
  loading = true;

  const items = await fetchPage(page++);
  if (items.length === 0) return observer.disconnect(); // no more data

  appendItems(items);
  loading = false;
}, { threshold: 0.1 });

observer.observe(sentinel);
```

## Nested Comments (Reddit-style)

```js
function renderComment(comment) {
  const div = document.createElement('div');
  div.className = 'comment';
  div.innerHTML = `<p>${comment.text}</p>`;

  if (comment.replies?.length) {
    const replies = document.createElement('div');
    replies.className = 'replies';
    comment.replies.forEach(reply => replies.appendChild(renderComment(reply)));
    div.appendChild(replies);
  }

  return div;
}

// Usage
const data = {
  text: 'Root comment',
  replies: [
    { text: 'Reply 1', replies: [{ text: 'Nested reply', replies: [] }] },
    { text: 'Reply 2', replies: [] }
  ]
};

document.body.appendChild(renderComment(data));
```

> ⚠️ **Warning:** Always cancel inflight fetch requests when a new search query comes in — use `AbortController` to avoid race conditions in autocomplete.
