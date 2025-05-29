const express = require('express')
const app = express()

const { initializeDataBase } = require('./db/db.connect')

const Book = require('./models/book.models')
app.use(express.json())

initializeDataBase()

//------- create new book data in DB --------//
async function createBook(newBook) {
    try {
        const book = new Book(newBook)
        const saveBook = await book.save()
        return saveBook

    } catch (error) {
        throw error
    }
}

app.post('/books', async (req, res) => {
    try {
        const savedBook = await createBook(req.body)
        res.status(201).json({ message: 'Book added successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to add book.' })
    }
})

//------ Get all the books ---------//

async function getAllBooks() {
    try {
        const allBooks = await Book.find()
        return allBooks
    } catch (error) {
        throw error
    }
}

app.get('/books', async (req, res) => {
    try {
        const books = await getAllBooks()
        if (books.length !== 0) {
            res.json(books)
        } else {
            res.status(404).json({ error: 'No books were found' })
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books data.' })
    }
})

//----------  get book by title -----------//

async function getBookByTitle(bookName) {
    try {
        const bookbyName = await Book.findOne({ title: bookName })
        return bookbyName
    } catch (error) {
        console.log('Error:', error)
    }
}

app.get('/books/book/:bookName', async (req, res) => {
    try {
        const books = await getBookByTitle(req.params.bookName)
        if (books) {
            res.json(books)
        } else {
            res.status(404).json({ error: 'No book found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find book.' })
    }
})

//---------- get book details by author name -----//

async function getBookByAuthorName(authorName) {
    try {
        const bookbyAuthorName = await Book.findOne({ author: authorName })
        return bookbyAuthorName
    } catch (error) {
        console.log('Error:', error)
    }
}

app.get('/books/by-authorName/:authorName', async (req, res) => {
    try {
        const books = await getBookByAuthorName(req.params.authorName)
        if (books) {
            res.json(books)
        } else {
            res.status(404).json({ error: 'No book found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find book.' })
    }
})

//-------- get all books of Business genre --------//

async function getBookByGenre(genreName) {
    try {
        const bookbyGenre = await Book.findOne({ genre: genreName })
        return bookbyGenre
    } catch (error) {
        console.log('Error:', error)
    }
}

app.get('/books/by-genre/:genreName', async (req, res) => {
    try {
        const books = await getBookByGenre(req.params.genreName)
        if (books) {
            res.json(books)
        } else {
            res.status(404).json({ error: 'No book found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find book.' })
    }
})

//-------- Get all books of the release year 2012 ----//

async function getBookByReleaseYear(year) {
    try {
        const bookByYear = await Book.findOne({
            publishedYear
                : year
        })
        return bookByYear
    } catch (error) {
        console.log('Error:', error)
    }
}

app.get('/books/by-year/:releaseYear', async (req, res) => {
    try {
        const books = await getBookByReleaseYear(req.params.releaseYear)
        if (books) {
            res.json(books)
        } else {
            res.status(404).json({ error: 'No book found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find book.' })
    }
})


//--------Update a book via id -------//

async function updateBookById(bookId, dataToUpdate) {
    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
            new: true
        })
        return updatedBook
    } catch (error) {
        console.log('Book does not exist')
    }
}

app.post('/books/:bookId', async (req, res) => {
    try {
        const updatedBook = await updateBookById(req.params.bookId, req.body)
        if (updatedBook) {
            res.status(200).json({ message: 'Book updated successfully', updatedBook: updatedBook })
        } else {
            res.status(404).json({ error: 'Book not found' })
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' })
    }
})

//-------- update a book rating by title ------//

async function updateBookByTitle(name, dataToUpdate) {
    try {
        const bookByTitle = await Book.findOneAndUpdate({ title: name }, dataToUpdate, { new: true })
        return bookByTitle
    } catch (error) {
        console.log('Error:', error)
    }
}

app.post('/books/by-title/:title', async (req, res) => {
    try {
        const updatedBook = await updateBookByTitle(req.params.title, req.body)
        if (updatedBook) {
            res.status(200).json({ message: 'Book updated successfully', updatedBook: updatedBook })
        } else {
            res.status(404).json({ error: 'No book found' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find book.' })
    }
})


//------------- Delete with the help of book id -----//

async function deleteBook(bookId) {
    try {
        const deletedBook = await Book.findByIdAndDelete(bookId)
        return deletedBook
    } catch (error) {
        console.log(error)
    }
}

app.delete('/books/:bookId', async (req, res) => {
    try {
        const deletedBook = await deleteBook(req.params.bookId)
        if (deletedBook) {
            res.status(200).json({ message: "Book deleted successfully." })
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' })
    }
})



const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})


