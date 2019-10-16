import resource from './resource';
declare var window: any;
export class TalkScript {
	readyPromise: any = null;
	talkScripts: any;
	mapByParentId: any;
	mapById: any;
	mapByScriptId: any;
	categoryMap: any = {};
	categories: any;
	constructor() {
	}
	getList() {
		// await this.ready();
		return this.talkScripts;
	}
	list() {
		// await this.ready();
		return this.talkScripts;
	}
	listByParentId(parentId: any) {
		// await this.ready();
		return this.mapByParentId[parentId || '#'];
	}

	get(id: any) {
		if (this.mapById && this.mapById[id]) {
			return this.mapById[id];
		}

		if (this.mapByScriptId && this.mapByScriptId[id]) {
			return this.mapByScriptId[id];
		}
	}
	getSync(id: any) {
		return this.mapById && this.mapById[id];
	}
	/* eslint-disable no-sync */
	getSyncWithAncesters(id: any) {
		const target = this.getSync(id);
		if (target && !target.ancesters) {
			target.ancesters = [];
			for (
				let current = this.getSync(target.parent);
				current;
				current = this.getSync(current.parent)
			) {
				target.ancesters.unshift(current);
			}
		}
		return target;
	}

	prepare(data: any) {
		// const data = await this.resource.ready();
		const talkScripts = data.talk_script.body;
		const mapByParentId: any = {};
		const mapById: any = {};
		const mapByScriptId: any = {};
		for (const item of talkScripts) {
			if (!mapByParentId[item.parent]) {
				mapByParentId[item.parent] = [];
			}
			mapByParentId[item.parent].push(item);
			mapById[item.id] = item;
			if (item.items && item.items.log_faq) {
				mapByScriptId[item.items.log_faq] = item;
			}
		}
		this.talkScripts = talkScripts;
		this.mapByParentId = mapByParentId;
		this.mapById = mapById;
		this.mapByScriptId = mapByScriptId;
		for (const item of talkScripts) {
			const keywords = new Set();
			for (const question of item.questions || []) {
				for (const keyword of question.split(',')) {
					keywords.add(keyword);
				}
			}
			item.keywords = keywords;

		}
		const categoryMap: any = {};
		for (const item of talkScripts) {
			this.getSyncWithAncesters(item.id);
			if (item.type === 'node' && item.ancesters.length === 0) {
				categoryMap[item.title] = categoryMap[item.title] || [];
				categoryMap[item.title].push(item);
			}
		}
		this.categoryMap = categoryMap;
		this.categories = Object.values(categoryMap).map((items: any, index: number) => ({
			id: 'category' + index,
			title: items[0].title,
			items,
		}));
	}
	// async filterList({ selectedTagSet, byStep, searchText }) {
	//   console.log('searchText', searchText);
	//   await this.ready();
	//   let lastNodeTag = null;
	//   const selectedKeywordTags = [];
	//   for (const tag of selectedTagSet) {
	//     if (tag.type === 'node') {
	//       lastNodeTag = tag;
	//     } else if (tag.type === 'keyword') {
	//       selectedKeywordTags.push(tag);
	//     }
	//   }
	//   const list = searchText
	//     ? (await search.search(searchText)).map(id => this.getSync(id))
	//     : this.talkScripts;

	//   const filteredList = list.filter(item => {
	//     return (
	//       item.type === 'leaf' &&
	//       (!lastNodeTag ||
	//         item.ancesters.some(_ancester => _ancester.id === lastNodeTag.id)) &&
	//       selectedKeywordTags.every(tag => item.keywords.has(tag.title))
	//     );
	//   });
	//   return filteredList;
	// }

	// async getCandidateTags({ selectedTagSet, list }) {
	//   await this.ready();
	//   if (!list) {
	//     return [];
	//   }
	//   const keywordMap = {};
	//   const anscesterSet = new Set();
	//   for (const item of list) {
	//     // if (item.type === 'leaf') {
	//     for (const keyword of item.keywords) {
	//       keywordMap[keyword] = keywordMap[keyword] || [];
	//       keywordMap[keyword].push(item);
	//     }
	//     for (const anscester of item.ancesters) {
	//       anscesterSet.add(anscester);
	//     }
	//     // }
	//   }

	//   const categoryTags = firstCategory(
	//     anscesterSet,
	//     item => item.ancesters.length
	//   );
	//   const keywordTags = Object.entries(keywordMap)
	//     .filter(
	//       ([keyword, items]) => items.length < list.length && items.length > 1
	//     )
	//     .sort((a, b) => b[1].length - a[1].length)
	//     .map(([keyword, items]) => ({
	//       id: 'keyword:' + keyword,
	//       type: 'keyword',
	//       title: keyword,
	//       items,
	//     }))
	//     .slice(0, 20);
	//   return categoryTags.concat(keywordTags);
	// }
}

// const talkScript = new TalkScript(resource);
// window.talkScript = talkScript;
// export default talkScript;
