# Codex instructions for this repository

## Product intent
- Build a web app that improves communication between managers and direct reports.
- Do not frame results as hiring, screening, promotion, compensation, medical, or clinical judgments.
- The app may use MBTI-like approachable labels, but the internal model should stay continuous and trait-based.
- Character labels are entertainment metaphors inspired by Japanese and world historical figures. Do not imply real psychological assessment of those figures.

## Implementation rules
- Use Next.js App Router, TypeScript, React client state, and Tailwind CSS.
- Keep scoring logic and fixed feedback templates in `src/lib/diagnosis.ts`.
- Keep the MVP frontend in `src/app/page.tsx` unless the UI becomes too large, then split into components.
- Do not call external AI APIs in the MVP. All feedback should be deterministic templates.
- Avoid storing personal data. Local UI state only for the first version.
- Add tests for scoring logic before adding backend, auth, sharing URLs, or image generation.

## Quality bar
- Run `pnpm lint` and `pnpm build` after edits.
- Keep all messages in Japanese.
- Every result page must show a caution that this is a communication aid, not an employment or clinical assessment.
