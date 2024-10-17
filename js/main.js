let currentPage = 1
let allBooks = []
let isFetched = false
const booksContainer = document.getElementById("booksContainer")
const loadingSpinner = document.getElementById("loadingSpinner")
const searchInput = document.getElementById("searchInput")
const genreFilter = document.getElementById("genreFilter")

const fetchBooks = async (page = 1) => {
	if (isFetched) {
		console.log("Using cached data")
		displayBooks(allBooks)
		return
	}

	loadingSpinner.style.display = "flex"
	booksContainer.innerHTML = ""

	try {
		console.log("Fetching from API")
		const response = await fetch(`https://gutendex.com/books?page=${page}`)
		const data = await response.json()
		allBooks = data.results
		displayBooks(allBooks)
		updatePageNumber()
		populateGenreFilter(allBooks)
	} catch (error) {
		console.error("Error fetching books:", error)
	} finally {
		loadingSpinner.style.display = "none"
	}
}

const populateGenreFilter = (books) => {
	const genres = new Set()

	books.forEach((book) => {
		if (book.subjects) {
			book.subjects.forEach((subject) => {
				genres.add(subject)
			})
		}
	})

	genreFilter.innerHTML = '<option value="">All Genres</option>'

	genres.forEach((genre) => {
		const option = document.createElement("option")
		option.value = genre
		option.textContent = genre
		genreFilter.appendChild(option)
	})
}

genreFilter.addEventListener("change", function () {
	const selectedGenre = this.value
	const filteredBooks = selectedGenre ? allBooks.filter((book) => book.subjects && book.subjects.includes(selectedGenre)) : allBooks
	displayBooks(filteredBooks)
})

const getWishlist = () => JSON.parse(localStorage.getItem("wishlist")) || []

const saveWishlist = (wishlist) => {
	localStorage.setItem("wishlist", JSON.stringify(wishlist))
}

const showAlert = (message) => {
	const alertBox = document.getElementById("customAlert")
	alertBox.textContent = message
	alertBox.classList.add("show")

	setTimeout(() => {
		alertBox.classList.remove("show")
	}, 1500)
}

// Toggle wishlist and update heart icon
const toggleWishlist = (bookId, heartIcon) => {
	let wishlist = getWishlist()
	const isInWishlist = wishlist.includes(bookId)

	if (isInWishlist) {
		wishlist = wishlist.filter((id) => id !== bookId)
		heartIcon.textContent = "♡"
		showAlert("Removed from Wishlist")
	} else {
		wishlist.push(bookId)
		heartIcon.textContent = "❤"
		showAlert("Added to Wishlist")
	}

	saveWishlist(wishlist)
}

const displayBooks = (books) => {
	booksContainer.innerHTML = ""
	const wishlist = getWishlist()

	books.forEach((book, index) => {
		const { id, title, authors, subjects, formats } = book
		const genre = subjects[0] || "General"
		const coverImage = formats["image/jpeg"]
		const isLiked = wishlist.includes(id)
		const heartIcon = isLiked ? "❤" : "♡"
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
            <span class="heart ${isLiked ? "liked" : ""}" data-id="${id}" onclick="toggleWishlist(${id}, this)">${heartIcon}</span>
			<a href="book.html?id=${id}" class="book-link">View Details</a>
        `

		booksContainer.appendChild(bookCard)
	})
}

document.getElementById("nextPage").addEventListener("click", () => {
	currentPage++
	fetchBooks(currentPage)
})

document.getElementById("prevPage").addEventListener("click", () => {
	if (currentPage > 1) {
		currentPage--
		fetchBooks(currentPage)
	}
})

const updatePageNumber = () => {
	document.getElementById("currentPage").innerText = currentPage
}

const searchBooks = (event) => {
	const searchTerm = event.target.value.toLowerCase()
	const filteredBooks = allBooks.filter((book) => book.title.toLowerCase().includes(searchTerm))
	displayBooks(filteredBooks)
}

const setupSearch = () => {
	searchInput.addEventListener("input", searchBooks)
}

window.addEventListener("DOMContentLoaded", () => {
	fetchBooks()
	setupSearch()
})
