import "./style.css"

function App() {
	return (
		<header className='header'>
			<div className='logo'>
				<img
					src='logo.png'
					height='68'
					width='68'
					alt='Today I learned Logo'
				/>
				<h1>Today I Learned</h1>
			</div>

			<button class='btn btn-large btn-open'>Share a fact</button>
		</header>
	)
}

export default App
