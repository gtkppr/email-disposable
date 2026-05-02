import pLimit from "p-limit"
import fs from "fs/promises"
import { domainToASCII } from "node:url"

import { whitelist } from "./config/whitelist.js"
import { blacklist } from "./config/blacklist.js"
import { sources } from "./config/sources.js"

const limit = pLimit(10)
const promises = []
const DOMAIN_PATTERN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{1,62}$/

const normalizeDomain = (value) => {
	if(typeof value !== "string") return null

	const candidate = value
		.trim()
		.toLowerCase()
		.split(/\s+/)[0]
		.replace(/^@+/, "")
		.replace(/^\*\./, "")
		.replace(/\.+$/g, "")

	if(!candidate || candidate.startsWith("#") || candidate.startsWith("//")) return null

	const ascii = domainToASCII(candidate)
	const normalized = (ascii || candidate).toLowerCase()

	return DOMAIN_PATTERN.test(normalized) ? normalized : null
}

const addNormalized = (items, value) => {
	const normalized = normalizeDomain(value)
	if(normalized) items.push(normalized)
}

const fetchList = async ({ url, parser }) => {
	
	let res
	let json
	
	const items = []
	
	try {
		res = await fetch(url, {
			signal: AbortSignal.timeout(30000)
		})
	} catch(err) {
		console.warn(`[skip] ${url}: ${err.message}`)
		return []
	}

	if(!res.ok) {
		console.warn(`[skip] ${url}: HTTP ${res.status}`)
		return []
	}
	
	try {
		switch(parser) {
			
			case "text":
				const text = await res.text()
				const rows = text.split("\n").filter(line => line !== "")
				rows.forEach(row => {
					addNormalized(items, row)
				})
				break
			
			case "json":
				json = await res.json()
				if(Array.isArray(json)) {
					json.forEach(item => addNormalized(items, item))
				}
				break
			
			case "json-hosts":
				json = await res.json()
				const services = Object.keys(json || {})
				services.forEach(serviceId => {
					addNormalized(items, serviceId)
					if(json[serviceId]?.hosts) {
						json[serviceId].hosts.forEach(host => addNormalized(items, host))
					}
				})
				break
		}
	} catch(err) {
		console.warn(`[skip] ${url}: ${err.message}`)
		return []
	}
	
	return items
	
}

for(let i = 0; i < sources.length; i++) {
	promises.push(limit(() => fetchList(sources[i])))
}

const results = await Promise.all(promises)
const resultsSet = new Set(results.flat())

blacklist.forEach(item => {
	const normalized = normalizeDomain(item)
	if(normalized) resultsSet.add(normalized)
})

whitelist.forEach(item => {
	const normalized = normalizeDomain(item)
	if(normalized) resultsSet.delete(normalized)
})

const finalList = [...resultsSet].sort((left, right) => left.localeCompare(right))

await fs.writeFile("./disposable.json", JSON.stringify(finalList, null, 4), "utf-8")
await fs.writeFile("./disposable.txt", `${finalList.join("\n")}\n`, "utf-8")
process.exit()
