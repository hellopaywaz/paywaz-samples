# Contributing to Paywaz

First off — thank you for your interest in contributing to Paywaz!  
Our ecosystem powers **zero-fee payments**, **stablecoin infrastructure**, and **developer-first APIs/SDKs**.  
We welcome improvements, bug fixes, documentation updates, and new sample integrations.

This document explains how to contribute and what we expect from contributors.

---

## Ways You Can Contribute

- Report bugs or issues  
- Suggest features or improvements  
- Submit pull requests for fixes or enhancements  
- Improve documentation  
- Add sample integrations or SDK upgrades  
- Improve developer experience (DX), tooling, or testing

---

## Repository Structure

We maintain several public repos:

- `paywaz-public-api` — API schemas, references, and public interface definitions  
- `paywaz-sdk-js` — JavaScript/TypeScript SDK  
- `paywaz-docs` — developer documentation and guides  
- `paywaz-samples` — integration samples  
- `paywaz-license` — licensing information  

Each repo may have repo-specific instructions in its README.

---

## Development Workflow

### 1. Fork the repo  
Click **Fork** in the top-right corner of the GitHub repo.

### 2. Create a feature branch  

git checkout -b feature/your-feature-name

### 3. Make your changes  
Please follow:
- existing code style  
- naming conventions  
- project folder structure  
- TypeScript / JS linting rules (if applicable)

### 4. Write tests (if applicable)  
PRs without tests may not be accepted for core SDK repos.

### 5. Commit with clear messages  

git commit -m "feat: add X"
git commit -m "fix: correct Y"
git commit -m "docs: improve Z"

### 6. Submit your Pull Request  
Ensure your PR includes:
- A clear explanation of the change  
- Linked issue numbers  
- Steps to reproduce or test  
- Any screenshots if UI or docs-related  

The Paywaz team will review your PR and may request revisions.

---

## Testing & Quality

SDK repos require:
- Unit tests  
- Linting  
- Type definitions  

Docs repos require:
- No broken links  
- Accurate descriptions  
- Proper formatting and structure  

Samples repos require:
- Clear README per sample  
- Minimal dependencies  
- Secure handling of API keys

---

## Licensing Agreement

By submitting a pull request, you agree that your contributions fall under the **Paywaz License** contained in:  
https://github.com/hellopaywaz/paywaz-license

---

## Questions? Need help?

Open a discussion or issue, or reach out at:  
**hello@paywaz.com**

Thank you again for contributing to the Paywaz ecosystem!  
Your improvements help power the next generation of zero-fee global payments.
