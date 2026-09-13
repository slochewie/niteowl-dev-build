# NiteOwl Auth Development Rules

## Repository access
- GitHub access to this repository is READ ONLY for ChatGPT.
- Never attempt GitHub writes, branches, commits, PRs, or write-access tests.
- Inspect repository files through GitHub when needed.
- Source modifications are performed locally by the user on the Beelink.

## Local edits
- Prefer guarded Node.js heredoc scripts executed in the `auth` container.
- Do not use Python for Auth edits.
- Read and validate expected source before replacement.
- Abort without writing if expected anchors do not match.
- Never overwrite or include unrelated local changes.

## Terminal output
- Never invoke a Git pager.
- Use `git --no-pager diff`, `git --no-pager log`, etc.
- The host has a working OSC52 `clip` command.
- When output may be large, write it to `/tmp` and copy only a small byte tail:
  `tail -c 2000 /tmp/output.txt | clip`
- Do not use line-based tails for potentially large clipboard output.
- Do not pipe potentially empty output to `clip`.

## Validation
- Inspect `git status --short` and `git --no-pager diff` after edits.
- Avoid broad Biome formatting.
- Build/test only after the source diff is correct.
- Commit/push only after validation.
- ChatGPT supplies the local commit/push commands; it does not perform them through GitHub.
