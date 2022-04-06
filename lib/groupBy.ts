export default function groupBy<TItem, TKey>(
	list: TItem[],
	keyGetter: (arg: TItem) => TKey
): { name: TKey; value: TItem[] }[] {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection: TItem[] = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});
	return Array.from(map, ([name, value]) => ({ name, value }));
}
