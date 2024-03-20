import "./style.css"
import { CATEGORIES, initialFacts } from "./data"
import { useState } from "react"

function App() {
	const [showForm, setShowForm] = useState(false)

	return (
		<>
			{/* HEADER */}
			<Header
				setShowForm={setShowForm}
				showForm={showForm}
			/>
			{showForm ? <NewFactForm /> : null}
			<main className='main'>
				<CategoryFilter />
				<FactList />
			</main>
		</>
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
const NewFactForm = () => {
	const [text, setText] = useState("")
	const [source, setSource] = useState("")
	const [category, setCategory] = useState("")
	const handleSubmit = (e) => {
		e.preventDefault()
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
			<button className='btn btn-large'>Post</button>
		</form>
	)
}
const CategoryFilter = () => {
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

const FactList = () => {
	const facts = initialFacts
	return (
		<section>
			<ul className='facts-list'>
				{facts.map((fact, index) => {
					return (
						<Fact
							data={fact}
							key={fact.id}
						/>
					)
				})}
			</ul>
		</section>
	)
}

const Fact = ({ data }) => {
	return (
		<li className='fact'>
			<p>
				{data.text}
				<a
					className='source'
					href={data.source}
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
						(category) => category.name === data.category
					).color,
				}}
			>
				{data.category}
			</span>

			<div className='vote-buttons'>
				<button>
					👍 <strong>{data.votesInteresting}</strong>
				</button>
				<button>
					🤯 <strong>{data.votesMindblowing}</strong>
				</button>
				<button>
					⛔️ <strong>{data.votesFalse}</strong>
				</button>
			</div>
		</li>
	)
}
export default App
