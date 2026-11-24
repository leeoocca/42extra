# 42 Intra Workspace Guidelines & Invariants

## 1. 42 Project & Evaluation Marks
- Always display project, team, and peer evaluation marks as bare numbers (e.g. `100`, `125`, `0`, `42`).
- **NEVER** append `/100` or any denominator suffix to marks in UI components, tables, lists, or badges.

## 2. 42 API Field Access: Validation & Booleans
- Upstream 42 API v2 returns boolean statuses with trailing question marks (`"validated?"`, `"locked?"`, `"closed?"`).
- Always access validation status using bracket notation: `project['validated?']` or `Boolean(project['validated?'] ?? project.validated)`.
- Never rely solely on `project.validated`, as it is `undefined` in upstream 42 API responses.

## 3. UI Component System: Buttons
- Do **NOT** rely on raw `<button>` elements with custom borders, padding, and colors.
- Always use the shadcn `Button` component from `#lib/components/ui/button/index.js` (`variant="outline"`, `variant="ghost"`, `variant="secondary"`, etc.) for all actions, toggles, icon buttons, and navigation links.
