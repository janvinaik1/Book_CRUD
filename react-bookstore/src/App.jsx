  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import "./App.css";
  
  const App = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ title: "", author: "", pages: 0 });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editBook, setEditBook] = useState(null);
  
    const apiUrl = "http://192.168.0.126:8000/books"; // Change to your backend URL if on different devices
  
    // Fetch all books from the backend
    useEffect(() => {
      axios
        .get(apiUrl)
        .then((response) => {
          setBooks(response.data);
        })
        .catch((err) => {
          console.error("Error fetching books:", err);
        });
    }, []);
  
    // Add a new book
    const handleAddBook = (e) => {
      e.preventDefault();
      axios
        .post(apiUrl, newBook)
        .then((response) => {
          setBooks([...books, response.data]);
          setNewBook({ title: "", author: "", pages: 0 });
        })
        .catch((err) => {
          console.error("Error adding book:", err);
        });
    };
  
    // Edit an existing book
    const handleEditBook = (book) => {
      setIsEditMode(true);
      setEditBook(book);
      setNewBook({ title: book.title, author: book.author, pages: book.pages });
    };
  
    // Save the edited book
    const handleSaveEdit = (e) => {
      e.preventDefault();
      axios
        .put(`${apiUrl}/${editBook._id}`, newBook)
        .then((response) => {
          const updatedBooks = books.map((book) =>
            book._id === editBook._id ? response.data : book
          );
          setBooks(updatedBooks);
          setIsEditMode(false);
          setNewBook({ title: "", author: "", pages: 0 });
        })
        .catch((err) => {
          console.error("Error saving book:", err);
        });
    };
  
    // Delete a book
    const handleDeleteBook = (id) => {
      axios
        .delete(`${apiUrl}/${id}`)
        .then(() => {
          setBooks(books.filter((book) => book._id !== id));
        })
        .catch((err) => {
          console.error("Error deleting book:", err);
        });
    };
  
    return (
      <div className="container">
        <h1>Book Management</h1>
  
        {/* Add/Edit Book Form */}
        <form onSubmit={isEditMode ? handleSaveEdit : handleAddBook} className="form-container">
          <div className="input-group">
            <label>Title</label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              placeholder="Title"
              required
            />
          </div>
          <div className="input-group">
            <label>Author</label>
            <input
              type="text"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              placeholder="Author"
              required
            />
          </div>
          <div className="input-group">
            <label>Pages</label>
            <input
              type="number"
              value={newBook.pages || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (!isNaN(value) && value !== "") {
                  setNewBook({ ...newBook, pages: parseInt(value) });
                } else {
                  setNewBook({ ...newBook, pages: 0 });
                }
              }}
              placeholder="Pages"
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            {isEditMode ? "Save Changes" : "Add Book"}
          </button>
        </form>
  
        {/* Books Table */}
        <h2>Books List</h2>
        <table className="books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Pages</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.pages}</td>
                <td className="actions">
                  <button onClick={() => handleEditBook(book)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteBook(book._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default App;
  