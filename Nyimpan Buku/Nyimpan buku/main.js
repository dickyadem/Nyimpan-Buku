
 const nyimpans = [];
 const RENDER_EVENT = 'render-nyimpan';
 const SAVED_EVENT = 'saved-nyimpan';
 const STORAGE_KEY = 'nyimpan_APPS';
 
 function generateId() {
   return +new Date();
 }
 
 function generatenyimpanObject(id, title, author, year, isCompleted) {
   return {
     id,
     title,
     author,
     year,
     isCompleted
   };
 }
 
 function findnyimpan(nyimpanId) {
   for (const nyimpanItem of nyimpans) {
     if (nyimpanItem.id === nyimpanId) {
       return nyimpanItem;
     }
   }
   return null;
 }
 
 function findnyimpanIndex(nyimpanId) {
   for (const index in nyimpans) {
     if (nyimpans[index].id === nyimpanId) {
       return index;
     }
   }
   return -1;
 }
 

 function isStorageExist() {
   if (typeof (Storage) === undefined) {
     alert('Browser kamu tidak mendukung local storage');
     return false;
   }
   return true;
 }
 

 function saveData() {
   if (isStorageExist()) {
     const parsed  = JSON.stringify(nyimpans);
     localStorage.setItem(STORAGE_KEY, parsed);
     document.dispatchEvent(new Event(SAVED_EVENT));
   }
 }
 
 function loadDataFromStorage() {
   const serializedData= localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);
 
   if (data !== null) {
     for (const nyimpan of data) {
       nyimpans.push(nyimpan);
     }
   }
 
   document.dispatchEvent(new Event(RENDER_EVENT));
 }
 
 function makenyimpan(nyimpanObject) {
 
   const {id, title, author, year, isCompleted} = nyimpanObject;
 
   const texttitle = document.createElement('h2');
   texttitle.innerText = title;
 
   const textauthor = document.createElement('p');
   textauthor.innerText = author;

   const textyear = document.createElement('p');
   textyear.innerText = year;
 
   const textContainer = document.createElement('div');
   textContainer.classList.add('inner');
   textContainer.append(texttitle, textauthor, textyear);
 
   const container = document.createElement('div');
   container.append(textContainer);
   container.setAttribute('id', `nyimpan-${id}`);
 
   if (isCompleted) {
 
    const greenButton = document.createElement("button");
    greenButton.innerText = " Ingin di Baca";
    greenButton.addEventListener("click", function () {
      undoTaskFromCompleted(id);
    });

    const redButton = document.createElement("button");
    redButton.innerText = "Hapus buku";
    redButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    container.append(greenButton, redButton);
  } else {
  
    const redButton = document.createElement("button");
    redButton.innerText = "Hapus buku";
    redButton.addEventListener("click", function () {
      removeTaskFromCompleted(id);
    });

    const greenButton = document.createElement("button");
    greenButton.innerText = " Sudah di Baca";
    greenButton.addEventListener("click", function () {
       addTaskToCompleted(id);
     });
 
     container.append(greenButton, redButton);
   }
 
   return container;
 }
 
 function addnyimpan() {
   const title = document.getElementById("inputBookTitle").value;
   const author = document.getElementById("inputBookAuthor").value;
   const year = parseInt(document.getElementById("inputBookYear").value);
   const isCompleted = document.getElementById("inputBookIsComplete").checked;
   const generatedID = generateId();
   const nyimpanObject = generatenyimpanObject(generatedID, title, author,year,isCompleted, false);
   nyimpans.push(nyimpanObject);
 
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
 function addTaskToCompleted(nyimpanId /* HTMLELement */) {
   const nyimpanTarget = findnyimpan(nyimpanId);
 
   if (nyimpanTarget == null) return;
 
   nyimpanTarget.isCompleted = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
 function removeTaskFromCompleted(nyimpanId /* HTMLELement */) {
   const nyimpanTarget = findnyimpanIndex(nyimpanId);
 
   if (nyimpanTarget === -1) return;
 
   nyimpans.splice(nyimpanTarget, 1);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
 function undoTaskFromCompleted(nyimpanId /* HTMLELement */) {
 
   const nyimpanTarget = findnyimpan(nyimpanId);
   if (nyimpanTarget == null) return;
 
   nyimpanTarget.isCompleted = false;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
 }
 
 document.addEventListener('DOMContentLoaded', function () {
 
   const submitForm /* HTMLFormElement */ = document.getElementById('form');
 
   submitForm.addEventListener('submit', function (event) {
     event.preventDefault();
     addnyimpan();
   });
 
   if (isStorageExist()) {
     loadDataFromStorage();
   }
 });
 
 document.addEventListener(SAVED_EVENT, () => {
   console.log('Data berhasil di simpan.');
 });
 
 document.addEventListener(RENDER_EVENT, function () {
   const uncompletednyimpanList = document.getElementById('nyimpans');
   const listCompleted = document.getElementById('completed-nyimpans');
 
   // clearing list item
   uncompletednyimpanList.innerHTML = '';
   listCompleted.innerHTML = '';
 
   for (const nyimpanItem of nyimpans) {
     const nyimpanElement = makenyimpan(nyimpanItem);
     if (nyimpanItem.isCompleted) {
       listCompleted.append(nyimpanElement);
    } else {
       uncompletednyimpanList.append(nyimpanElement);
     }
   }
 });
 