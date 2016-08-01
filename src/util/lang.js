export function extend(target, source) {
	for (var key in source) {
		target[key] = source[key];
	}
};