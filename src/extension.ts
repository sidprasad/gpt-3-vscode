import * as vscode from 'vscode';
import { Configuration, OpenAIApi } from "openai";
import {
	initAuth,
	createPayload,
	validatePayload,
	setNewAPIKey,
	setNewUserId,
	buildStatusBarItem,
	Config,
	OPENAI_API_KEY
} from './utils';


import { Logger } from "./logger";
import { config } from 'process';


const COPY_OUTPUT = "Copy Output";


var logger : Logger;

const initOpenAI = (credentials: Config): OpenAIApi => {
	const openaiConfig = new Configuration({
		...credentials
	});

	return new OpenAIApi(openaiConfig);
};

// This method is called when the extension is activated
export async function activate(context: vscode.ExtensionContext) {
	console.log('Activated');

	const credentials = await initAuth(context);
	if (!credentials) {
		deactivate();

		return;
	}

	logger = new Logger(credentials.userid);

	const openai = initOpenAI(credentials);

	const statusBarItem = buildStatusBarItem();

	statusBarItem.show();

	const modalMesesageOptions = {
		"modal": true,
		"detail": "- GPT-3"
	};

	// Create documentation for highlighted code
	let askSelected = vscode.commands.registerCommand('GPT.askSelected', async () => {

		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const selectedText = editor.document.getText(editor.selection);

		if (!selectedText) {
			vscode.window.showWarningMessage('No selected text');
			return;
		}

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Asking GPT about your selected text! $(book)');

		const prompt = selectedText;
		let payload = createPayload('text', prompt);
		let { isValid, reason } = validatePayload(payload);

		if (!isValid) {
			vscode.window.showErrorMessage(reason);
			deactivate();
		};

		const response = await openai.createCompletion({ ...payload });

		const output = response.data.choices[0].text?.trim() || "A response is not available right now.";

		if(response.data.usage?.total_tokens && response.data.usage?.total_tokens >= payload.max_tokens) {
			vscode.window.showErrorMessage(
				`The completion was ${response.data.usage?.total_tokens} tokens and exceeds your max_token value of ${payload.max_tokens}. Please increase your settings to allow for longer completions.`);
		}

		
		// Log the payload AND GPT Response here.
		await logger.info(payload, output);

		// Insert the text at the end of the selection
		editor.edit((editBuilder) => {
			editBuilder.insert(editor.selection.end, `\n/* GPT Response: \n ${output} */\n`);
		});


		statusMessage.dispose();
		statusBarItem.show();
	});

	

	

	// Directly write a prompt for GPT

	let askGPT = vscode.commands.registerCommand('GPT.askGPT', async () => {
		console.log('Running askGPT');

		const inputBoxOptions = {
			"title": "Ask GPT!",
			"prompt": "Enter in the text you would like to send to GPT"
		};

		const prompt = await vscode.window.showInputBox(inputBoxOptions);

		if (!prompt) {
			vscode.window.showWarningMessage('No input received.');
			return;
		}

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Sending to GPT! $(hubot)');

		let payload = createPayload('text', prompt);

		let { isValid, reason } = validatePayload(payload);

		if (!isValid) {
			vscode.window.showErrorMessage(reason);
			deactivate();
		};

		const response = await openai.createCompletion({ ...payload });

		if(response.data.usage?.total_tokens && response.data.usage?.total_tokens >= payload.max_tokens) {
			vscode.window.showErrorMessage(`The completion was ${response.data.usage?.total_tokens} tokens and exceeds your max_token value of ${payload.max_tokens}. Please increase your settings to allow for longer completions.`);
		}

		const output = response.data.choices[0].text?.trim() || "A response is not available right now.";

		let items = [
			{
				"title": COPY_OUTPUT
			}
		];

		const gptResponse = vscode.window.showInformationMessage(output, modalMesesageOptions, ...items);





		// Log the payload AND GPT Response here.
		await logger.info(payload, output);

		gptResponse.then((button) => {
			if (button?.title === COPY_OUTPUT) {
				vscode.env.clipboard.writeText(output);
			}
		});

		statusMessage.dispose();
		statusBarItem.show();
	});

	// Update OpenAI API Key
	let updateAPIKey = vscode.commands.registerCommand('GPT.updateAPIKey', async () => {
		console.log('Running updateAPIKey');

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Securely storing your API Key $(pencil)');

		await setNewAPIKey(context);

		statusMessage.dispose();
		statusBarItem.show();
	});

	// Remove OpenAI API Key
	let removeAPIKey = vscode.commands.registerCommand('GPT.removeAPIKey', async () => {
		console.log('Running removeAPIKey');

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Securely REMOVING your API Key $(error)');

		await context.secrets.delete(OPENAI_API_KEY);

		statusMessage.dispose();
		statusBarItem.show();
	});


	// Update OpenAI API Key
	let updateUserId = vscode.commands.registerCommand('GPT.updateUserId', async () => {

		statusBarItem.hide();
		const statusMessage = vscode.window.setStatusBarMessage('$(heart) Securely storing your API Key $(pencil)');

		await setNewUserId(context);

		statusMessage.dispose();
		statusBarItem.show();
	});
	



	context.subscriptions.push(
		askSelected,
		askGPT,
		updateAPIKey,
		removeAPIKey
	);
};

// This method is called when your extension is deactivated
export function deactivate() { }
