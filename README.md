# GPT-3 Visual Studio Code Extension


Allows you to write to GPT-3 from your editor. Built for use at courses at Brown University.


---

## Requirements


- Your [OpenAI API key](https://beta.openai.com/account/api-keys)

- Your Brown-provided user id.

--- 


When the extension is installed, a prompt will appear for you to enter in your API key and your user id.

This extension uses secret storage for API keys.

---


## Functionality
### Ask GPT
Sends user input to GPT for processing. The response will appear in a modal.

> Default key binding set to `alt + g` (Windows) or `cmd + g` (Mac)

> Ask GPT in the Status Bar

### Ask GPT inline
Queries GPT-3 with highlighted text. The response is automatically injected **below** the highlighted docs.

> Default key binding set to `alt + q` (Windows) or `cmd + q` (Mac)

---

## Extension Settings
`Settings` > `Extensions` > `GPT`

---

## Reset API Key

> - Open command palette and run `Update OpenAI API Key` (alt + m on Windows, cmd + m on Mac)
> - Enter your correct API Key into the prompt 
> - Reload the window

## Reset UserId

> - Open command palette and run `Update UserId` (alt + u on Windows, cmd + u on Mac)
> - Enter your correct UserId into the prompt 
> - Reload the window
---
