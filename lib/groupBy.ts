type NotArray<T> = T;

export default function groupBy<TItem, TKey>(
	list: TItem[],
	keyGetter: (arg: TItem) => TKey | TKey[]
): { name: TKey; value: TItem[] }[] {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);

		function setValueOrPush(singleKey) {
			const collection: TItem[] = map.get(singleKey);
			if (!collection) {
				map.set(singleKey, [item]);
			} else {
				collection.push(item);
			}
		}

		if (Array.isArray(key)) {
			key.forEach((singleKey) => setValueOrPush(singleKey));
		} else {
			setValueOrPush(key);
		}
	});
	return Array.from(map, ([name, value]) => ({ name, value }));
}
