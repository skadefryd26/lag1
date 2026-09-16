---
name: skadefryd-git-help
description: 'Use for every Git and GitHub situation in Skadefryd 2026: starting new work, creating a branch, saving and pushing changes, opening a pull request, resolving merge conflicts, recovering when main has moved, responding to review comments, or when a push or pull fails. Also use before writing the first line of code for any new piece of work.'
---

# Skadefryd Git Help

Several team members push to the same repository during this hackathon, and most of them have
never resolved a merge conflict. Git is where non-developers lose their work and their morning.
Treat it as part of the feature, not as an afterthought.

## The rule that prevents most problems

**Before any new piece of work begins, check which branch the participant is on.** Do this
before writing code, not after.

```bash
git status --short --branch
```

If the branch is `main`, say so and create a new one before touching any file. Do not ask a
non-developer whether they want a branch — explain in one sentence that new work goes on its
own branch so it cannot break what the team already has, then do it.

If the branch is not `main`, check whether the new work belongs with what is already there.
Unrelated work gets a branch of its own.

## How to talk about Git

For non-developers:

- Run the commands yourself. Never hand someone a list of Git commands to type.
- Say what you are about to do and why, in one sentence, before you do it. Summarize after.
- Use everyday words. A branch is a separate copy of the project. A commit is a save point. A
  pull request is asking the team to include your work. A conflict is two people changing the
  same lines.
- Never make them choose between merge and rebase, or between `--force` and anything else.
  Pick the safe option and move on.
- Never paste a wall of Git output. Say what it means.

For developers: be brief, and do not create branches, commits, pushes, or pull requests unless
asked. See `skadefryd-participant-workflow`.

## Starting new work

```bash
git status --short --branch          # check for uncommitted work first
git fetch origin
git switch -c <type>/<short-name> origin/main
```

If there is uncommitted work, handle it before switching. Show the participant what it is in
plain language and ask whether it belongs to the new work or the old. Never discard it silently.

Name branches after the work: `feat/chat-ui`, `feat/bjarne-personality`, `fix/token-error`.

Once the branch exists, move the task to `Under arbeid`. See `skadefryd-project-board`.

## Saving and pushing

1. Inspect the working tree before staging: `git status --short` and `git diff`.
2. Stage only the intended files. Never `git add -A` without looking — a teammate's work, a
   `.env.local`, or a screenshot containing real data ends up in the commit that way.
3. Commit with Conventional Commits: `feat: legg til chatvindu`.
4. Push: `git push -u origin HEAD`.

Check every commit for secrets, tokens, customer data, claim data, and employee data before
creating it. If a token was already committed, say so immediately and treat the token as burned:
it has to be replaced, not just deleted from the file.

## Opening a pull request

```bash
gh pr create --fill
```

Write a title and body a teammate can understand: what the change does and what to look at. Put
`Closes #<n>` in the body so the issue closes on merge and the card follows. Then move the task
to `Review`. Give the participant the URL and explain what happens next — a teammate reviews it,
then it is merged into `main` so the rest of the team gets the change.

If `gh` is not authenticated, tell the participant to run `gh auth login` in their own terminal
and continue once it is done. Never ask for or echo credentials.

## When main has moved

This is the most common problem of the day, and the point where people panic.

```bash
git fetch origin
git merge origin/main
```

Use **merge**, not rebase. It is easier to explain, easier to undo, and it cannot lose commits in
the hands of someone who has never seen a reflog.

If the merge succeeds, say so and carry on. If it conflicts, go to the next section.

## Resolving a merge conflict

Explain first, then fix. Say something like: "Du og en annen har endret de samme linjene. Git vet
ikke hvilken versjon som er riktig, så jeg må velge. Jeg viser deg hva de to versjonene sier."

1. List the conflicted files: `git status --short` and look for `UU`.
2. For each file, read both sides and explain them in plain language — not as conflict markers.
3. Decide together what the result should be. When one side is clearly the participant's own work
   and the other is a teammate's unrelated change, keep both.
4. Edit the file so that `<<<<<<<`, `=======` and `>>>>>>>` are gone.
5. `git add <file>` for each resolved file, then `git commit`.
6. Verify the result actually runs before pushing. A resolved conflict that does not compile is
   worse than the conflict was.

If the participant is lost, or the conflict is large, `git merge --abort` puts everything back the
way it was. Say that this escape hatch exists — it removes the fear.

## Responding to review comments

```bash
git switch <branch>
git pull
```

Make the changes, commit, and push to the same branch. The pull request updates itself — the
participant does not need to open a new one. Say this explicitly, because it is not obvious.

## When something fails

- **Push rejected, "fetch first"** — someone pushed to the same branch. `git pull`, resolve any
  conflict as above, then push again.
- **Updates rejected on `main`** — the work should not be on `main`. Move it to a branch rather
  than forcing anything.
- **"Permission denied (publickey)"** — an SSH key problem. The participant fixes this in their
  own terminal, or switches to HTTPS with `gh auth login`.
- **Committed on the wrong branch** — the commits can be moved. Show what will happen first, and
  get a yes before doing it.

## Never do these

Never run `git push --force`, `git reset --hard`, `git checkout -- .`, or `git clean` against a
participant's work without showing exactly what will be lost and getting an explicit yes. On a
shared hackathon repository, a force push can delete a teammate's entire morning.
