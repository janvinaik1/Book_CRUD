const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true },
  publishedDate: { type: Date, default: Date.now },
  file: { type: String }
});

 const Book = mongoose.model('Book', bookSchema);
// async function updateExistingDocuments() {
//   try {
//       const result = await Book.updateMany({}, { $set: { file: null } });
//       console.log(`${result.modifiedCount} documents updated successfully.`);
//   } catch (error) {
//       console.error("Error updating documents:", error);
//   }
// }
// updateExistingDocuments();

module.exports = Book; 
