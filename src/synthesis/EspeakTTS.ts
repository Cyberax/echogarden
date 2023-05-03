import { concatFloat32Arrays, logToStderr, objToString } from "../utilities/Utilities.js"
import { int16PcmToFloat32 } from "../audio/AudioBufferConversion.js"
import { Logger } from '../utilities/Logger.js'
import { WasmMemoryManager } from "../utilities/WasmMemoryManager.js"
import { RawAudio, getEmptyRawAudio } from "../audio/AudioUtilities.js"
import { playAudioWithTimelinePhones } from "../audio/AudioPlayer.js"
import * as CompromiseNLP from "../nlp/CompromiseNLP.js"
import { getNormalizationMapForSpeech } from "../nlp/TextNormalizer.js"
import { ipaPhoneToKirshenbaum } from "../nlp/PhoneConversion.js"
import { splitToWords } from "../nlp/Segmentation.js"
import { Lexicon } from "../nlp/Lexicon.js"
import { phonemizeSentence } from "../nlp/EspeakPhonemizer.js"
import { Timeline, TimelineEntry } from "../utilities/Timeline.js"

const log = logToStderr

let espeakInstance: any
let espeakModule: any

export async function synthesize(text: string, ssmlEnabled: boolean) {
	const logger = new Logger()
	logger.start("Get espeak WASM instance")

	if (!ssmlEnabled) {
		const { escape } = await import('html-escaper')

		text = escape(text)
	}

	const { instance } = await getEspeakInstance()

	const sampleChunks: Float32Array[] = []
	const allEvents: EspeakEvent[] = []

	logger.start("Synthesize with eSpeak")

	instance.synthesize(text, (samples: Int16Array, events: EspeakEvent[]) => {
		if (samples && samples.length > 0) {
			sampleChunks.push(int16PcmToFloat32(samples))
		}

		for (const event of events) {
			if (event.type == "word") {
				const textPosition = event.text_position - 1;
				(event as any)["text"] = text.substring(textPosition, textPosition + event.word_length)
			}
		}

		allEvents.push(...events)
	})

	const concatenatedSamples = concatFloat32Arrays(sampleChunks)

	const rawAudio: RawAudio = { audioChannels: [concatenatedSamples], sampleRate: 22050 }

	logger.end()

	return { rawAudio, events: allEvents }
}

