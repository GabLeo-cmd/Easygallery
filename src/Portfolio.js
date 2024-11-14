import React, { useState, useEffect } from 'react';
import pdfIcon from './assets/pdf.png'; // Caminho atualizado para o ícone de PDF

const Portfolio = ({ searchQuery, onProductClick, onFilteredItemsChange }) => {
  const [items, setItems] = useState(Array(7).fill(null)); // Inicialmente 7 quadrados
  const [tempProductName, setTempProductName] = useState(Array(7).fill('')); // Nomes temporários dos produtos
  const [showInput, setShowInput] = useState(Array(7).fill(false)); // Controla a exibição da caixa de texto e botão
  const [hoveredIndex, setHoveredIndex] = useState(null); // Controla o índice do quadrado que está sendo hover

  useEffect(() => {
    const filteredItems = items.filter(item => item && item.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    onFilteredItemsChange(filteredItems);
  }, [searchQuery, items, onFilteredItemsChange]);

  const handleUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedItems = [...items];
      updatedItems[index] = {
        file,
        url: URL.createObjectURL(file),
        productName: '', // Inicialmente sem nome
      };
      setItems(updatedItems);
      setShowInput((prev) => {
        const newShowInput = [...prev];
        newShowInput[index] = true; // Mostrar a caixa de texto e botão após upload
        return newShowInput;
      });
    }
  };

  const handleRemove = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = null;
    setItems(updatedItems);
    setShowInput((prev) => {
      const newShowInput = [...prev];
      newShowInput[index] = false; // Esconder a caixa de texto e botão ao remover
      return newShowInput;
    });
  };

  const handleTempProductNameChange = (index, event) => {
    const newTempProductName = [...tempProductName];
    newTempProductName[index] = event.target.value;
    setTempProductName(newTempProductName);
  };

  const handleSaveProductName = (index) => {
    if (tempProductName[index].trim() === '') {
      alert('O nome do produto não pode ser vazio.');
      return;
    }
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      productName: tempProductName[index],
    };
    setItems(updatedItems);
    setShowInput((prev) => {
      const newShowInput = [...prev];
      newShowInput[index] = false; // Esconder a caixa de texto e botão após salvar
      return newShowInput;
    });
  };

  const handleAddSquare = () => {
    setItems([...items, null]);
    setTempProductName([...tempProductName, '']);
    setShowInput([...showInput, false]);
  };

  const handleDeleteSquare = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    const updatedTempProductName = tempProductName.filter((_, i) => i !== index);
    const updatedShowInput = showInput.filter((_, i) => i !== index);
    setItems(updatedItems);
    setTempProductName(updatedTempProductName);
    setShowInput(updatedShowInput);
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
                    <video src={item.url} style={styles.video} />
                  </a>
                ) : (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                    {item.file.name}
                  </a>
                )}
                <button style={styles.removeButton} onClick={() => handleRemove(index)}>X</button>
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
                      onClick={() => handleSaveProductName(index)}
                      disabled={!tempProductName[index].trim()} // Desabilitar botão se o nome do produto estiver vazio
                    >
                      Salvar Nome
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <label style={styles.customFileUpload}>
                  <input
                    type="file"
                    onChange={(e) => handleUpload(index, e)}
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
          
          {/* Campo de texto para o nome do produto, fora do quadrado */}
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
    gap: '20px', // Espaçamento entre os quadrados
    justifyContent: 'center',
    overflowY: 'auto', // Permitir rolagem vertical
    maxHeight: '80vh', // Altura máxima do container
  },
  squareContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(25% - 20px)', // Cada quadrado ocupa 25% da largura com espaço entre eles
    position: 'relative',
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
    marginTop: '10px', // Espaçamento entre o quadrado e o campo de nome
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
    width: '50px', // Ajuste o tamanho conforme necessário
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
  },
};

export default Portfolio;