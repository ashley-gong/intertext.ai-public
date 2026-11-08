## Augmented Close Reading for Classical Latin using AI for Intertextual Exploration

> **Status: archived snapshot.** This is the code as used for the thesis (2024–25), shared for research. It is not maintained or deployed. Dependency files are pinned to the thesis-era versions and are out of date with known vulnerabilities, so don't deploy it publicly; to run it locally, use an isolated environment. The server only directly needs Flask, Flask-Cors, gunicorn, requests, numpy, torch, transformers, stanza, cltk, tensor2tensor, tensorflow and pinecone; `server/requirements.txt` is a mostly unrelated `pip freeze`.
>
> **Known issues:** `client/utils/api.js` points at `api.ai-latin-close-reading.online`, which is no longer ours, so change it before running the client. In `server/server.py`, both `index.query` filters repeat the `"token"` key, so the `[CLS]`/`[SEP]`/punctuation exclusion is silently dropped; merge both lists into one `$nin`.

Ashley Gong, senior thesis, Harvard CS and Classics, 2024-2025.

Paper: [*Augmented Close Reading for Classical Latin using AI for Intertextual Exploration*](https://aclanthology.org/2025.nlp4dh-1.35/), NLP4DH 2025, co-located with NAACL.

Intertextuality is a critical literary concept in the analysis of Latin texts from classical antiquity. Given the emergence of artificial intelligence (AI) in digital humanities for the Classics and the potential to bridge technology with the process of close reading, this project contributes a novel interface combining Latin BERT (Bamman and Burns 2020), a pre-trained BERT model fine-tuned on classical Latin texts, and design choices from popular online Latin reading platforms.
