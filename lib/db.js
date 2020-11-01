const storage = {
    students: [],
    books: [],
    booklendings: []
};



const students = {
    insert(student) {
        let ids = storage.students.map(a => a.id);
        student.id = ( storage.students.length==0 ? 1 : Math.max(...ids) + 1);
        storage.students.push(student);
        return student.id;
    },
    findById(id) {
        return storage.students.find(x => x.id == id);
    },
    all() {
        return storage.students;
    }
};



const books = {
    insert(book) {
        let ids = storage.books.map(a => a.id);
        book.id = ( storage.books.length==0 ? 1 : Math.max(...ids) + 1);
        storage.books.push(book);
        return book.id;
    },
    findById(id) {
        return storage.books.find(x => x.id == id);
    },
    all() {
        return storage.books;
    }
};



const booklendings = {
    insert(booklending) {
        let ids = storage.booklendings.map(a => a.id);
        booklending.id = ( storage.booklendings.length==0 ? 1 : Math.max(...ids) + 1);
        storage.booklendings.push(booklending);
        return booklending.id;
    },
    getSpecific(studentId, assignmentId) {
        //console.log("studentId = " + student + ", assignmentId = " + assignmentId);
        return (storage.marks.filter(m => m.studentId == studentId && m.assignmentId == assignmentId))[0];
    },
    getBulk(studentId) {
        return storage.marks.filter(m => m.studentId == studentId);
    }
};



var studentId = students.insert({
    email: "mario.rossi@unitn.com"
});
var bookId = books.insert({
    title: "Software Engineering 2"
});
booklendings.insert( {
    studentId: studentId,
    bookId: bookId
});



module.exports = {
    students,
    books,
    booklendings
};
