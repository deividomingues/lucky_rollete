// Alterna entre as seções
function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => {
      section.style.display = section.id === sectionId ? "block" : "none";
  });
}


// Token do usuário para autenticação
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    console.log('Token obtido do localStorage:', token);
});


// Função para carregar informações do usuário (nome e saldo)
async function carregarInfoUsuario() {
    try {
        const token = localStorage.getItem('token');  // Pegando o token armazenado

        if (!token) {
            throw new Error('Token não encontrado. Faça login novamente.');
        }

        const response = await fetch('/user/info', {
            method: 'GET',
            headers: { 'x-access-token': token }  // Enviando o token no cabeçalho
        });

        if (!response.ok) {
            throw new Error('Falha na autenticação. Faça login novamente.');
        }

        const data = await response.json();
        document.getElementById('usuarioNome').textContent = `Bem-vindo, ${data.nome}`;
        
        // Atualiza o saldo no DOM e no localStorage
        const saldo = parseFloat(data.saldo);
        if (!isNaN(saldo)) {
            localStorage.setItem('saldo', saldo);
            document.getElementById('saldo').querySelector('span').textContent = saldo.toFixed(2);
        } else {
            throw new Error('Erro ao carregar saldo do usuário.');
        }
    } catch (error) {
        console.error('Erro ao carregar informações do usuário:', error);
        alert(error.message);
        window.location.href = '/login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarSaldo(); // Inicializa o saldo ao carregar a página
    carregarHistoricoTransacoes(); // Inicializa o histórico de transações
});

// Atualiza o saldo no frontend e localStorage
function atualizarSaldo(novoSaldo) {
    novoSaldo = parseFloat(novoSaldo) || 0; // Garante que será um número válido
    localStorage.setItem('saldo', novoSaldo.toFixed(2));
    document.querySelector('#saldo span').textContent = novoSaldo.toFixed(2);
}

// Carrega o saldo do localStorage
async function carregarSaldo() {
    try {
        const response = await fetch('/user/info', {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token') // Envia o token para autenticação
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao carregar saldo.');
        }

        const result = await response.json();
        const saldo = result.saldo ?? 0; // Garante que saldo será 0 se for null ou undefined
        atualizarSaldo(saldo); // Atualiza o saldo no frontend
    } catch (error) {
        console.error("Erro ao carregar saldo:", error.message);
        alert(error.message);
    }
}

// Função para adicionar uma transação ao histórico
function registrarTransacao(tipo, valor) {
    const historico = JSON.parse(localStorage.getItem('historico_transacoes')) || [];
    historico.push({
        data: new Date().toLocaleString(),
        tipo: tipo,
        valor: parseFloat(valor).toFixed(2),
    });
    localStorage.setItem('historico_transacoes', JSON.stringify(historico));
    carregarHistoricoTransacoes();
}

// Exibe o histórico de transações na tabela
function carregarHistoricoTransacoes() {
    const historico = JSON.parse(localStorage.getItem('historico_transacoes')) || [];
    const corpoTabela = document.getElementById('transacoesCorpo');
    corpoTabela.innerHTML = '';

    historico.forEach(transacao => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${transacao.data}</td>
            <td>${transacao.tipo}</td>
            <td>R$${transacao.valor}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}

// Função para depósito
document.getElementById('depositoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const valor = parseFloat(event.target.valor.value);

    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor válido para depósito.');
        return;
    }

    const saldoAtual = parseFloat(localStorage.getItem('saldo')) || 0;
    const novoSaldo = saldoAtual + valor;

    atualizarSaldo(novoSaldo);
    registrarTransacao('Depósito', valor);
    alert('Depósito realizado com sucesso!');
    event.target.reset(); // Limpa o formulário
});

