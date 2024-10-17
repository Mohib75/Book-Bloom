async function fetchBookDetails() {
	const params = new URLSearchParams(window.location.search)
	const bookId = params.get("id")

	console.log(bookId)

	const loadingSpinner = document.getElementById("loadingSpinner")
	const booksDetailsContainer = document.getElementById("book-details-container")

	loadingSpinner.style.display = "flex"

	if (!bookId) {
		booksDetailsContainer.innerHTML = "<p>Book not found.</p>"
		return
	}

	const response = await fetch(`https://gutendex.com/books/${bookId}`)
	const data = await response.json()
	const coverImage = data.formats["image/jpeg"]
	const genre = data.subjects[0] || "General"

	loadingSpinner.style.display = "none"

	if (data) {
		booksDetailsContainer.innerHTML = `
			<div class="book-left">
			<img src="${coverImage}" alt="${data.title}" class="book-cover" />
			</div>
            <div class="book-right">
            <h3>${data.title}</h3>
            <p>By: ${data.authors.map((a) => a.name).join(", ")}</p>
			<hr />
            <p>Genre: ${genre}</p>
			<hr />
            <p>Book Id: ${bookId}</p>
            </div>
        `
	} else {
		booksDetailsContainer.innerHTML = "<p>Book details not found.</p>"
	}
}

fetchBookDetails()
