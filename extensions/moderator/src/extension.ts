import * as vscode from "vscode";

import ModeratorState, {Mode, Modifier} from "./state";

export function activate(context: vscode.ExtensionContext) {
	const state = new ModeratorState();

	context.subscriptions.push(overrideCommand("type", (...args) => {
		state.clearModifiers();
		if (state.isEdit()) {
			vscode.commands.executeCommand("default:type", ...args);
		}
	}));

	context.subscriptions.push(overrideCommand("replacePreviousChar", (...args) => {
		state.clearModifiers();
		if (state.isEdit()) {
			vscode.commands.executeCommand("default:replacePreviousChar", ...args);
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("moderator.switchMode", (mode: Mode) => {
		state.setMode(mode);
		if (vscode.window.activeTextEditor !== undefined) {
			state.syncEditorStyle(vscode.window.activeTextEditor);
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand("moderator.setModifier", (modifier: Modifier) => {
		state.setModifier(modifier);
		if (vscode.window.activeTextEditor !== undefined) {
			state.syncEditorStyle(vscode.window.activeTextEditor);
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand("moderator.resetState", () => {
		state.setMode("navigate");
		state.clearModifiers();
		if (vscode.window.activeTextEditor !== undefined) {
			state.syncEditorStyle(vscode.window.activeTextEditor);
		}
	}));

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
		if (vscode.window.activeTextEditor !== undefined) {
			state.syncEditorStyle(vscode.window.activeTextEditor);
		}
	}));

	context.subscriptions.push(modifierCommand(state, "moderator.cursorLeft", "cursorLeft"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorLeftSelect", "cursorLeftSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorRight", "cursorRight"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorRightSelect", "cursorRightSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorUp", "cursorUp"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorUpSelect", "cursorUpSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorDown", "cursorDown"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorDownSelect", "cursorDownSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorWordLeft", "cursorWordLeft"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorWordLeftSelect", "cursorWordLeftSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorWordRight", "cursorWordRight"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorWordRightSelect", "cursorWordRightSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorHome", "cursorHome"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorHomeSelect", "cursorHomeSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorEnd", "cursorEnd"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorEndSelect", "cursorEndSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorPageUp", "cursorPageUp"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorPageUpSelect", "cursorPageUpSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorPageDown", "cursorPageDown"));
	context.subscriptions.push(modifierCommand(state, "moderator.cursorPageDownSelect", "cursorPageDownSelect"));
	context.subscriptions.push(modifierCommand(state, "moderator.deleteLeft", "deleteLeft"));
	context.subscriptions.push(modifierCommand(state, "moderator.deleteRight", "deleteRight"));
	context.subscriptions.push(modifierCommand(state, "moderator.deleteLines", "editor.action.deleteLines"));
	context.subscriptions.push(modifierCommand(state, "moderator.deleteWordLeft", "deleteWordLeft"));
	context.subscriptions.push(modifierCommand(state, "moderator.deleteWordRight", "deleteWordRight"));
	context.subscriptions.push(modifierCommand(state, "moderator.undo", "default:undo"));
	context.subscriptions.push(modifierCommand(state, "moderator.redo", "default:redo"));
	context.subscriptions.push(modifierCommand(state, "moderator.copy", "editor.action.clipboardCopyAction"));
	context.subscriptions.push(modifierCommand(state, "moderator.cut", "editor.action.clipboardCutAction"));
	context.subscriptions.push(modifierCommand(state, "moderator.paste", "editor.action.clipboardPasteAction"));
	context.subscriptions.push(modifierCommand(state, "moderator.prevTab", "workbench.action.previousEditor"));
	context.subscriptions.push(modifierCommand(state, "moderator.nextTab", "workbench.action.nextEditor"));
	context.subscriptions.push(modifierCommand(state, "moderator.moveTabLeft", "workbench.action.moveEditorLeftInGroup"));
	context.subscriptions.push(modifierCommand(state, "moderator.moveTabRight", "workbench.action.moveEditorRightInGroup"));
	context.subscriptions.push(modifierCommand(state, "moderator.save", "workbench.action.files.save"));
	context.subscriptions.push(modifierCommand(state, "moderator.close", "workbench.action.closeActiveEditor"));
	context.subscriptions.push(modifierCommand(state, "moderator.reopen", "workbench.action.reopenClosedEditor"));
	context.subscriptions.push(modifierCommand(state, "moderator.newFile", "workbench.action.files.newUntitledFile"));
	context.subscriptions.push(modifierCommand(state, "moderator.find", "actions.find"));
	// context.subscriptions.push(modifierCommand(state, "moderator.find", "actions.find"));
	context.subscriptions.push(modifierCommand(state, "moderator.commandPalette", "workbench.action.showCommands"));
	// TODO: toggle comment
	// TODO: indent/outdent
	// TODO: find internal commands
	// TODO: toggle comment
	// TODO: toggle comment
	// TODO: toggle comment
	// TODO: toggle comment
	// TODO: toggle comment
	// TODO: toggle comment

	context.subscriptions.push(vscode.commands.registerCommand("moderator.cursorHalfPageUp", async () => {
		state.clearModifiers();
		if (vscode.window.activeTextEditor !== undefined) {
			cursorMoveHalfPage(vscode.window.activeTextEditor, "up", false);
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand("moderator.cursorHalfPageUpSelect", async () => {
		state.clearModifiers();
		if (vscode.window.activeTextEditor !== undefined) {
			cursorMoveHalfPage(vscode.window.activeTextEditor, "up", true);
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand("moderator.cursorHalfPageDown", async () => {
		state.clearModifiers();
		if (vscode.window.activeTextEditor !== undefined) {
			cursorMoveHalfPage(vscode.window.activeTextEditor, "down", false);
		}
	}));
	context.subscriptions.push(vscode.commands.registerCommand("moderator.cursorHalfPageDownSelect", async () => {
		state.clearModifiers();
		if (vscode.window.activeTextEditor !== undefined) {
			cursorMoveHalfPage(vscode.window.activeTextEditor, "down", true);
		}
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}

function overrideCommand(key: string, callback: (...args: any[]) => any) {
	return vscode.commands.registerCommand(key, (...args) => {
		const activeTextEditor = vscode.window.activeTextEditor;
		if (activeTextEditor === undefined) {
			return;
		}

		if (activeTextEditor.document && activeTextEditor.document.uri.toString() === "debug:input") {
			return vscode.commands.executeCommand("default:" + key, ...args);
		}

		callback(...args);
	});
}

function modifierCommand(state: ModeratorState, key: string, command: string) {
	return vscode.commands.registerCommand(key, (...args) => {
		state.clearModifiers();
		if (vscode.window.activeTextEditor !== undefined) {
			state.syncEditorStyle(vscode.window.activeTextEditor);
		}
		vscode.commands.executeCommand(command, ...args);
	});
}

async function cursorMoveHalfPage(editor: vscode.TextEditor, to: "up" | "down", select: boolean) {
	const lines = editor.visibleRanges.reduce((acc, val) => acc + val.end.line - val.start.line + 1, 0);
	await vscode.commands.executeCommand("cursorMove", {to, value: Math.ceil(lines / 2), select});
}
