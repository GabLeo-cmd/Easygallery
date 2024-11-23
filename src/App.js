import React, { useState } from 'react';
import Portfolio from './Portfolio';
import LoginModal from './LoginModal';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleProductClick = (item) => {
    window.open(item.url, '_blank');
  };

  const handleFilteredItemsChange = (items) => {
    setFilteredItems(items);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div style={styles.appContainer}>
      {!isAuthenticated && <LoginModal onLogin={handleLogin} />}
      {isAuthenticated && (
        <>
          {/* Faixa Azul com Texto Branco à Esquerda */}
          <div style={styles.header}>
            <h1 style={styles.headerText}>Catalogojá</h1>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={styles.searchInput}
              />
              {searchQuery && (
                <div style={styles.suggestions}>
                  {filteredItems.map((item, index) => (
                    <div
                      key={index}
                      style={styles.suggestionItem}
                      onClick={() => handleProductClick(item)}
                    >
                      {item.productName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.menuIcon} onClick={toggleMenu}>
              &#x22EE; {/* Unicode for vertical ellipsis */}
            </div>
          </div>
          {/* Menu Modal */}
          {isMenuOpen && (
            <div style={styles.menuModal}>
              <div style={styles.menuItem} onClick={handleLogout}>
                Sair
              </div>
            </div>
          )}
          {/* Componente de Portfólio */}
          <div style={styles.portfolioContainer}>
            <Portfolio
              searchQuery={searchQuery}
              onProductClick={handleProductClick}
              onFilteredItemsChange={handleFilteredItemsChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Estilos para o Cabeçalho e Espaçamento
const styles = {
  appContainer: {
    width: '100%',
    overflowX: 'hidden', // Evita o scroll horizontal
  },
  header: {
    width: '100%',
    backgroundColor: '#0388fc', // Azul
    padding: '10px 20px', // Reduz a altura da faixa
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Espaçar os itens
    boxSizing: 'border-box',
  },
  headerText: {
    color: '#fff', // Texto branco
    margin: 0,
    fontSize: '24px',
  },
  searchContainer: {
    position: 'relative',
    width: '50%', // Largura da barra de pesquisa
    maxWidth: '600px', // Limita a largura máxima da barra de pesquisa
    marginLeft: 'auto', // Empurrar a barra de pesquisa para o centro
    marginRight: 'auto', // Empurrar a barra de pesquisa para o centro
  },
  searchInput: {
    padding: '5px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1000,
    boxSizing: 'border-box',
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ccc',
  },
  portfolioContainer: {
    marginTop: '20px', // Espaço entre o cabeçalho e os quadrados
    padding: '0 20px', // Adiciona padding para evitar overflow horizontal
    boxSizing: 'border-box',
  },
  menuIcon: {
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
  },
  menuModal: {
    position: 'absolute',
    top: '50px', // Ajuste conforme necessário
    right: '10px', // Ajuste conforme necessário
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1000,
    boxSizing: 'border-box',
  },
  menuItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ccc',
  },
};

export default App;