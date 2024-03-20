import "./style.css"
import { CATEGORIES } from "./data"
import { useCallback, useEffect, useState } from "react"
import supabase from "./supabase"
function App() {
	const [showForm, setShowForm] = useState(false)
	const [facts, setFacts] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [isUploading, setIsUploading] = useState(false)

	const [error, setError] = useState(undefined)
	const [currentCategory, setCurrentCategory] = useState("all")

	const getFacts = useCallback(async () => {
		setIsLoading(true)
		let query = supabase.from("facts").select("*")
		if (currentCategory !== "all") {
			query = query.eq("category", currentCategory)
		}
		let { data: facts, error } = await query
			.order("created_at", { ascending: false })
			.limit(1000)
		if (!error) {
			setFacts(facts)
		} else {
			setError(error)
		}
		setIsLoading(false)
	}, [currentCategory])

	useEffect(() => {
		getFacts()
	}, [currentCategory, getFacts])

	return (
		<>
			{/* HEADER */}
			<Header
				setShowForm={setShowForm}
				showForm={showForm}
			/>
			{showForm ? (
				<NewFactForm
					setFacts={setFacts}
					setShowForm={setShowForm}
					setIsUploading={setIsUploading}
					isUploading={isUploading}
				/>
			) : null}
			<main className='main'>
				<CategoryFilter setCurrentCategory={setCurrentCategory} />
				{isLoading ? (
					<Loader />
				) : error ? (
					<Retry getFacts={getFacts} />
				) : (
					<FactList
						facts={facts}
						setFacts={setFacts}
					/>
				)}
			</main>
		</>
	)
}
function Loader() {
	return <p className='message'>Loading...</p>
}
function Retry({ getFacts }) {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
			<p className='message'>
				😢 Oops, something went wrong, please try again.
			</p>
			<button
				className='btn btn-category'
				style={{ alignSelf: "center", width: "30%" }}
				onClick={getFacts}
			>
				Retry
			</button>
		</div>
	)
}

const Header = ({ setShowForm, showForm }) => {
	const appTitle = "Today I Learned"

	return (
		<header className='header'>
			<div className='logo'>
				<img
					src='logo.png'
					height='68'
					width='68'
					alt='Today I learned Logo'
				/>
				<h1>{appTitle}</h1>
			</div>

			<button
				className='btn btn-large btn-open'
				onClick={() => setShowForm((showForm) => !showForm)}
			>
				{showForm ? "close" : "Share a fact"}
			</button>
		</header>
	)
}

function isValidHttpUrl(string) {
	let url

	try {
		url = new URL(string)
	} catch (_) {
		return false
	}

	return url.protocol === "http:" || url.protocol === "https:"
}

const NewFactForm = ({
	setFacts,
	setShowForm,
	setIsUploading,
	isUploading,
}) => {
	const [text, setText] = useState("")
	const [source, setSource] = useState("")
	const [category, setCategory] = useState("")
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (text && isValidHttpUrl(source) && category && text.length <= 200) {
			setIsUploading(true)
			const { data: newFact, error } = await supabase
				.from("facts")
				.insert([
					{
						text,
						source,
						category,
					},
				])
				.select()

			if (!error) {
				setFacts((facts) => setFacts([newFact[0], ...facts]))
			}
			setIsUploading(false)

			setText("")
			setSource("")
			setCategory("")

			// close the form
			setShowForm(false)
		}
	}
	return (
		<form
			className='fact-form'
			onSubmit={handleSubmit}
		>
			<input
				type='text'
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder='Share a fact with the world...'
			/>
			<span>{200 - text.length}</span>
			<input
				type='text'
				value={source}
				onChange={(e) => setSource(e.target.value)}
				placeholder='Trustworthy source...'
			/>
			<select
				value={category}
				onChange={(e) => setCategory(e.target.value)}
			>
				<option value=''>Choose Category:</option>
				{CATEGORIES.map((cat) => {
					return (
						<option
							key={cat.name}
							value={cat.name}
						>
							{cat.name.toUpperCase()}
						</option>
					)
				})}
			</select>
			<button
				className='btn btn-large'
				disabled={isUploading}
			>
				Post
			</button>
		</form>
	)
}
const CategoryFilter = ({ setCurrentCategory }) => {
	return (
		<aside>
			<ul>
				{CATEGORIES.map((item, index) => {
					if (index === 0) {
						return (
							<li
								className='category'
								key='all'
							>
								<button className='btn btn-all-categories'>All</button>
							</li>
						)
					} else {
						return (
							<li
								className='category'
								key={item.name}
							>
								<button
									className='btn btn-category'
									style={{ backgroundColor: item.color }}
									onClick={() => setCurrentCategory(item.name)}
								>
									{item.name}
								</button>
							</li>
						)
					}
				})}
			</ul>
		</aside>
	)
}

const FactList = ({ facts, setFacts }) => {
	// if (!facts) return null
	if (facts?.length === 0) {
		return (
			<p className='message'>
				No facts for this category yet! Create the first one 😺
			</p>
		)
	}
	return (
		<section>
			<ul className='facts-list'>
				{facts?.map((fact, index) => {
					return (
						<Fact
							fact={fact}
							key={fact.id}
							setFacts={setFacts}
						/>
					)
				})}
			</ul>
		</section>
	)
}

const Fact = ({ fact, setFacts }) => {
	const [isUpdating, setIsUpdating] = useState(false)
	const handleVote = async (voteToUpdate) => {
		setIsUpdating(true)
		const { data: updatedFact, error } = await supabase
			.from("facts")
			.update({ [voteToUpdate]: fact[voteToUpdate] + 1 })
			.eq("id", fact.id)
			.select()
		setIsUpdating(false)
		if (!error) {
			setFacts((facts) =>
				facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
			)
		}
	}
	return (
		<li className='fact'>
			<p>
				{fact.text}
				<a
					className='source'
					href={fact.source}
					target='_blank'
					rel='noreferrer'
				>
					(Source)
				</a>
			</p>
			<span
				className='tag'
				style={{
					backgroundColor: CATEGORIES.find(
						(category) => category.name === fact.category
					)?.color,
				}}
			>
				{fact.category}
			</span>

			<div className='vote-buttons'>
				<button
					onClick={() => handleVote("votesInteresting")}
					disabled={isUpdating}
				>
					👍 <strong>{fact.votesInteresting}</strong>
				</button>
				<button
					onClick={() => handleVote("votesMindblowing")}
					disabled={isUpdating}
				>
					🤯 <strong>{fact.votesMindblowing}</strong>
				</button>
				<button
					onClick={() => handleVote("votesFalse")}
					disabled={isUpdating}
				>
					⛔️ <strong>{fact.votesFalse}</strong>
				</button>
			</div>
		</li>
	)
}
export default App
