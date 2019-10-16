// decleare module '';
const tinySegmenter = require('./tinySegmenter.js');
const defaultEstimatorWeightNormalizationFactor = {
	nbss: 2.21,
	edss: 30,
	tiss: 2.73,
	ngss: 0.38,
}
class BaseScriptSearch {
	public stopWords = [
		'　',
		' ',
		'の',
		'が',
		'れ',
		'なっ',
		'しまっ',
		'すれ',
		'い',
		'なら',
		'どう',
		'せる',
		'する',
		'こと',
		'でき',
		'はいつ',
		'ため',
		'時',
		'なり',
		'かけ',
		'すぐ',
		'し',
		'する',
		'できる',
		'いる',
		'した',
		'ある',
		'さ',
		'はどこか',
		'場合',
	];
	public sortedKeywordVariationsDict: any = [];
	constructor(public scriptData: any) {


		try {
			this.sortedKeywordVariationsDict = Object.keys(
				this.scriptData.keywordVariationsDict
			)
				.filter(k => {
					return !!(k && this.scriptData.keywordVariationsDict[k])
				})
				.map(k => {
					return { key: k, value: this.scriptData.keywordVariationsDict[k] }
				})
				.sort((a, b) => {
					return b.key.length - a.key.length
				})
		} catch (e) {
			console.log(e)
		}
	}
	public search(query = '') { }
	public createModel(sentences: any, labels: any) { }
	public saveModel() { }
	protected _sortScore(scores: any) {
		return scores
			.filter((o: any, i: any, a: any) => {
				let max = 0
				let maxI = 0
				a.forEach((_o: any, _i: any, _a: any) => {
					if (o.id == _o.id) {
						max = Math.max(max, _o.weight)
						if (max <= _o.weight) {
							maxI = _i
						}
					}
				})
				return max == o.weight && maxI == i
			})
			.sort((a: any, b: any) => {
				if (a.weight > b.weight) {
					return -1
				} else if (a.weight == b.weight) {
					return 0
				}
				return 1
			})
	}
}
class NaiveBayesScriptSearch extends BaseScriptSearch {
	constructor(public scriptData: any) {
		super(scriptData)

	}
	search(query = '') {
		console.log('this.scriptData:::')
		console.log(this.scriptData)
		let tempScores: any = {};
		let kw_count: any = 0;
		let inverted_post_prob: any = this.scriptData.invPostProbDist.inverted_post_prob;
		let default_post_prob: any = this.scriptData.invPostProbDist.default_post_prob;
		for (let kw in inverted_post_prob) {
			if (this._checkStopWords(kw)) {
				continue
			}
			if (query.indexOf(kw) != -1) {
				kw_count++
				// Object.keys(tempScores).concat(Object.keys(inverted_post_prob[kw])).filter(function(el,idx,arr) {return arr.indexOf(el) === idx;})
				new Set(
					Object.keys(tempScores).concat(Object.keys(inverted_post_prob[kw]))
				).forEach(sid => {
					if (sid in inverted_post_prob[kw] && sid in tempScores) {
						tempScores[sid] +=
							inverted_post_prob[kw][sid] - default_post_prob[sid]
					} else if (sid in inverted_post_prob[kw] && !(sid in tempScores)) {
						tempScores[sid] =
							inverted_post_prob[kw][sid] - default_post_prob[sid]
					} else if (!(sid in inverted_post_prob[kw]) && sid in tempScores) {
						tempScores[sid] += 0
					}
				})
			}
		}
		let scores = []
		for (let sidx in tempScores) {
			scores.push({ id: sidx, weight: tempScores[sidx] })
		}
		let result = this._sortScore(scores)
		return result
		// return scoreArray.filter(o=>o.weight>0);
	}
	_checkStopWords(word = '') {
		if (this.stopWords.indexOf(word) != -1) {
			return true
		}
		return false
	}
}

