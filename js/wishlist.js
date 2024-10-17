const wishlistContainer = document.getElementById("wishlistContainer")
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
const loadingSpinner = document.getElementById("loadingSpinner")

const fetchWishlistBooks = async () => {
	loadingSpinner.style.display = "flex"

	try {
		const promises = wishlist.map((id) => fetch(`https://gutendex.com/books/${id}`).then((res) => res.json()))
		const books = await Promise.all(promises)
		displayBooks(books)
	} catch (error) {
		console.error("Error fetching wishlist:", error)
	} finally {
		loadingSpinner.style.display = "none"
	}
}

const displayBooks = (books) => {
	wishlistContainer.innerHTML = ""
	books.forEach((book, index) => {
		const { id, title, authors, subjects, formats } = book
		const genre = subjects[0] || "General"
		const coverImage = formats["image/jpeg"]
		const bookCard = document.createElement("div")
		bookCard.className = "book-card"

		bookCard.style.setProperty("--animation-delay", `${index * 0.75}s`)

		bookCard.innerHTML += `
			<div class="book-img">
			<img src="${coverImage}" alt="${title}" class="book-cover" />
			</div>
            <h3>${title}</h3>
            <p>By: ${authors.map((a) => a.name).join(", ")}</p>
            <p>Genre: ${genre}</p>
			<hr />
            <p>Book Id: ${id}</p>
			<a href="book.html?id=${id}" class="book-link">View Details</a>
        `

		wishlistContainer.appendChild(bookCard)
	})
}

const removeFromWishlist = (bookId) => {
	const updatedWishlist = wishlist.filter((id) => id !== bookId)
	localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
	fetchWishlistBooks()
}

fetchWishlistBooks()