export async function preprocessAndSynthesizeSentence(sentence: string, espeakVoice: string, lexicons: Lexicon[] = [], normalize = true, rate = 150, pitch = 50, pitchRange = 50) {
	const logger = new Logger()

	await logger.startAsync("Tokenize and analyze text")

	let fragments: string[]
	let preprocessedFragments: string[]
	const phonemizedFragmentsSubstitutions = new Map<number, string[]>()

	if (espeakVoice.startsWith("en")) {
		fragments = []
		preprocessedFragments = []

		const parsedSentence = await CompromiseNLP.parse(sentence)
		log(parsedSentence)
		const terms = parsedSentence.flatMap(s => s)

		const normalizationMap = getNormalizationMapForSpeech(terms, espeakVoice)

		for (let termIndex = 0; termIndex < terms.length; termIndex++) {
			const term = terms[termIndex]

			const trimmedPreText = term.preText.trim()
			if (trimmedPreText != "") {
				fragments.push(trimmedPreText)
				preprocessedFragments.push(trimmedPreText)
			}

			const termText = term.text

			if (termText != "") {
				const substitutionPhonemes = CompromiseNLP.tryMatchInLexicons(term, lexicons, espeakVoice)

				if (substitutionPhonemes) {
					phonemizedFragmentsSubstitutions.set(fragments.length, substitutionPhonemes)
					const referenceIPA = (await textToPhonemes(term.text, espeakVoice, true)).replaceAll("_", " ")
					const referenceKirshenbaum = (await textToPhonemes(term.text, espeakVoice, false)).replaceAll("_", "")

					logger.log(`\nSubstitution references: Target IPA: ${substitutionPhonemes.join(" ")}, IPA: ${referenceIPA}, Kirshenbaum: ${referenceKirshenbaum}`)

					const kirshenbaumPhonemes = substitutionPhonemes.map(phone => ipaPhoneToKirshenbaum(phone)).join("")

					logger.log(`Kirshenbaum conversion result: ${kirshenbaumPhonemes}`)

					const substitutionPhonemesFragment = ` [[${kirshenbaumPhonemes}]] `

					preprocessedFragments.push(substitutionPhonemesFragment)
				} else {
					let normalizedFragment: string | undefined = undefined

					if (normalize) {
						normalizedFragment = normalizationMap.get(termIndex)
					}

					if (normalizedFragment) {
						preprocessedFragments.push(normalizedFragment)
					} else {
						preprocessedFragments.push(termText)
					}
				}

				fragments.push(termText)
			}

			const trimmedPostText = term.postText.trim()
			if (trimmedPostText != "") {
				fragments.push(trimmedPostText)
				preprocessedFragments.push(trimmedPostText)
			}
		}
	} else {
		fragments = (await splitToWords(sentence, espeakVoice)).filter(word => word.trim() != "")
		preprocessedFragments = fragments
	}

	logger.start("Synthesize preprocessed fragments with eSpeak")

	const { rawAudio: referenceSynthesizedAudio, timeline: referenceTimeline } = await synthesizeFragments(preprocessedFragments, espeakVoice, false)

	await logger.startAsync("Build phonemized tokens")

	const phonemizedSentence: string[][][] = []

	let wordIndex = 0
	for (const phraseEntry of referenceTimeline) {
		const phrase: string[][] = []

		for (const wordEntry of phraseEntry.timeline!) {
			wordEntry.text = fragments[wordIndex]

			if (phonemizedFragmentsSubstitutions.has(wordIndex)) {
				phrase.push(phonemizedFragmentsSubstitutions.get(wordIndex)!)
			} else {
				for (const tokenEntry of wordEntry.timeline!) {
					const tokenPhonemes: string[] = []

					for (const phoneme of tokenEntry.timeline!) {
						if (phoneme.text) {
							tokenPhonemes.push(phoneme.text)
						}
					}

					if (tokenPhonemes.length > 0) {
						phrase.push(tokenPhonemes)
					}
				}
			}

			wordIndex += 1
		}

		if (phrase.length > 0) {
			phonemizedSentence.push(phrase)
		}
	}

	logger.log(phonemizedSentence.map(phrase => phrase.map(word => word.join(" ")).join(" | ")).join(" || "))

	logger.end()

	return { referenceSynthesizedAudio, referenceTimeline, fragments, preprocessedFragments, phonemizedFragmentsSubstitutions, phonemizedSentence }
}

