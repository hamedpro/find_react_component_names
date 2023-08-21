#!/usr/bin/env node
import { execSync } from "child_process";
import { readFileSync } from "fs";
import cliProgress from "cli-progress";
import inquirer from "inquirer";
import yargs from "yargs";
import { find_unique_items } from "./helpers.js";
var args = yargs(process.argv).argv;
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

	component_names = find_unique_items(component_names);
	var selected_component_names = [];
	for (var component_name of component_names) {
		var { accepted } = await inquirer.prompt([
			{ name: "accepted", type: "confirm", message: `do you want <${component_name} /> ? ` },
		]);
		if (accepted) {
			selected_component_names.push(component_name);
		}
	}
	selected_component_names.forEach((component_name) => console.log(component_name));
}
main();
