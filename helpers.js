export function find_unique_items(array) {
	return array.filter((item, index) => {
		return array.indexOf(item) === index;
	});
}
