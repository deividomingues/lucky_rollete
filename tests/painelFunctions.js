// Mock implementation of localStorage for Node.js
const mockLocalStorage = (() => {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
})();

// Initialize global localStorage for Node.js
function inicializarLocalStorage() {
    global.localStorage = {
        store: {},
        getItem(key) {
            return this.store[key] || null;
        },
        setItem(key, value) {
            this.store[key] = String(value);
        },
        removeItem(key) {
            delete this.store[key];
        },
        clear() {
            this.store = {};
        },
    };
}

// Utility: Retrieve and parse JSON data from localStorage
function getParsedItem(key, defaultValue = null) {
    const value = mockLocalStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
}

// Utility: Save data as JSON in localStorage
function setParsedItem(key, value) {
    mockLocalStorage.setItem(key, JSON.stringify(value));
}

// Update user's balance
function atualizarSaldoUsuario(novoSaldo) {
    if (typeof novoSaldo !== 'number' || novoSaldo < 0) {
        throw new Error("Saldo inválido. Deve ser um número positivo.");
    }
    mockLocalStorage.setItem('saldo', novoSaldo);
}

// Register a game play in the history
function registrarJogadaLocal(tipo, premiacao, resultado) {
    const jogadas = getParsedItem('historico_jogadas', []);
    jogadas.push({
        data: new Date().toLocaleDateString(),
        tipo,
        premiacao,
        resultado,
    });
    setParsedItem('historico_jogadas', jogadas);
}

function carregarInfoUsuario() {
    if (typeof document === 'undefined') {
        throw new Error("carregarInfoUsuario requires a DOM environment.");
    }

    const nome = localStorage.getItem('nome');
    const saldo = localStorage.getItem('saldo');

    if (!nome || !saldo) {
        throw new Error("Informações do usuário não encontradas no localStorage.");
    }

    const usuarioNomeElement = document.getElementById('usuarioNome');
    const saldoElement = document.getElementById('saldo').querySelector('span');

    if (usuarioNomeElement) {
        usuarioNomeElement.textContent = `Bem-vindo, ${nome}`;
    }

    if (saldoElement) {
        saldoElement.textContent = saldo;
    }
}

// Function: girarRoleta
function girarRoleta(tipo) {
    if (typeof document === 'undefined') {
        throw new Error("girarRoleta requires a DOM environment.");
    }

    const saldoAtual = parseFloat(localStorage.getItem('saldo')) || 0;
    const custoPorJogo = 5;

    if (saldoAtual < custoPorJogo) {
        throw new Error("Saldo insuficiente para girar a roleta.");
    }

    const novoSaldo = saldoAtual - custoPorJogo;
    localStorage.setItem('saldo', novoSaldo);

    const resultados = ["Ganhou", "Perdeu"];
    const resultado = resultados[Math.floor(Math.random() * resultados.length)];

    const wheelElement = document.getElementById('wheel');
    const resultadoDisplay = document.getElementById('resultado');

    if (wheelElement) {
        wheelElement.textContent = `Resultado: ${resultado}`;
    }

    if (resultadoDisplay) {
        resultadoDisplay.textContent = `Você ${resultado}`;
    }

    registrarJogadaLocal(tipo, resultado === "Ganhou" ? "R$10" : "R$0", resultado);
}



// Export all functions
module.exports = {
    mockLocalStorage,
    inicializarLocalStorage,
    getParsedItem,
    setParsedItem,
    atualizarSaldoUsuario,
    registrarJogadaLocal,
    carregarInfoUsuario,
    girarRoleta,
};

