import glslCompletionJson from "./glslCompletion.json"  assert {type: "json"};

export function glslCompletion(context) {
	let before = context.matchBefore(/\w+/)
	// If completion wasn't explicitly started and there
	// is no word before the cursor, don't open completions.
	if (!context.explicit && !before || before.text.length < 2) return null
	return {
		from: before ? before.from : context.pos,
		options: glslCompletionJson,
		validFor: /^\w*$/
	}
}

