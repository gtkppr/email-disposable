import pLimit from "p-limit"
import fs from "fs/promises"

import { whitelist } from "./config/whitelist.js"
import { blacklist } from "./config/blacklist.js"
import { sources } from "./config/sources.js"

const limit = pLimit(10)
const promises = []

const fetchList = async ({ url, parser }) => {
	
	let res
	let json
	
	const items = []
	
	try {
		res = await fetch(url)
	} catch(err) {
		console.error(err)
		return []
	}
	
	switch(parser) {
		
		case "text":
			const text = await res.text()
			const rows = text.split("\n").filter(line => line !== "")
			rows.forEach(row => {
				if(row.startsWith("#")) return true
				items.push(row.trim())
			})
			break
		
		case "json":
			json = await res.json()
			items.push(...json)
			break
		
		case "json-hosts":
			json = await res.json()
			const services = Object.keys(json)
			services.forEach(serviceId => {
				if(json[serviceId]?.hosts) {
					items.push(serviceId, ...json[serviceId].hosts)
				}
			})
			break
	}
	
	return items
	
}

for(let i = 0; i < sources.length; i++) {
	promises.push(limit(() => fetchList(sources[i])))
}

const results = await Promise.all(promises)
const resultsSet = new Set(results.flat())

resultsSet.add(...blacklist)

whitelist.forEach(item => resultsSet.delete(item))

const finalList = [...resultsSet]

await fs.writeFile("./disposable.json", JSON.stringify(finalList, null, 4), "utf-8")
await fs.writeFile("./disposable.txt", finalList.join("\n"), "utf-8")
process.exit()