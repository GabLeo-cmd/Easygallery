import React, { useState, useEffect } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref as databaseRef, set, push, remove, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import pdfIcon from './assets/pdf.png'; // Caminho atualizado para o ícone de PDF
import { storage, database, auth } from './firebaseConfig'; // Import the initialized Firebase app

const Portfolio = ({ searchQuery, onProductClick, onFilteredItemsChange }) => {
  const [items, setItems] = useState([]);
  const [tempProductName, setTempProductName] = useState([]);
  const [showInput, setShowInput] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userItemsRef = databaseRef(database, `users/${user.uid}/items`);
        onValue(userItemsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const itemsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setItems(itemsArray);
            setTempProductName(itemsArray.map(item => item.productName || ''));
            setShowInput(itemsArray.map(() => false));
            setSelectedFile(itemsArray.map(() => null));
          } else {
            setItems([]);
            setTempProductName([]);
            setShowInput([]);
            setSelectedFile([]);
          }
        });
      } else {
        setUser(null);
        setItems([]);
        setTempProductName([]);
        setShowInput([]);
        setSelectedFile([]);
      }
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      onFilteredItemsChange([]);
    } else {
      const filteredItems = items.filter(item => item && item.productName && item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
      onFilteredItemsChange(filteredItems);
    }
  }, [searchQuery, items, onFilteredItemsChange]);

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("File is undefined.");
      return;
    }
    const newSelectedFile = [...selectedFile];
    newSelectedFile[index] = file;
    setSelectedFile(newSelectedFile);
    const newShowInput = [...showInput];
    newShowInput[index] = true;
    setShowInput(newShowInput);
  };

  const handleUpload = (index) => {
    const file = selectedFile[index];
    if (!file || !user || !user.uid) {
      console.error("File or user is undefined.");
      return;
    }
    const fileRef = storageRef(storage, `products/${user.uid}/${file.name}`);
    uploadBytes(fileRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const newItem = {
          file: {
            name: file.name,
            type: file.type,
          },
          url,
          productName: tempProductName[index],
        };
        const updatedItems = [...items];
        if (index < items.length) {
          updatedItems[index] = newItem;
        } else {
          updatedItems.push(newItem);
        }
        setItems(updatedItems);
        setShowInput((prev) => {
          const newShowInput = [...prev];
          newShowInput[index] = false;
          return newShowInput;
        });
        const userItemsRef = databaseRef(database, `users/${user.uid}/items`);
        const newItemRef = push(userItemsRef);
        set(newItemRef, newItem);
      }).catch((error) => {
        console.error("Error getting download URL:", error);
      });
    }).catch((error) => {
      console.error("Error uploading file:", error);
    });
  };

  const handleRemove = (index) => {
    if (!user || !user.uid) {
      console.error("User or user.uid is undefined.");
      return;
    }
    const item = items[index];
    if (!item || !item.file || !item.file.name) {
      console.error("Item or item.file is undefined.");
      return;
    }
    const fileRef = storageRef(storage, `products/${user.uid}/${item.file.name}`);
    deleteObject(fileRef).then(() => {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
      setShowInput((prev) => {
        const newShowInput = [...prev];
        newShowInput.splice(index, 1);
        return newShowInput;
      });
      const userItemsRef = databaseRef(database, `users/${user.uid}/items/${item.id}`);
      remove(userItemsRef);
    }).catch((error) => {
      console.error("Error deleting file:", error);
    });
  };

  const handleTempProductNameChange = (index, event) => {
    const newTempProductName = [...tempProductName];
    newTempProductName[index] = event.target.value;
    setTempProductName(newTempProductName);
  };

  const handleAddSquare = () => {
    setItems([...items, null]);
    setTempProductName([...tempProductName, '']);
    setShowInput([...showInput, false]);
    setSelectedFile([...selectedFile, null]);
  };

  const handleDeleteSquare = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    const updatedTempProductName = tempProductName.filter((_, i) => i !== index);
    const updatedShowInput = showInput.filter((_, i) => i !== index);
    const updatedSelectedFile = selectedFile.filter((_, i) => i !== index);
    setItems(updatedItems);
    setTempProductName(updatedTempProductName);
    setShowInput(updatedShowInput);
    setSelectedFile(updatedSelectedFile);
  };

  return (
    <div style={styles.container}>
      {items.map((item, index) => (
        <div
          key={index}
          style={styles.squareContainer}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div style={styles.square}>
            {item ? (
              <>
                {item.file.type === 'application/pdf' ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                    <img src={pdfIcon} alt="PDF Icon" style={styles.pdfIcon} />
                  </a>
                ) : item.file.type.startsWith('image/') ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                    <img src={item.url} alt={item.file.name} style={styles.image} />
                  </a>
                ) : item.file.type.startsWith('video/') ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                    <video src={item.url} style={styles.video} controls />
                  </a>
                ) : (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                    {item.file.name}
                  </a>
                )}
                {hoveredIndex === index && (
                  <button style={styles.removeButton} onClick={() => handleRemove(index)}>X</button>
                )}
              </>
            ) : (
              <>
                <label style={styles.customFileUpload}>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e)}
                    style={styles.fileInput}
                  />
                  Escolher arquivo
                </label>
                {hoveredIndex === index && (
                  <button style={styles.deleteButton} onClick={() => handleDeleteSquare(index)}>X</button>
                )}
              </>
            )}
          </div>
          {showInput[index] && (
            <div style={styles.overlay}>
              <input
                type="text"
                placeholder="Nome do produto"
                value={tempProductName[index]}
                onChange={(e) => handleTempProductNameChange(index, e)}
                style={styles.productNameInput}
              />
              <button
                style={styles.saveButton}
                onClick={() => handleUpload(index)}
                disabled={!tempProductName[index].trim()}
              >
                Salvar produto
              </button>
            </div>
          )}
          {item && item.productName && (
            <div style={styles.productNameDisplay}>
              {item.productName}
            </div>
          )}
        </div>
      ))}
      <div style={styles.squareContainer}>
        <div style={styles.addSquare} onClick={handleAddSquare}>
          +
        </div>
      </div>
    </div>
  );
};

// Estilos para o layout desejado
const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    overflowY: 'auto',
    maxHeight: '80vh',
    width: '100%',
    boxSizing: 'border-box',
  },
  squareContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(25% - 20px)',
    position: 'relative',
    boxSizing: 'border-box',
  },
  square: {
    width: '100%',
    height: '250px',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    borderRadius: '10px', // Bordas arredondadas para o quadrado
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Efeito de sombra
  },
  fileLink: {
    textDecoration: 'none',
    color: '#007bff',
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '50%', // Bordas arredondadas para o botão "X"
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: '#ff0000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    borderRadius: '50%', // Bordas arredondadas para o botão "X"
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInput: {
    display: 'none',
  },
  customFileUpload: {
    cursor: 'pointer',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    textAlign: 'center',
  },
  productNameInput: {
    marginTop: '10px',
    padding: '5px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
  saveButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productNameDisplay: {
    marginTop: '10px',
    padding: '5px',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pdfIcon: {
    width: '50px',
    height: '50px',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },
  video: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },
  addSquare: {
    width: '100%',
    height: '250px',
    border: '1px dashed #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: '#007bff',
    cursor: 'pointer',
    borderRadius: '10px', // Bordas arredondadas para o quadrado de upload
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Efeito de sombra
  },
};

export default Portfolio;