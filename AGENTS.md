# 42 Intra Workspace Guidelines & Invariants

## 1. 42 Project & Evaluation Marks

- Always display project, team, and peer evaluation marks as bare numbers (e.g. `100`, `125`, `0`, `42`).
- **NEVER** append `/100` or any denominator suffix to marks in UI components, tables, lists, or badges.
- Always use the `tabular-nums` Tailwind CSS class on mark numbers to guarantee monospaced numeric alignment.
- Always place the project mark status icon on the **right** of the numeric mark (e.g. `<span class="tabular-nums">100</span> <CheckIcon />`), never on the left.

## 2. 42 API Field Access: Validation & Booleans

- Upstream 42 API v2 returns boolean statuses with trailing question marks (`"validated?"`, `"locked?"`, `"closed?"`).
- Always access validation status using bracket notation: `project['validated?']` or `Boolean(project['validated?'] ?? project.validated)`.
- Never rely solely on `project.validated`, as it is `undefined` in upstream 42 API responses.

## 3. UI Component System: Buttons

- Do **NOT** rely on raw `<button>` elements with custom borders, padding, and colors.
- Always use the shadcn `Button` component from `#lib/components/ui/button/index.js` (`variant="outline"`, `variant="ghost"`, `variant="secondary"`, etc.) for all actions, toggles, icon buttons, and navigation links.

## 4. UI Layout & Component Hierarchy: Avoid Nested Cards

- **NEVER** nest Card components or card-like bordered boxes inside another Card (`<Card>` inside `<Card>`).
- For child sections, lists, feed items, or evaluation details inside a parent container, prefer:
  - Clean division lines (`divide-y`, `border-b`)
  - Subtle background tints (`bg-muted/20` or `bg-muted/40`) without borders
  - Definition lists (`<dl>`), simple flat rows, or flat message streams
  - Minimal list items with clear spacing instead of wrapper cards

## 5. Typography & Text Styling: Avoid Italic

- **NEVER** use italic styling (`italic`, `font-style: italic`) for user-generated text, evaluation scale feedback, comments, reviews, or descriptive paragraphs.
- Keep feedback and evaluation quotes in standard upright font with clean typography, using subtle background tints (e.g. `bg-muted/40` or `bg-primary/5`), clear text hierarchy, and quotation marks when appropriate.
