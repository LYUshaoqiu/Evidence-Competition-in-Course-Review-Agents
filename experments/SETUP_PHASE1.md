# Phase 1 setup: DeepSeek-backed experiments

## 1. Keep the credential private

`关键工具.txt` is ignored by `.gitignore`. Do not paste its contents into code, reports, prompts, issue trackers, or chat messages. The experiment needs the **API key only**; a DeepSeek account password is not an API runtime dependency.

Create a local `.env` file from the template using the command in step 2, then manually paste only the API key. Set `DEEPSEEK_API_KEY=...`. Leave the default base URL and model names unchanged for the first run.

## 2. Install the minimal Python environment

Python 3.13 is already installed. You are currently in the `project/paper1_experiments` directory, so run:

```powershell
python -m pip install --upgrade pip
python -m pip install -r .\requirements-phase1.txt
```

Then create the local credential file from the same directory:

```powershell
Copy-Item .\.env.example .\.env
notepad .\.env
```

If you later run commands from the workspace root (`C:\Users\MSN\Desktop\unsw\6441`), use `project\paper1_experiments\requirements-phase1.txt` and `project\paper1_experiments\.env.example` instead.

No local model, CUDA, GPU, Ollama, or PyTorch is required. The API client calls DeepSeek over HTTPS, so the only external resource required is network access to `api.deepseek.com:443` and sufficient API credit.

## 3. Intended model allocation

- `deepseek-v4-flash`: controlled review generation and direct/retrieval summary runs.
- `deepseek-v4-pro`: small blinded judge/audit sample only, not the main generation workload.

The current official API supports the OpenAI-compatible base URL `https://api.deepseek.com`. Use `deepseek-v4-flash` or `deepseek-v4-pro`, rather than the legacy `deepseek-chat` or `deepseek-reasoner` names, which are scheduled for retirement on 2026-07-24.

## 4. What happens next

After installation, I will add a credential-safe API smoke test, deterministic request/retry logging, synthetic-review generation with audit manifests, and the three planned agent pipelines. The smoke test will make one minimal paid API request and will write neither the key nor raw credentials to disk.
