const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

/* object properties
{
     id: string | number,
     title: string,
     author: string,
     year: number,
     isComplete: boolean,
 } 
*/

function generateId() {
  return +new Date();
}

function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function makeBook(book) {
  const { id, title, author, year, isComplete } = book;

  const bookContainer = document.createElement("div");
  bookContainer.setAttribute("data-bookid", id);
  bookContainer.setAttribute("data-testid", "bookItem");
  bookContainer.classList.add(
    "block",
    "w-full",
    "p-6",
    "bg-white",
    "border",
    "border-gray-200",
    "rounded-lg",
    "shadow",
    "text-blue-400",
    "my-5"
  );

  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.classList.add(
    "text-2xl",
    "font-bold",
    "text-start",
    "bg-blue-400",
    "text-white",
    "rounded-lg",
    "p-2",
    "mb-2"
  );
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.classList.add("pt-1", "font-semibold");
  bookAuthor.innerText = `Penulis: ${author}`;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.classList.add("pt-1", "font-semibold");
  bookYear.innerText = `Tahun: ${year}`;

  const innerDiv = document.createElement("div");
  innerDiv.classList.add("flex", "justify-end", "mt-1");

  bookContainer.append(bookTitle, bookAuthor, bookYear, innerDiv);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(bookContainer);
  container.setAttribute("id", `book-${id}`);

  // Add buttons based on isComplete status
  if (isComplete) {
    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.classList.add(
      "edit-button",
      "bg-yellow-500",
      "text-white",
      "rounded",
      "px-4",
      "py-2",
      "mr-2",
      "border",
      "border-yellow-500",
      "hover:bg-yellow-600",
      "hover:border-yellow-600",
      "transition",
      "duration-300"
    );
    editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
    `;
    editButton.addEventListener("click", function () {
      editBook(id);
    });
    const undoButton = document.createElement("button");
    undoButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    undoButton.classList.add(
      "undo-button",
      "bg-green-500",
      "text-white",
      "rounded",
      "px-4",
      "py-2",
      "mr-2",
      "border",
      "border-green-500",
      "hover:bg-green-600",
      "hover:border-green-600",
      "transition",
      "duration-300"
    );
    undoButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
    `;
    undoButton.addEventListener("click", function () {
      undoBook(id);
    });

    const trashButton = document.createElement("button");
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");
    trashButton.classList.add(
      "trash-button",
      "bg-red-500",
      "text-white",
      "rounded",
      "px-4",
      "py-2",
      "border",
      "border-red-500",
      "hover:bg-red-600",
      "hover:border-red-600",
      "transition",
      "duration-300"
    );
    trashButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    `;
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    innerDiv.append(undoButton, editButton, trashButton);
  } else {
    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.classList.add(
      "edit-button",
      "bg-yellow-500",
      "text-white",
      "rounded",
      "px-4",
      "py-2",
      "mr-2",
      "border",
      "border-yellow-500",
      "hover:bg-yellow-600",
      "hover:border-yellow-600",
      "transition",
      "duration-300"
    );
    editButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
    `;
    editButton.addEventListener("click", function () {
      editBook(id);
    });

    const checkButton = document.createElement("button");
    checkButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    checkButton.classList.add(
      "check-button",
      "bg-green-500",
      "text-white",
      "rounded",
      "px-4",
      "py-2",
      "mr-2",
      "border",
      "border-green-500",
      "hover:bg-green-600",
      "hover:border-green-600",
      "transition",
      "duration-300"
    );
    checkButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    `;
    checkButton.addEventListener("click", function () {
      completeBook(id);
    });

    const trashButton = document.createElement("button");
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");
    trashButton.classList.add(
      "trash-button",
      "bg-red-500",
      "text-white",
      "rounded",
      "px-4",
      "py-2",
      "border",
      "border-red-500",
      "hover:bg-red-600",
      "hover:border-red-600",
      "transition",
      "duration-300"
    );
    trashButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    `;
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    innerDiv.append(checkButton, editButton, trashButton);
  }

  return container;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  for (let book of books) {
    if (book.title === bookTitle && book.author === bookAuthor) {
      customAlerts("Buku sudah ada di dalam rak", "warning");
      return;
    }
  }

  const year = parseInt(bookYear); // Corrected parseInt function call

  const generatedID = generateId();
  const book = generateBook(
    generatedID,
    bookTitle,
    bookAuthor,
    year,
    isComplete
  );
  books.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBook(bookTitle) {
  for (let book of books) {
    if (book.title === bookTitle) {
      return !book.isComplete;
    }
  }
  return undefined;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  customAlerts("Buku Berhasil Dihapus", "success");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBook(bookId) {
  const index = findBookIndex(bookId);
  if (index == -1) return;

  books[index].isComplete = false;
  customAlerts("Buku Berhasil Dipindahkan", "success");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completeBook(bookId) {
  const index = findBookIndex(bookId);
  if (index == -1) return;

  books[index].isComplete = true;
  customAlerts("Buku Berhasil Dipindahkan", "success");
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editBook(bookId) {
  const index = findBookIndex(bookId);
  if (index === -1) return;

  const modal = document.getElementById("custom-modal");
  const closeModalButton = document.getElementById("closeModal");

  modal.classList.remove("invisible", "opacity-0", "scale-95");
  modal.classList.add("opacity-100", "scale-100");
  document.getElementById("editBookTitle").value = books[index].title;
  document.getElementById("editBookAuthor").value = books[index].author;
  document.getElementById("editBookYear").value = books[index].year;

  const submitEditForm = document.getElementById("editBookForm");

  submitEditForm.onsubmit = function (event) {
    event.preventDefault();
    const bookTitle = document.getElementById("editBookTitle").value;
    const bookAuthor = document.getElementById("editBookAuthor").value;
    const bookYear = document.getElementById("editBookYear").value;

    if (
      books[index].title === bookTitle &&
      books[index].author === bookAuthor &&
      books[index].year === bookYear
    ) {
      //console.log("Buku Tidak Ada Perubahan");
      customAlerts("Buku Tidak Ada Perubahan", "warning");
      return;
    } else {
      //console.log("Buku Ada Perubahan");
      books[index].title = bookTitle;
      books[index].author = bookAuthor;
      books[index].year = bookYear;

      customAlerts("Buku Berhasil Diubah", "success");
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
  };

  closeModalButton.addEventListener("click", function () {
    modal.classList.add("opacity-0", "scale-95");
    modal.classList.remove("opacity-100", "scale-100");
    setTimeout(() => {
      modal.classList.add("invisible");
    }, 300);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    customAlerts("Buku Berhasil Disimpan", "success");
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const searchForm = document.getElementById("searchBook");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTitle = document.getElementById("searchBookTitle").value;
    const result = searchBook(searchTitle);
    if (result === undefined) {
      customAlerts("Buku tidak ditemukan", "warning");
    } else if (result === true) {
      customAlerts("Buku Berada di Rak Belum Selesai Dibaca", "info");
    } else if (result === false) {
      customAlerts("Buku Berada di Rak Sudah Selesai Dibaca", "info");
    }
  });
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookList");
  const listCompleted = document.getElementById("completeBookList");

  // clearing list item
  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});

function loadExternalScript(url) {
  const script = document.createElement("script");
  script.src = url;
  script.type = "text/javascript";
  script.async = true;
  document.head.appendChild(script);
}

loadExternalScript(
  "https://cdn.jsdelivr.net/gh/noumanqamar450/alertbox@main/version/1.0.2/alertbox.min.js"
);
// https://alertbox.js.org/ -> custom alertbox

function customAlerts(text, type) {
  alertbox.render({
    alertIcon: type,
    title: "Bookshelf Popup Message",
    message: text,
    btnTitle: "ok",
    themeColor: "#60a5fa ",
    btnColor: "#60a5fa",
    btnColor: true,
  });
}