// Função para saque
document.getElementById('saqueForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const valor = parseFloat(event.target.valor.value);

    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor válido para saque.');
        return;
    }

    const saldoAtual = parseFloat(localStorage.getItem('saldo')) || 0;

    if (saldoAtual < valor) {
        alert('Saldo insuficiente para realizar o saque.');
        return;
    }

    const novoSaldo = saldoAtual - valor;

    atualizarSaldo(novoSaldo);
    registrarTransacao('Saque', valor);
    alert('Saque realizado com sucesso!');
    event.target.reset(); // Limpa o formulário
});




// Inicializa o saldo e carrega do Local Storage ou define como 100 por padrão
let saldo = parseFloat(localStorage.getItem('saldo')) || 100;
document.getElementById('saldo').querySelector('span').textContent = saldo.toFixed(2);

// Função para atualizar o saldo no Local Storage e no DOM
function atualizarSaldoUsuario(novoSaldo) {
    saldo = novoSaldo;
    localStorage.setItem('saldo', saldo);
    document.getElementById('saldo').querySelector('span').textContent = saldo.toFixed(2);
}

// Função para registrar a jogada no histórico e salvar no Local Storage
function registrarJogadaLocal(tipo, premiacao, resultado) {
    const jogadas = JSON.parse(localStorage.getItem('historico_jogadas')) || [];
    jogadas.push({
        data: new Date().toLocaleDateString(),
        tipo,
        premiacao,
        resultado
    });
    localStorage.setItem('historico_jogadas', JSON.stringify(jogadas));
    carregarHistoricoJogadasLocal();
}

// Função para carregar o histórico de jogadas do Local Storage
function carregarHistoricoJogadasLocal() {
    const jogadas = JSON.parse(localStorage.getItem('historico_jogadas')) || [];
    const jogadasCorpo = document.getElementById('jogadasCorpo');
    jogadasCorpo.innerHTML = '';

    jogadas.forEach(jogada => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jogada.data}</td>
            <td>${jogada.tipo}</td>
            <td>${jogada.premiacao}</td>
            <td>${jogada.resultado}</td>
        `;
        jogadasCorpo.appendChild(row);
    });
}

// Função para registrar a jogada ao girar a roleta
async function girarRoleta(tipo) {
    if (saldo < 5) {
        alert('Saldo insuficiente para girar a roleta.');
        return;
    }

    atualizarSaldoUsuario(saldo - 5); // Debita R$5 do saldo para cada jogada

    const wheel = document.getElementById("wheel");
    const resultDisplay = document.getElementById("resultado");

    const randomDegree = Math.floor(5000 + Math.random() * 5000);
    wheel.style.transition = "transform 4s cubic-bezier(0.3, 0.7, 0.4, 1)";
    wheel.style.transform = `rotate(${randomDegree}deg)`;

    resultDisplay.textContent = "Girando...";

    setTimeout(() => {
        const actualDegree = randomDegree % 360;
        const sliceCount = 6;
        const selectedOption = Math.floor((actualDegree / 360) * sliceCount);

        const premios = ["N/A", "R$100", "R$2", "R$1", "N/A", "N/A"];
        const premiacao = premios[selectedOption];
        const resultado = premiacao === "N/A" ? "Perdeu" : "Ganhou";

        resultDisplay.textContent = `Parou em: ${premiacao}`;

        if (resultado === "Ganhou") {
            const valorPremio = parseFloat(premiacao.replace("R$", ""));
            atualizarSaldoUsuario(saldo + valorPremio); // Adiciona o valor do prêmio ao saldo
        }

        registrarJogadaLocal(tipo, premiacao, resultado);

        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${actualDegree}deg)`;
    }, 4000);
}

// Botões para girar a roleta
document.getElementById('girarUmaVez').addEventListener('click', () => girarRoleta('x1'));
document.getElementById('girarCincoVezes').addEventListener('click', async () => {
    for (let i = 0; i < 5; i++) {
        await girarRoleta('x5');
    }
});

// Carrega o histórico de jogadas ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarHistoricoJogadasLocal();
});
