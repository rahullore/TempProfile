# Hermes Development Workflow

This document defines the required workflow for changes to `rahullore/TempProfile`, which hosts `rahullore.com`.

## Scope and safety boundaries

- Protect existing uncommitted work. Before changing files, run `git status --short` and stop if unrelated user changes are present.
- Do not modify the separate `/demo1` application.
- Do not deploy manually or copy files directly to production without explicit authorization.
- Never force-push `main` or any protected branch.
- Never commit secrets, private keys, credentials, tokens, or production configuration containing secrets.
- Keep changes focused and independently reviewable; prefer one to five related files when practical.

## Required issue-to-merge flow

Every code or configuration improvement follows this sequence:

1. **Create one GitHub issue first.** The issue must describe one focused change and include clear acceptance criteria, scope, non-goals, risks, and validation expectations.
2. **Start from the latest default branch.** Fetch `origin`, update local `main` with a fast-forward-only pull, and create exactly one feature/fix/chore branch from that commit.
3. **One issue = one branch = one focused pull request.** Do not combine unrelated issues or reuse a branch for multiple independent changes.
4. **Implement the smallest complete change.** Preserve existing architecture unless the issue explicitly requires structural change. Do not include unrelated formatting, cleanup, generated files, or `/demo1` changes.
5. **Run relevant validation.** For this static site, at minimum parse/serve the HTML, verify referenced assets and links, run `git diff --check`, and perform available browser/responsive checks. If a check is unavailable, report that limitation honestly.
6. **Commit conventionally.** Use a descriptive Conventional Commit, for example:
   - `feat: add ...`
   - `fix: correct ...`
   - `docs: document ...`
   - `chore: update ...`
7. **Review before pushing.** Inspect `git diff`, `git diff --check`, `git status`, and the complete changed-file list. Confirm no unrelated changes, secrets, regressions, or accidental `/demo1` edits.
8. **Push the branch and open a PR.** The PR must target `main`, describe the issue, implementation, validation, risks, and rollback, and include `Closes #NUMBER` in the body.
9. **Review the full PR diff on GitHub.** Confirm the PR head, base, changed files, commit, issue reference, and deployment implications are correct.
10. **Wait for required checks and approvals.** Do not bypass failing checks, required reviews, branch protections, or merge restrictions. If GitHub protection status cannot be inspected, treat that as an operational limitation—not permission to bypass safeguards.
11. **Squash merge only when eligible.** Merge only when all required checks pass, required approvals are present, the PR is mergeable, and the full diff has been reviewed. Use squash merge and delete the feature branch.
12. **Verify after merging.** Confirm the PR is `MERGED`, the linked issue is closed, `main` contains the squash commit, and the deployment workflow completes successfully. Report the issue number, PR URL, changes, validation results, merge status, and deployment status.

## Repository-specific validation

This repository is a static Caddy-served site. Before opening a PR:

- Confirm `index.html` parses successfully.
- Confirm all local `href` and `src` assets referenced by the page exist.
- Confirm the page serves through a local HTTP server.
- Check links, anchors, horizontal overflow, and responsive behavior at approximately 375px, 430px, 768px, 1024px, and 1440px when browser automation is available.
- Verify `prefers-reduced-motion` behavior when motion is changed.
- Run `git diff --check`.
- Do not claim browser or deployment verification when the required browser or environment is unavailable.

## CI and production deployment

The workflow at `.github/workflows/ci-deploy.yml` runs on pushes to `main`. It:

1. Checks out the repository.
2. Copies `index.html`, `rahul.jpeg`, `rahullore_CL.pdf`, and `rahullore_OP.pdf` to `/var/www/rahullore/` through the configured SSH secrets.
3. Fixes Caddy-readable permissions.
4. Reloads Caddy with `systemctl reload caddy`.

A merge to `main` therefore triggers automatic production deployment to `rahullore.com`. Before merging a change that affects deployed files, identify this production effect in the PR and verify the corresponding GitHub Actions run after merge.

The repository currently has no configured GitHub rulesets visible to the authenticated workflow and branch-protection details may require elevated GitHub permissions. Regardless, contributors must never bypass repository protections. Repository administrators should configure `main` protection with required PR review, required CI checks, and no direct pushes where organizationally appropriate.

Rollback is currently a Git-based rollback: revert the merged commit through the normal issue/branch/PR process, merge the revert to `main`, and verify the resulting deployment run. Do not manually edit the production server.

## Completion report

Every completed workflow setup or change must report:

- Issue number and URL
- Branch name
- PR number and URL
- Files and behavior changed
- Tests and validations run, including limitations
- CI/check status
- Merge commit and merge status
- Deployment status and rollback note when production was affected
