---
name: skadefryd-ai-gateway
description: 'Use whenever a Skadefryd 2026 project needs to talk to Gjensidige''s AI gateway: setting up access for the first time, creating .env.local, fetching or refreshing an Azure token, wiring the backend call to genai.gjensidige.io, or debugging a 401, an expired token, a missing token, or an agent that stops answering. Read this before writing the first backend call to the gateway.'
---

# Skadefryd AI Gateway

Every team's agent runs on Gjensidige's AI gateway. Getting access working is the one step that
stops a non-developer cold: it involves a terminal, a login, a token, and a file that does not
exist yet and must never be committed.

**You do all of it.** The participant does not create files, copy templates, or paste tokens.

## What you set up, what they do

You do everything except the one thing that requires their identity in their own terminal:

| Step | Who |
| --- | --- |
| `az login` | The participant, in their own terminal |
| Fetching the token | You |
| Creating `.env.local` and writing the token into it | You |
| Checking that it is ignored by Git | You |
| Wiring the backend call | You |
| Refreshing the token when it expires | You |

## Asking for `az login`

This is the single point in the whole day where you hand control to the participant, and a
non-developer does not know where a terminal is, that the chat window is not one, or what
"paste" means when the command lands in the wrong place.

**Be painfully explicit.** Read `skadefryd-terminal-coach` before you ask — it covers opening a
terminal for the first time, copying and pasting, and what to say when it goes wrong. If this is
the participant's first command of the day, walk them into the terminal first, then send this:

> Nå trenger jeg at du logger deg inn. Det er det eneste du må gjøre selv — jeg tar resten.
>
> 1. Åpne et **nytt terminalvindu**. På Mac: trykk `Cmd + mellomrom`, skriv `Terminal`, trykk
>    Enter. Ikke skriv i chatten her — det må skje i terminalvinduet.
> 2. Kopier denne linja, lim den inn i terminalvinduet og trykk Enter:
>
>    ```
>    az login
>    ```
>
> 3. Nettleseren åpner seg. Velg Gjensidige-kontoen din, og velg
>    **Gjensidige Production Modern** hvis du får opp en liste.
> 4. Når nettleseren sier at du er logget inn, kan du lukke fanen.
> 5. Kom tilbake hit og skriv «ferdig», så fortsetter jeg.

Then stop and wait. Do not send the next step, do not start building something else in the
meantime, and do not send a second command before the first one is confirmed done.

Rules for any command a participant has to run themselves:

- **One command at a time.** Never a list of three.
- **Say where it goes** — a new terminal window, not the chat, not the browser.
- **Give the command alone on its own line in a code block**, with nothing to edit inside it and
  no `$` or `>` in front that they might copy along with it.
- **Say what they will see** when it works, so they can tell the difference between done and stuck.
- **Say what to do next** — normally: come back and say it is done.
- **Then wait**, and take the work back the moment they confirm.

If `az` is not installed, the message is `command not found: az` on a Mac or
`az is not recognized` on Windows. **That is your job, not theirs** — go to
`skadefryd-machine-setup` and install it yourself, then come back and send the `az login` steps.
Do not hand a non-developer an install command, and on Windows do not send them anywhere near an
installer that asks for administrator rights.

## Never do this

- **Never ask the participant to create, copy, or edit a file.** Not `.env.local`, not
  `.env.example`, not a config. You have tools that write files — use them.
- **Never ask them to paste a token into the chat.** You fetch it yourself. A token in the chat
  is a token in a log.
- **Never print the token.** Not in a command's output, not in a summary, not "just to check".
- **Never put the token in a `VITE_` variable or anywhere under `frontend/`.** Vite bundles those
  into the JavaScript the browser downloads, so the token would be handed to every visitor. The
  token belongs in the backend only.
- **Never commit `.env.local`.** `.gitignore` already covers `.env.*`. Verify rather than assume.

## Set up access

If `az` is not installed yet, or you are on a Windows machine without administrator rights, stop
here and read `skadefryd-machine-setup` first. Come back when `az` runs.

Fetch the token and write it straight to the file, in one command, so it never passes through the
conversation. Use the variant for the shell **you** are in.

**bash or zsh (macOS, Git Bash):**

```bash
printf 'AI_GATEWAY_TOKEN=%s\n' \
  "$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken --output tsv)" \
  > .env.local
```

**PowerShell (Windows):**

```powershell
$t = az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken --output tsv
[System.IO.File]::WriteAllText("$PWD\.env.local", "AI_GATEWAY_TOKEN=$t`n", (New-Object System.Text.UTF8Encoding($false)))
```

Do not shorten the PowerShell version to `... > .env.local`. **Windows PowerShell 5.1 — the one
that ships with Windows — writes redirected output as UTF-16.** A `.env.local` written that way
looks perfectly normal in an editor and is unreadable to `dotenv`, and the error you get is
"token mangler" on a file that visibly contains the token. `WriteAllText` with UTF-8 and no BOM
avoids it. If `az` is not on PATH yet in your session, call it by full path — see
`skadefryd-machine-setup`.

Then confirm the result without revealing it:

```bash
grep -q '^AI_GATEWAY_TOKEN=ey' .env.local && echo "token skrevet"
git check-ignore -q .env.local && echo "ignorert av git"
```

```powershell
if ((Get-Content .env.local -Raw) -match '^AI_GATEWAY_TOKEN=ey') { "token skrevet" }
git check-ignore -q .env.local; if ($LASTEXITCODE -eq 0) { "ignorert av git" }
```

Tell the participant in one sentence what happened: the access is in place, it lives in a local
file, it is not going into Git, and they did not have to do anything with it.

If `az account get-access-token` fails with a login error, the participant's `az login` has
expired. Send them the one line above again and continue once they say it is done.

## Call the gateway

- Endpoint: `https://genai.gjensidige.io/openai/v1/responses`
- Model / deployment: `gpt-5.6-luna`
- Auth: `Authorization: Bearer <AI_GATEWAY_TOKEN>`

The frontend sends the message to the team's own backend. The backend adds the agent's system
prompt and calls the gateway. The browser never sees the token and never talks to the gateway
directly.

Load the token in the backend from `process.env.AI_GATEWAY_TOKEN`. If it is missing, fail with a
clear message that says the token is missing — not with a crash the participant cannot read.

## The token expires

Azure tokens last about an hour. On a full hackathon day every team will hit this, usually in the
afternoon, and it looks like the agent suddenly breaking: requests start coming back `401`.

When you see a `401`, or the agent stops answering and worked before, **refresh the token
yourself** with the same command as above. Do not ask permission and do not make the participant
debug it. Say afterwards what happened, in one sentence: the access key had a time limit, you
fetched a new one, it works again.

If the refresh itself fails, that is the `az login` case above.

## When something else fails

- **`401` right after setup** — the token was written but the backend is not reading it. Check
  that the backend loads `.env.local` and that the server was restarted after the file appeared.
- **`404` on the endpoint** — the path is wrong. It is `/openai/v1/responses`, not
  `/chat/completions`.
- **The model name is rejected** — the deployment is `gpt-5.6-luna`. It is not an OpenAI model
  name, and guessing a different one will not work.
- **It works for one participant and not another** — each person has their own `.env.local`,
  because it is not in Git. Set it up for whoever is missing it, the same way.
