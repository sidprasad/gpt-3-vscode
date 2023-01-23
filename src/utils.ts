import * as vscode from 'vscode';

const OPENAI_API_KEY = "OPENAI_API_KEY";
const USER_ID_KEY = "GPT_EXTENSION_USER_ID"


interface Config {
	apiKey: string,
	userid: string,
	organization?: string
}

interface Payload {
	model: string,
	prompt: string,
	max_tokens: number,
	temperature: number,
}

const initAuth = async (context: vscode.ExtensionContext) => {

	let userid = await context.secrets.get(USER_ID_KEY);

	if (!userid) {
		console.log("UserId not previously registered .");
		userid = await setNewUserId(context);
	}

	let apiKey = await context.secrets.get(OPENAI_API_KEY);

	if (!apiKey) {
		console.log("API Key doesn't exist in secret storage");

		apiKey = await setNewAPIKey(context);
	}

	const config: Config = { apiKey, userid };

	return config;
};

const getConfValue = <T = string>(key: string) => vscode.workspace.getConfiguration('GPT').get(key) as T;

const setNewAPIKey = async (context: vscode.ExtensionContext): Promise<string> => {
	const inputBoxOptions = {
		title: "Please enter your OpenAI API Key",
		prompt: "Store your API Key in secret storage",
		password: true,
		ignoreFocusOut: true
	};

	const secret = await vscode.window.showInputBox(inputBoxOptions);

	if (!secret) {
		vscode.window.showWarningMessage('No API Key received.');

		return "";
	}

	await context.secrets.store(OPENAI_API_KEY, secret);

	return secret;
};

const setNewUserId = async (context: vscode.ExtensionContext): Promise<string> => {
	const inputBoxOptions = {
		title: "Please enter your User Id",
		prompt: "UserId",
		password: false,
		ignoreFocusOut: true,
		validateInput : (v: string) => { 
			if (v == null || v.length == 0)
				return "UserId cannot be empty";
			return null;
			}
	};


	const secret = await vscode.window.showInputBox(inputBoxOptions);

	if (!secret) {
		vscode.window.showWarningMessage('No User id received.');

		return "";
	}

	await context.secrets.store(USER_ID_KEY, secret);

	return secret;
};



const buildStatusBarItem = (): vscode.StatusBarItem => {
	const statusBarItem = vscode.window.createStatusBarItem();
	statusBarItem.name = "GPT";
	statusBarItem.text = "Ask GPT $(hubot)";
	statusBarItem.command = "GPT.askGPT";
	statusBarItem.tooltip = "Opens a text input for you to send your message to GPT";

	return statusBarItem;
};

const createPayload = (type: string, prompt: string): Payload => {
	let payload: Payload;

	switch (type) {
		case ("code"):
			payload = {
				"model": getConfValue('codeModel'),
				"prompt": prompt,
				"max_tokens": getConfValue<number>('codeMaxTokens'),
				"temperature": getConfValue<number>('codeTemperature'),
			};
			break;
		case ('text'):
		default:
			payload = {
				"model": getConfValue('model'),
				"prompt": prompt,
				"max_tokens": getConfValue<number>('maxTokens'),
				"temperature": getConfValue<number>('temperature'),
			};
	}
	return payload;
};

const validatePayload = (payload: Payload) => {
	let reason = "";
	let isValid = true;

	if (!payload.temperature || payload.temperature < 0 || payload.temperature > 1) {
		reason = "Temperature must be between 0 and 1, please update your settings";
		isValid = false;
	}

	if (!payload.max_tokens || payload.max_tokens < 1 || payload.max_tokens >= 4000) {
		reason = "Max tokens must be between 1 and 4000, please update your settings";
		isValid = false;
	}

	if (!payload.model) {
		reason = "GPT Model missing, please update your settings";
		isValid = false;
	}
	console.log(`isValid: ${isValid}, reason: ${reason}`);

	return { isValid, reason };
};


export {
	initAuth,
	createPayload,
	validatePayload,
	getConfValue,
	setNewAPIKey,
	buildStatusBarItem,
	Config,
	OPENAI_API_KEY,
	setNewUserId
};