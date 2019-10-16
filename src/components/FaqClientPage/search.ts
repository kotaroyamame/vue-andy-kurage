
import resource from './resource';
import { ScriptMatchingManager } from './libs/qaRetrieval';
declare var window: any;
export class Search {
	readyPromise: any = null;
	resource: any;
	scriptMatchingManager: any;
	constructor(scriptPackage: any) {
		this.scriptMatchingManager = new ScriptMatchingManager({
			matchingScript: scriptPackage.script,
			invertedIndex: scriptPackage.inverted_index,
			keywordVariationsDict: scriptPackage.synonym_dict,
			invPostProbDist: scriptPackage.script_by_id,
			categoryData: scriptPackage.talk_script.body,
		});
	}
	cleanText(text: any) {
		return (
			text &&
			text
				.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s: any) => {
					return String.fromCharCode(s.charCodeAt(0) - 65248);
				})
				.toLowerCase()
		);
	}
	searchScore(searchText: any) {
		if (searchText) {
			return this.scriptMatchingManager.search(
				this.cleanText(searchText)
			);
		} else {
			return [];
		}
	}
	async search(searchText: any) {
		if (searchText) {
			return this.scriptMatchingManager.getSearchResult(
				this.cleanText(searchText)
			);
		} else {
			return ['170', '550', '588', '602', '503'];
		}
	}
}

// export const search = new Search(resource);

