# GPT-3 Visual Studio Code Extension


Allows you to write to GPT-3 from your editor. Built for use at courses at Brown University.


---

## Requirements


- Your [OpenAI API key](https://beta.openai.com/account/api-keys)

- Your Brown-provided user id.

--- 
## Install the extension

[Marketplace page](https://marketplace.visualstudio.com/items?itemName=Arrendy.gpt3-vscode-extension)

When the extension is installed, a prompt will appear for you to enter in your API key and your user id.

This extension uses secret storage for API keys.

---


## Functionality
### Ask GPT
Sends user input to GPT for processing. The response will appear in a modal.

> Default key binding set to `alt + g`

> Ask GPT in the Status Bar

### Ask GPT inline
Queries GPT-3 with highlighted text. The response is automatically injected **below** the highlighted docs.

> Default key binding set to `alt + q`

---

## Extension Settings
`Settings` > `Extensions` > `GPT`

---

## FAQ
👽 How can I reset my API key if I entered the wrong one?

> - Open command palette and run `Update OpenAI API Key`
> - Enter your correct API Key into the prompt 
> - Reload the window
---


## TODO:

Similar functionality for UserId.