class TFIDFScriptSearch extends BaseScriptSearch {
	constructor(public scriptData: any) {
		super(scriptData);
	}
	_formVocabulary(text = '') {
		let vocabulary = [];
		for (let word in this.scriptData.keywordVariationsDict) {
			if (text.indexOf(word.toLowerCase()) != -1) {
				vocabulary.push(
					this.scriptData.keywordVariationsDict[word].toLowerCase()
				)
			}
		}
		for (let word in this.scriptData.invertedIndex) {
			if (text.indexOf(word) != -1) {
				vocabulary.push(word)
			}
		}
		return [...new Set(vocabulary)]
	}
	search(query = '') {
		let vocabulary: any = this._formVocabulary(query);
		let tempScores: any = {};
		for (let i = 0; i < vocabulary.length; i++) {
			if (vocabulary[i] in this.scriptData.invertedIndex) {
				let key = vocabulary[i]
				try {
					for (
						let j = 0;
						j < this.scriptData.invertedIndex[key].scripts.length;
						j++
					) {
						let matched_script_idx = this.scriptData.invertedIndex[key]
							.scripts[j][0]
						tempScores[matched_script_idx] =
							(tempScores[matched_script_idx] || 0) +
							this.scriptData.invertedIndex[key].weight
					}
				} catch (e) {
					console.log(e)
					continue
				}
			}
		}
		let scores = []
		for (let sidx in tempScores) {
			let numOfKeywords = this.scriptData.matchingScript[sidx].num_of_keywords
			let normalizedScore = tempScores[sidx] / numOfKeywords
			scores.push({
				id: this.scriptData.matchingScript[sidx].id,
				weight: normalizedScore,
			})
		}
		// result = this._sortScore(score)
		let result = this._sortScore(scores)
		return result
	}
}
class EditDistanceScriptSearch extends BaseScriptSearch {
	constructor(public scriptData: any) {
		super(scriptData)

	}
	search(query = '') {
		let tempScores: any = {};
		if (this.scriptData.categoryData) {
			for (let i = 0; i < this.scriptData.categoryData.length; i++) {
				if (this.scriptData.categoryData[i].type != 'leaf') {
					continue
				}
				let distanceSimilarity =
					(1 -
						(this._levenshteinDistance(
							query,
							this.scriptData.categoryData[i].text.toLowerCase()
						) *
							2) /
						(this.scriptData.categoryData[i].text.length + query.length)) *
					100
				if (distanceSimilarity > 30) {
					if (
						!(
							this.scriptData.categoryData[i].id in tempScores &&
							distanceSimilarity >
							tempScores[this.scriptData.categoryData[i].id]
						)
					) {
						tempScores[
							this.scriptData.categoryData[i].id
						] = this.scriptData.categoryData[i].weight = distanceSimilarity;
					}
				}
			}
		}
		let scores = [];
		for (let sid in tempScores) {
			scores.push({ id: sid, weight: tempScores[sid] });
		}
		let result = this._sortScore(scores);
		return result;
	}
	_levenshteinDistance(str1 = '', str2 = '') {
		var x: any = str1.length
		var y: any = str2.length
		var d:any = []
		for (var i = 0; i <= x; i++) {
			d[i] = []
			d[i][0] = i
		}
		for (var i = 0; i <= y; i++) {
			d[0][i] = i
		}
		var cost = 0
		for (var i = 1; i <= x; i++) {
			for (var j = 1; j <= y; j++) {
				cost = str1[i - 1] == str2[j - 1] ? 0 : 1
				d[i][j] = Math.min(
					d[i - 1][j] + 1,
					d[i][j - 1] + 1,
					d[i - 1][j - 1] + cost
				)
			}
		}
		return d[x][y]
	}
}
class NGramScriptSearch extends BaseScriptSearch {
	scriptTitleNgram: Array<any> = [];
	segmenter = new tinySegmenter.TinySegmenter();
	constructor(public scriptData: any) {
		super(scriptData);
		if (this.scriptData.categoryData) {
			for (let i = 0; i < this.scriptData.categoryData.length; i++) {
				if (this.scriptData.categoryData[i].type != 'leaf') {
					continue
				}
				let textWakati = this.segmenter.segment(
					this.scriptData.categoryData[i].text
				)
				// let ngram = new Set( this._agglomerateWordList(this._replaceWithRepresentativeWords(textWakati)));
				try {
					let ngram = new Set(this._replaceWithRepresentativeWords(textWakati))
					this.scriptTitleNgram.push({
						id: this.scriptData.categoryData[i].id,
						ngram: ngram,
					})
				} catch (e) {
					console.log(e)
				}
			}
		}
	}
	_replaceWithRepresentativeWords(words = []) {
		return words
			.map((w: any) => {
				let lowerW = w.toLowerCase()
				return lowerW in this.scriptData.keywordVariationsDict
					? this.scriptData.keywordVariationsDict[lowerW]
					: lowerW
			})
			.filter(w => {
				return this.stopWords.indexOf(w) == -1
			})
	}
	_agglomerateWordList(words: any, start = 0, end = 5) {
		let output = []
		for (let n = start; n < words.length; n++) {
			if (n >= end) {
				break
			}
			for (
				let start_index = 0;
				start_index < words.length - n;
				start_index++
			) {
				output.push(words.slice(start_index, start_index + n + 1).join(''))
			}
		}
		return output
	}
	search(query = '') {
		let queryWakati = this.segmenter.segment(query)
		let queryNgram = new Set(
			this._replaceWithRepresentativeWords(queryWakati)
		)
		// let queryNgram = new Set(queryWakati);
		let tempScores: any = {}
		for (let i = 0; i < this.scriptTitleNgram.length; i++) {
			let currentScriptNgram = this.scriptTitleNgram[i].ngram
			// console.log(currentScriptNgram);
			let intersect = new Set(
				[...currentScriptNgram].filter(i => queryNgram.has(i))
			)
			let score =
				(intersect.size * 2) / (queryNgram.size + currentScriptNgram.size)
			if (score > 0) {
				tempScores[this.scriptTitleNgram[i].id] =
					(intersect.size * 2) / (queryNgram.size + currentScriptNgram.size)
			}
		}
		let scores: any = []
		for (let sid in tempScores) {
			scores.push({ id: sid, weight: tempScores[sid] })
		}
		let result: any = this._sortScore(scores)
		return result
	}
	_formVocabulary(text: string = '') {
		let vocabulary: any = []
		for (let word in this.scriptData.keywordVariationsDict) {
			if (text.indexOf(word.toLowerCase()) != -1) {
				vocabulary.push(
					this.scriptData.keywordVariationsDict[word].toLowerCase()
				)
			}
		}
		for (let word in this.scriptData.invertedIndex) {
			if (text.indexOf(word) != -1) {
				vocabulary.push(word)
			}
		}
		return [...new Set(vocabulary)]
	}
}
export class ScriptMatchingManager {
	threshold = 0.3;
	nbss: any;
	edss: any;
	tiss: any;
	ngss: any;

