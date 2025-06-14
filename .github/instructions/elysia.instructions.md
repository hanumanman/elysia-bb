---
applyTo: '**'
---

- Refer to [The Elysia doc](./elysia.doc.md) when implementing new feature.
- Refer to [Architecture](../../changelogs/ARCHITECTURE.md) when scaling the app.
- Im using fish shell instead of bash, so before running any terminal command/ changing any shell scripts we should check the [fish documentation](./fish.doc.md) for syntax because some syntax is different from regular bash.
- Before running any command to start the app, make sure that there is no background process running that might conflict with the app (maybe a previous instance of the app or another service running on the same port).

## After implementing new feature:

- Add relevant tests.
- Run the scripts to test, check type, linting and format to ensure everything is working.
- Update the changelogs folder.
