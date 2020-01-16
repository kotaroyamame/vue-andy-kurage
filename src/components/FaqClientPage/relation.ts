const limitWith = (base: any, limit: any) => {
	if (typeof limit !== 'number') {
		return base;
	} else {
		return Math.min(base, limit);
	}
};

export const getSelectionPosition = ({ items }: any) => {
	const item = items && items.querySelector('.selected');
	return item ? item.offsetTop + item.clientHeight / 2 : null;
};

export const updateRelation = ({
	items,
	prevLocal,
	currentLocal,
	scrollAnchor,
	anchor,
	getRelation,
	disable,
}: any) => {
	if (!prevLocal || prevLocal.selectedPosition == null || disable) {
		if (scrollAnchor) {
			scrollAnchor.style.display = 'none';
		}
		if (anchor) {
			anchor.style.display = 'none';
		}
		return;
	}
	const scrollAnchorTop =
		currentLocal.scrollPosition -
		prevLocal.scrollPosition +
		prevLocal.selectedPosition;
	const anchorTop = prevLocal.selectedPosition - prevLocal.scrollPosition;

	let containsSelected = false;
	if (items) {
		for (let itemIndex = 0; itemIndex < items.children.length; itemIndex += 1) {
			const item = items.children[itemIndex];
			const isSelected = item.classList.contains('selected');
			if (isSelected) {
				containsSelected = true;
			}
			const itemHeight = item.clientHeight;
			const itemOffset = item.offsetTop - scrollAnchorTop + itemHeight / 2;
			const relation = getRelation(item);
			if (itemOffset > 0) {
				// lower
				item.classList.add('lower');
				item.classList.remove('upper');
				const prevItem = items.children[itemIndex - 1];
				relation.style.bottom = itemHeight / 2 + 'px';
				relation.style.top = 'auto';
				relation.style.height =
					limitWith(
						itemOffset,
						!isSelected &&
						prevItem &&
						prevItem.clientHeight / 2 + itemHeight / 2 + 30
					) + 'px';
			} else {
				// upper
				item.classList.add('upper');
				item.classList.remove('lower');
				const nextItem = items.children[itemIndex - 1];
				relation.style.top = itemHeight / 2 + 'px';
				relation.style.bottom = 'auto';
				relation.style.height =
					limitWith(
						-itemOffset,
						!isSelected &&
						nextItem &&
						nextItem.clientHeight / 2 + itemHeight / 2 + 30
					) + 'px';
			}
		}
		if (scrollAnchor) {
			if (items.length <= 1) {
				scrollAnchor.style.display = 'none';
			} else {
				scrollAnchor.style.display = 'block';
				scrollAnchor.style.top = scrollAnchorTop + 'px';
			}


		}
		if (anchor) {
			anchor.style.display = 'block';
			anchor.style.top = anchorTop + 'px';
			if (containsSelected) {
				anchor.classList.add('selected');
			} else {
				anchor.classList.remove('selected');
			}
		}
	}
};
