const express = require('express')
const exphbs = require('express-handlebars')
const con = require('./database/conn')

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res)=> {
    res.render('home')
})

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pagesqty = req.body.pagesqty
    
    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`
    const data = ['title', 'pageqty', title, pagesqty]

    con.query(sql, data, function(err) {
        if(err){
            console.log(err)
            return
        }

        res.redirect('/')
    })
})

app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM books'

    con.query(sql, function(err, data) {
        if(err){
            console.log(err)
            return
        }

        const books = data
        console.log(books)
        res.render('books', {books})
    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE id = ${id}`

    con.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]
        res.render('book', {book})
    })

})

app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE id =${id}`

    con.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const book = data[0]

        res.render('editbook', {book})
    })
})

app.post('/books/updatedbook', (req, res) => {
    const {id, title, pageqty } = req.body

    const sql = `UPDATE books SET books.title = '${title}', books.pageqty = '${pageqty}' WHERE id = ${id}`
    con.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM books WHERE id = ${id}`

    con.query(sql, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.listen(3000)