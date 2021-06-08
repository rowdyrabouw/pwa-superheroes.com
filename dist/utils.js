const DYNAMIC_DB = "dynamic";
const DYNAMIC_DB_VERSION = 1;
const DYNAMIC_DB_STORE = "heroes";
const API_URL = "https://www.superheroapi.com/api.php/3251184438288441/213";

// open database and get a callback after it is opened
const IDB = idb.open(DYNAMIC_DB, DYNAMIC_DB_VERSION, db => {
  //  create a store if it doesn't exist already
  if (!db.objectStoreNames.contains(DYNAMIC_DB_STORE)) {
    //  name the store and set the primary key
    db.createObjectStore(DYNAMIC_DB_STORE, { keyPath: "id" });
  }
});

function writeData(storeName, data) {
  console.log("Write data to cache", data);
  return IDB.then(db => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put(data);
    return tx.complete;
  });
}

function clearAllData(storeName) {
  return IDB.then(db => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.clear();
    return tx.complete;
  });
}

function readAllData(storeName) {
  return IDB.then(db => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    return store.getAll();
  });
}
