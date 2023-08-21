#!/usr/bin/env node
import { execSync } from "child_process";
import { readFileSync } from "fs";
import cliProgress from "cli-progress";
import readline from "readline/promises";
import inquirer from "inquirer";

export async function main() {
	var files = execSync("git ls-tree -r main --name-only")
		.toString()
		.split("\n")
		.filter((i) => i && i.endsWith(".jsx"));
	var component_names = [];
	const progress_bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
	progress_bar.start(files.length, 0);
	files.forEach((filename, index) => {
		var my_regex = /<(?<component_name>[A-Z]{1}[A-Za-z0-9]*)/g;
		var regex_output = readFileSync(filename, "utf8").matchAll(my_regex);

		for (var output of regex_output) {
			component_names.push(output.groups?.component_name);
		}

		progress_bar.update(index + 1);
	});
	progress_bar.stop();

	var selected_component_names = [];
	for (var component_name of component_names) {
		var line = await inquirer.prompt(`do you want <${component_name} /> ? `);
		console.log(line);
		if (line === "y") {
			selected_component_names.push(component_name);
		}
	}
	selected_component_names.forEach((component_name) => console.log(component_name));
}
main();