export async function synthesizeFragments(fragments: string[], voice: string, insertSeparators = false, rate = 150, pitch = 50, pitchRange = 50) {
	const logger = new Logger()

	await setVoice(voice)
	await setRate(rate)
	await setPitch(pitch)
	await setPitchRange(pitchRange)

	const sampleRate = await getSampleRate()

	//fragments = fragments.filter(fragment => fragment.trim() != "")

	if (fragments.length == 0) {
		return {
			rawAudio: getEmptyRawAudio(1, sampleRate),
			timeline: [] as Timeline,
			events : [] as EspeakEvent[]
		}
	}

	const { escape } = await import('html-escaper')

	let textWithMarkers = ''

	for (let i = 0; i < fragments.length; i++) {
		//let fragment = escape(fragments[i])
		let fragment = fragments[i]

		if (insertSeparators) {
			textWithMarkers += `<mark name="wordstart-${i}"/> | ${fragment} | <mark name="wordend-${i}"/>`
		} else {
			if (fragment.endsWith(".")) {
				fragment += " ()"
			}

			textWithMarkers += `<mark name="wordstart-${i}"/>${fragment}<mark name="wordend-${i}"/> `
		}
	}

	//log(textWithMarkers)

	const { rawAudio, events } = await synthesize(textWithMarkers, true)

	const timeline: Timeline = fragments.map(word => ({
		type: "word",
		text: word,
		startTime: -1,
		endTime: -1,
		timeline: [{
			type: "token",
			text: "",
			startTime: -1,
			endTime: -1,
			timeline: []
		}]
	}))

	let wordIndex = 0

	const clauseEndIndexes: number[] = []

	for (const event of events) {
		const eventTime = event.audio_position / 1000

		const currentWordEntry = timeline[wordIndex]

		const currentSubwordTimeline = currentWordEntry.timeline!
		const currentSubwordEntry = currentSubwordTimeline[currentSubwordTimeline.length - 1]

		const currentPhoneTimeline = currentSubwordEntry.timeline!
		const lastPhoneEntry = currentPhoneTimeline[currentPhoneTimeline.length - 1]

		if (lastPhoneEntry && lastPhoneEntry.endTime == -1) {
			lastPhoneEntry.endTime = eventTime
		}

		if (event.type == "word") {
			if (!event.id || currentPhoneTimeline.length == 0) {
				continue
			}

			if (currentSubwordEntry.endTime == -1) {
				currentSubwordEntry.endTime = eventTime
			}

			currentSubwordTimeline.push({
				type: "token",
				text: "",
				startTime: eventTime,
				endTime: -1,
				timeline: []
			})
		} else if (event.type == "phoneme") {
			const phoneText = event.id as string

			if (!phoneText || phoneText.startsWith("(")) {
				continue
			}

			currentPhoneTimeline.push({
				type: "phone",
				text: phoneText,
				startTime: eventTime,
				endTime: -1
			})

			currentSubwordEntry.text += phoneText
			currentSubwordEntry.startTime = currentPhoneTimeline[0].startTime
		} else if (event.type == "mark") {
			const markerName = event.id! as string

			if (markerName.startsWith("wordstart-")) {
				const markerIndex = parseInt(markerName.substring(10))

				if (markerIndex != wordIndex) {
					throw new Error(`Word start marker for index ${wordIndex} is not consistent with word index. The words were: ${objToString(fragments)}`)
				}

				if (currentPhoneTimeline.length > 0) {
					throw new Error(`Word entry ${wordIndex} already has phones before its start marker was seen. The words were: ${objToString(fragments)}`)
				}

				currentWordEntry.startTime = eventTime
				currentSubwordEntry.startTime = eventTime
			} else if (markerName.startsWith("wordend-")) {
				const markerIndex = parseInt(markerName.substring(8))

				if (markerIndex != wordIndex) {
					throw new Error(`Word end marker for index ${wordIndex} is not consistent with word index. The words were: ${objToString(fragments)}`)
				}

				currentWordEntry.startTime = currentSubwordTimeline[0].startTime

				currentWordEntry.endTime = eventTime
				currentSubwordEntry.endTime = eventTime

				wordIndex += 1

				if (wordIndex == timeline.length) {
					break
				}
			} else {
				continue
			}
		} else if (event.type == "end") {
			clauseEndIndexes.push(wordIndex)
		}
	}

	clauseEndIndexes.push(timeline.length)

	const timelineWithClauses: Timeline = []

	let clauseStartIndex = 0

	for (const clauseEndIndex of clauseEndIndexes) {
		const newClause: TimelineEntry = {
			type: "clause",
			text: "",
			startTime: -1,
			endTime: -1,
			timeline: []
		}

		for (let entryIndex = clauseStartIndex; entryIndex <= clauseEndIndex && entryIndex < timeline.length; entryIndex++) {
			const wordEntry = timeline[entryIndex]
			if (newClause.startTime == -1) {
				newClause.startTime = wordEntry.startTime
			}

			newClause.endTime = wordEntry.endTime

			newClause.text += `${wordEntry.text} `

			newClause.timeline!.push(wordEntry)
		}

		if (newClause.timeline!.length > 0) {
			timelineWithClauses.push(newClause)
			clauseStartIndex = clauseEndIndex + 1
		}
	}

	return { rawAudio, timeline: timelineWithClauses, events }
}