	constructor(public scriptData: any) {
		this.nbss = new NaiveBayesScriptSearch(scriptData);
		this.edss = new EditDistanceScriptSearch(scriptData);
		this.tiss = new TFIDFScriptSearch(scriptData);
		this.ngss = new NGramScriptSearch(scriptData);
	}
	_aggregateScores(scores: any) {
		console.info(scores)
		const estimatorWeightNormalizationFactor: any = defaultEstimatorWeightNormalizationFactor;
		const aggregatedScore: any = {};
		for (const key in scores) {
			for (let i = 0; i < scores[key].length; i++) {
				aggregatedScore[scores[key][i].id] =
					(aggregatedScore[scores[key][i].id] || 0) +
					scores[key][i].weight / estimatorWeightNormalizationFactor[key]
			}
		}
		const finalScores = []
		for (const sid in aggregatedScore) {
			finalScores.push({ id: sid, weight: aggregatedScore[sid] })
		}
		return finalScores.sort((a, b) => {
			if (a.weight > b.weight) {
				return -1
			} else if (a.weight == b.weight) {
				return 0
			}
			return 1
		})
	}
	testSearch(testQueries: any = []) {
		// testQueries = ["カメラが欲しい","スクリーンショットのとり方","バーコードエラーになるのですが","PCが重いです","電話機のディスプレイ","i-Tab","タブレットのアップデートが","カメラ","彦根","boss つながらない","pdf 開けない","ネット つながらない","boss モニター","土浦","総務部","一条ムービーズ","見積","加工依頼　ロック","ネットに","パソコン","パソコンの画面","ネット 開かない","ブラウザに関する","ネット　つながらない","インターネットに繋がらない","タブレットの充電","印刷機が","連絡先","Ieがうまく開かない","カメラ","ブラウザに関する質","ブラウザに関する","ネットが","ブラウザに関す","タブレットのロック","pcの移行","タブレットの充電器","パソコンが立ち上がらない","カメラが欲しい","スクリーンショットのとり方","pcが暗い","ｐｃ暗い","印刷できない"];
		let start_ms: any = new Date().getTime()
		const testReuslt: any = {};
		for (const tq of testQueries) {
			start_ms = new Date().getTime()
			const nbssScore: any = this.nbss.search(tq)
			console.log('nbss:' + (new Date().getTime() - start_ms).toString())
			start_ms = new Date().getTime()
			const edssScore: any = this.edss.search(tq)
			console.log('edss:' + (new Date().getTime() - start_ms).toString())
			start_ms = new Date().getTime()
			const tissScore = this.tiss.search(tq)
			console.log('tiss:' + (new Date().getTime() - start_ms).toString())
			start_ms = new Date().getTime()
			const ngssScore: any = this.ngss.search(tq)
			console.log('ngss:' + (new Date().getTime() - start_ms).toString())
			const scores: any = {
				nbss: nbssScore,
				edss: edssScore,
				tiss: tissScore,
				ngss: ngssScore,
			}
			testReuslt[tq] = scores
		}
		return testReuslt
	}
	getSearchResult(query: string) {
		// var start_ms = new Date().getTime();
		const nbssScore: any = this.nbss.search(query)
		// console.info("nbss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const edssScore: any = this.edss.search(query)
		// console.info("edss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const tissScore: any = this.tiss.search(query)
		// console.info("tiss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const ngssScore: any = this.ngss.search(query)
		// console.info("ngss:"+ (new Date().getTime() - start_ms).toString());
		// let ngssScore={}
		const scores: any = {
			nbss: nbssScore,
			edss: edssScore,
			tiss: tissScore,
			ngss: ngssScore,
		}
		// console.info(scores);
		const rankResult = this._aggregateScores(scores)
		const filteredResult = rankResult.filter(o => {
			return o.weight > this.threshold
		})
		return filteredResult.map(o => {
			return o.id
		})
	}
	search(query: string) {
		// var start_ms = new Date().getTime();
		const nbssScore: any = this.nbss.search(query)
		// console.info("nbss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const edssScore: any = this.edss.search(query)
		// console.info("edss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const tissScore: any = this.tiss.search(query)
		// console.info("tiss:"+ (new Date().getTime() - start_ms).toString());
		// var start_ms = new Date().getTime();
		const ngssScore: any = this.ngss.search(query)
		// console.info("ngss:"+ (new Date().getTime() - start_ms).toString());
		// let ngssScore={}
		const scores: any = {
			nbss: nbssScore,
			edss: edssScore,
			tiss: tissScore,
			ngss: ngssScore,
		}
		// console.info(scores);
		const rankResult = this._aggregateScores(scores)
		const filteredResult = rankResult.filter(o => {
			return o.weight > this.threshold
		})
		return filteredResult;
	}
}
