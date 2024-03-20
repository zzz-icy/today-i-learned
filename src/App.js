import "./style.css"
import { CATEGORIES, initialFacts } from "./data"

function App() {
	const appTitle = "Today I Learned"

	return (
		<>
			{/* HEADER */}
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

				<button className='btn btn-large btn-open'>Share a fact</button>
			</header>
			<NewFactForm />
			<main className='main'>
				<CategoryFilter />
				<FactList />
			</main>
		</>
	)
}
const NewFactForm = () => {
	return <form className='fact-form'>Fact Form</form>
}
const CategoryFilter = () => {
	return <aside>Category Filter</aside>
}

const FactList = () => {
	const facts = initialFacts
	return (
		<section>
			<ul className='facts-list'>
				{facts.map((fact, index) => {
					return (
						<li
							className='fact'
							key={fact.id}
						>
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
									).color,
								}}
							>
								{fact.category}
							</span>

							<div className='vote-buttons'>
								<button>
									👍 <strong>{fact.votesInteresting}</strong>
								</button>
								<button>
									🤯 <strong>{fact.votesMindblowing}</strong>
								</button>
								<button>
									⛔️ <strong>{fact.votesFalse}</strong>
								</button>
							</div>
						</li>
					)
				})}
			</ul>
		</section>
	)
}

export default App
