import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX6-29BDRrA27whX40vdFn1Bg8WL4aK8Q",
  authDomain: "bicos21-d11f6.firebaseapp.com",
  databaseURL: "https://bicos21-d11f6-default-rtdb.firebaseio.com",
  projectId: "bicos21-d11f6",
  storageBucket: "bicos21-d11f6.appspot.com",
  messagingSenderId: "877360516073",
  appId: "1:877360516073:web:495d108ae6846b7f369978",
  measurementId: "G-S9J6YMDWYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const LoginModal = ({ onLogin }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setLoginEmail(savedEmail);
      setLoginPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      if (rememberMe) {
        localStorage.setItem('email', loginEmail);
        localStorage.setItem('password', loginPassword);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
      onLogin();
    } catch (error) {
      alert('Credenciais inválidas');
    }
  };

  const handleSignUp = async () => {
    if (registerPassword !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      await set(ref(database, 'users/' + user.uid), {
        username: registerUsername,
        email: registerEmail
      });
      alert('Inscrição realizada com sucesso!');
      setIsSignUp(false);
    } catch (error) {
      alert('Erro ao criar conta: ' + error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Email de redefinição de senha enviado!');
      setIsResetPassword(false);
    } catch (error) {
      alert('Erro ao enviar email de redefinição de senha: ' + error.message);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      {isResetPassword ? (
        <div style={styles.modalContent}>
          <h2>Redefinir Senha</h2>
          <input
            type="email"
            placeholder="Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleResetPassword} style={styles.button}>Enviar Email de Redefinição</button>
          <div style={styles.linksContainer}>
            <button onClick={() => setIsResetPassword(false)} style={styles.linkButton}>Voltar ao Login</button>
          </div>
        </div>
      ) : isSignUp ? (
        <div style={styles.modalContent}>
          <h2>Inscreva-se</h2>
          <input
            type="text"
            placeholder="Nome"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            style={styles.input}
          />
          <div style={styles.passwordContainer}>
            <input
              type={showRegisterPassword ? "text" : "password"}
              placeholder="Senha"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              style={styles.input}
            />
            <button onClick={() => setShowRegisterPassword(!showRegisterPassword)} style={styles.eyeButton}>
              {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div style={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme a Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
            <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button onClick={handleSignUp} style={styles.button}>Inscrever-se</button>
          <div style={styles.linksContainer}>
            <button onClick={() => setIsSignUp(false)} style={styles.linkButton}>Já tem uma conta? Faça login</button>
          </div>
        </div>
      ) : (
        <div style={styles.modalContent}>
          <h2>Faça login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={styles.input}
          />
          <div style={styles.passwordContainer}>
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Senha"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={styles.input}
            />
            <button onClick={() => setShowLoginPassword(!showLoginPassword)} style={styles.eyeButton}>
              {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div style={styles.rememberMeContainer}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              style={styles.checkbox}
            />
            <label>Lembrar-me de mim</label>
          </div>
          <button onClick={handleLogin} style={styles.button}>Login</button>
          <div style={styles.linksContainer}>
            <button onClick={() => setIsResetPassword(true)} style={styles.linkButton}>Esqueci a senha</button>
            <button onClick={() => setIsSignUp(true)} style={styles.linkButton}>Ainda não tem uma conta?</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#2183cf', // Azul
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff', // Branco
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
    color: '#000', // Preto para o texto
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Efeito de sombra
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  rememberMeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px 0',
  },
  checkbox: {
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
  },
  linksContainer: {
    marginTop: '20px',
  },
  linkButton: {
    display: 'block',
    color: '#007bff', // Azul para os links
    background: 'none',
    border: 'none',
    textDecoration: 'underline',
    marginTop: '10px',
    cursor: 'pointer',
    padding: 0,
  },
};

export default LoginModal;