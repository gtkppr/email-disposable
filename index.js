import domainsList from "./disposable.json"  with { type: "json" }

export { domainsList }

export default function isDisposable(email) {
	
	if(typeof email !== "string") return false
	
	const parts = email.split("@")
	if(parts.length !== 2) return false
	
	let domain = parts[1].toLowerCase().trim()
	
	if(domainsList.includes(domain)) return true
	
	return domainsList.some(pattern => {
		const normalized = pattern.toLowerCase()
		if(normalized.includes("*")) {
			const regex = new RegExp(
				"^" +
				normalized
					.replace(/\./g, "\\.")
					.replace(/\*/g, ".*")
				+ "$"
			)
			return regex.test(domain)
		}
	})
	
}