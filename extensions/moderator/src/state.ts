import * as vscode from "vscode";

export type Mode = "navigate" | "edit";
export type Modifier = "g" | "v";
export default class ModeratorState {
	private mode!: Mode;
	private modifier: Modifier | null;

	constructor() {
		this.setMode("edit");
		this.modifier = null;
		this.clearModifiers();
	}

	public isEdit() {
		return this.mode === "edit";
	}

	public setMode(mode: Mode) {
		this.mode = mode;
		vscode.commands.executeCommand("setContext", "moderator.mode", mode);
	}

	public setModifier(modifier: Modifier) {
		this.modifier = modifier;
		vscode.commands.executeCommand("setContext", "moderator.modifier", modifier);
	}

	public clearModifiers() {
		this.modifier = null;
		vscode.commands.executeCommand("setContext", "moderator.modifier", null);
	}

	public syncEditorStyle(editor: vscode.TextEditor) {
		if(editor.document.isClosed) {
			return;
		}

		switch (this.mode) {
			case "navigate": editor.options.cursorStyle = vscode.TextEditorCursorStyle.Block; break;
			case "edit": editor.options.cursorStyle = vscode.TextEditorCursorStyle.Line; break;
		}

		const configuration = vscode.workspace.getConfiguration("workbench");
		switch (this.modifier) {
			case "g": configuration.update("colorCustomizations", {"editorCursor.foreground": "#FF00FF"}, true); break;
			case "v": configuration.update("colorCustomizations", {"editorCursor.foreground": "#FFFF00"}, true); break;
			case null: configuration.update("colorCustomizations", {"editorCursor.foreground": undefined}, true); break;
		}
	}
}