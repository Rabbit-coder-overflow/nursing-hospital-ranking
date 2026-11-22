# Copilot instructions

## Editing filter conditions and options

The condition and option definitions live in `data/hospitals.json`; `src/App.jsx` builds the filters and hospital details from that data. Keep the IDs and values as stable data keys, separate from the labels shown to users.

- To add an option, add an `{ "value": "...", "label": "..." }` entry to the intended condition's `options`. Give it a unique value within that condition and a clear display label.
- To change only the wording, edit the label and keep the value unchanged. If an option's meaning or value changes, update every hospital's corresponding `attributes[condition.id]` value too.
- To remove an option, remove it from `options` and update or remove every hospital attribute that refers to its value. Unknown or absent values appear as `未提供` and won't match a selected filter.
- When adding a condition, give it a unique, stable `id` and add a value/label option list. Add an `attributes` entry with a valid option value for every hospital; update any affected tests that select options by value.
- When removing or renaming a condition ID, update the corresponding hospital attribute keys and affected tests at the same time.
- Keep the JSON valid. Review `README.md`, `src/App.jsx`, and `tests/site.spec.js` when a change could affect documented behavior, rendering, filtering, or test selectors.

Search matches hospital name or city, and selected conditions are combined with AND. Preserve that behavior when editing the data or its consumers.

## Coding guidelines

Follow these project-wide guidelines, based on [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876):

1. **Think before coding:** State assumptions; surface ambiguity and tradeoffs instead of silently choosing. Ask when a requirement is unclear.
2. **Simplicity first:** Make the smallest change that fully solves the request; avoid speculative features and abstractions.
3. **Surgical changes:** Touch only what the task requires. Don't refactor unrelated code or clean up pre-existing issues.
4. **Define success:** Set concrete verification criteria, make the change, and verify those criteria.
5. **Use models for judgment:** Keep deterministic routing, transforms, retries, and status-code handling in ordinary code.
6. **Respect token budgets:** Stay within the task and session budgets; surface a budget concern rather than silently exceeding it.
7. **Surface conflicts:** If existing patterns disagree, choose the better-supported pattern and call out the conflict instead of blending them.
8. **Read before writing:** Inspect the target file, its caller, and relevant shared utilities before changing code.
9. **Test intent:** Tests should protect the reason for the behavior, including relevant edge cases, not merely repeat implementation details.
10. **Checkpoint substantial work:** For multi-step tasks, report what is done, verified, and still outstanding after significant steps.
11. **Match project conventions:** Follow established naming, formatting, architecture, and localization patterns.
12. **Fail loud:** State uncertainty, failures, and unverified outcomes plainly; never imply success when work was skipped or not verified.

## UI language

Aside from code, code comments, and prompts, all displayed UI text (including labels, headings, messages, and user-facing data) must be written in Traditional Chinese (繁體中文).