export async function textToIPA(text: string, voice: string) {
	await setVoice(voice)
	const { instance } = await getEspeakInstance()
	const ipa: string = (instance.synthesize_ipa(text).ipa as string).trim()

	return ipa
}

export async function textToPhonemes(text: string, voice: string, useIPA = true) {
	await setVoice(voice)
	const { instance, module } = await getEspeakInstance()
	const textPtr = instance.convert_to_phonemes(text, useIPA)

	const wasmMemory = new WasmMemoryManager(module)

	const resultRef = wasmMemory.wrapNullTerminatedUtf8String(textPtr.ptr)
	const result = resultRef.getValue()

	wasmMemory.freeAll()

	return result
}

export async function setVoice(voiceId: string) {
	const { instance } = await getEspeakInstance()

	instance.set_voice(voiceId)
}

export async function setVolume(volume: number) {
	const { instance } = await getEspeakInstance()

	return instance.setVolume(volume)
}

export async function setRate(rate: number) {
	const { instance } = await getEspeakInstance()

	return instance.set_rate(rate)
}

export async function setPitch(pitch: number) {
	const { instance } = await getEspeakInstance()

	return instance.set_pitch(pitch)
}

export async function setPitchRange(pitchRange: number) {
	const { instance } = await getEspeakInstance()

	return instance.set_range(pitchRange)
}

export async function getSampleRate(): Promise<22050> {
	return 22050
}

export async function listVoices() {
	const { instance } = await getEspeakInstance()

	const voiceList: { identifier: string, name: string, languages: { priority: number, name: string }[] }[] = instance.list_voices()

	return voiceList
}

async function getEspeakInstance() {
	if (!espeakInstance) {
		const { default: EspeakInitializer } = await import('@echogarden/espeak-ng-emscripten')

		const m = await EspeakInitializer()
		espeakInstance = await (new m.eSpeakNGWorker())
		espeakModule = m
	}

	return { instance: espeakInstance, module: espeakModule }
}

export type EspeakEventType = "sentence" | "word" | "phoneme" | "end" | "mark" | "play" | "msg_terminated" | "list_terminated" | "samplerate"

export interface EspeakEvent {
	audio_position: number
	type: EspeakEventType
	text_position: number
	word_length: number
	id?: string | number
}

type SynthesisOptions = {
	format?: 'int16' | 'float32'
	channels?: 1 | 2
	ssml?: boolean
	phonemes?: boolean
	endpause?: boolean
}

export async function testEspeakSynthesisWithPrePhonemizedInputs(text: string) {
	const ipaPhonemizedSentence = (await phonemizeSentence(text, "en-us")).flatMap(clause => clause)
	const kirshenbaumPhonemizedSentence = (await phonemizeSentence(text, "en-us", undefined, false)).flatMap(clause => clause)
	log(kirshenbaumPhonemizedSentence)

	const fragments = ipaPhonemizedSentence.map(word =>
		word.map(phoneme =>
			ipaPhoneToKirshenbaum(phoneme)).join("")).map(word => ` [[${word}]] `)

	const { rawAudio, timeline } = await synthesizeFragments(fragments, 'en-us')

	await playAudioWithTimelinePhones(rawAudio, timeline)
}

export async function testKirshenbaumPhonemization(text: string) {
	const ipaPhonemizedSentence = (await phonemizeSentence(text, "en-us")).flatMap(clause => clause)
	const kirshenbaumPhonemizedSentence = (await phonemizeSentence(text, "en-us", undefined, false)).flatMap(clause => clause)

	const ipaFragments = ipaPhonemizedSentence.map(word => word.join(""))

	const kirshenbaumFragments = kirshenbaumPhonemizedSentence.map(word => word.join(""))

	const fragments = ipaPhonemizedSentence.map(word =>
		word.map(phoneme =>
			ipaPhoneToKirshenbaum(phoneme)).join(""))

	for (let i = 0; i < fragments.length; i++) {
		log(`IPA: ${ipaFragments[i]} | converted: ${fragments[i]} | ground truth: ${kirshenbaumFragments[i]}`)
	}
}
