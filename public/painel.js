function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach(section => {
      section.style.display = section.id === sectionId ? "block" : "none";
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    console.log('Token obtido do sessionStorage:', token);
});

async function carregarInfoUsuario() {
    try {
        const token = sessionStorage.getItem('token'); 

        if (!token) {
            throw new Error('Token não encontrado. Faça login novamente.');
        }

        const response = await fetch('/user/info', {
            method: 'GET',
            headers: { 'x-access-token': token }  
        });

        if (!response.ok) {
            throw new Error('Falha na autenticação. Faça login novamente.');
        }

        const data = await response.json();
        document.getElementById('usuarioNome').textContent = `Bem-vindo, ${data.nome}`;
        
        
        const saldo = parseFloat(data.saldo);
        if (!isNaN(saldo)) {
            sessionStorage.setItem('saldo', saldo);
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
    carregarSaldo(); 
    carregarHistoricoTransacoes(); 
});

function atualizarSaldo(novoSaldo) {
    novoSaldo = parseFloat(novoSaldo) || 0; 
    sessionStorage.setItem('saldo', novoSaldo.toFixed(2));
    document.querySelector('#saldo span').textContent = novoSaldo.toFixed(2);
}

async function carregarSaldo() {
    try {
        const response = await fetch('/user/info', {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': sessionStorage.getItem('token') 
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao carregar saldo.');
        }

        const result = await response.json();
        const saldo = result.saldo ?? 0; 
        atualizarSaldo(saldo); 
    } catch (error) {
        console.error("Erro ao carregar saldo:", error.message);
        alert(error.message);
    }
}

function registrarTransacao(tipo, valor) {
    const historico = JSON.parse(sessionStorage.getItem('historico_transacoes')) || [];
    historico.push({
        data: new Date().toLocaleString(),
        tipo: tipo,
        valor: parseFloat(valor).toFixed(2),
    });
    sessionStorage.setItem('historico_transacoes', JSON.stringify(historico));
    carregarHistoricoTransacoes();
}

function carregarHistoricoTransacoes() {
    const historico = JSON.parse(sessionStorage.getItem('historico_transacoes')) || [];
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

document.getElementById('depositoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const valor = parseFloat(event.target.valor.value);

    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor válido para depósito.');
        return;
    }

    const saldoAtual = parseFloat(sessionStorage.getItem('saldo')) || 0;
    const novoSaldo = saldoAtual + valor;

    atualizarSaldo(novoSaldo);
    registrarTransacao('Depósito', valor);
    alert('Depósito realizado com sucesso! Reinicie a pagina para confirmar seu deposito');
    event.target.reset(); 
});

document.getElementById('saqueForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const valor = parseFloat(event.target.valor.value);

    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor válido para saque.');
        return;
    }

    const saldoAtual = parseFloat(sessionStorage.getItem('saldo')) || 0;

    if (saldoAtual < valor) {
        alert('Saldo insuficiente para realizar o saque.');
        return;
    }

    const novoSaldo = saldoAtual - valor;

    atualizarSaldo(novoSaldo);
    registrarTransacao('Saque', valor);
    alert('Saque realizado com sucesso! Reinicie a pagina para confirmar seu deposito');
    event.target.reset(); 
});



let saldo = parseFloat(sessionStorage.getItem('saldo')) || 0;
document.getElementById('saldo').querySelector('span').textContent = saldo.toFixed(2);

function atualizarSaldoUsuario(novoSaldo) {
    saldo = parseFloat(novoSaldo) || 0;


    sessionStorage.setItem('saldo', saldo.toFixed(2));
    document.getElementById('saldo').querySelector('span').textContent = saldo.toFixed(2);

    
    fetch('/user/atualizarSaldo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify({ saldo: novoSaldo  })
    }).then(response => {
        if (!response.ok) {
            console.error('Erro ao sincronizar saldo com o servidor.');
        }
    }).catch(error => {
        console.error('Erro ao atualizar saldo no backend:', error);
    });
}

function registrarJogadaLocal(tipo, premiacao, resultado) {
    const jogadas = JSON.parse(sessionStorage.getItem('historico_jogadas')) || [];
    jogadas.push({
        data: new Date().toLocaleDateString(),
        tipo,
        premiacao,
        resultado
    });
    sessionStorage.setItem('historico_jogadas', JSON.stringify(jogadas));
    carregarHistoricoJogadasLocal();
}

function carregarHistoricoJogadasLocal() {
    const jogadas = JSON.parse(sessionStorage.getItem('historico_jogadas')) || [];
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


async function girarRoleta(tipo) {
    if (saldo < 5) {
        alert('Saldo insuficiente para girar a roleta.');
        return;
    }

    atualizarSaldoUsuario(saldo - 5); 

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
            atualizarSaldoUsuario(saldo + valorPremio); 
        }

        registrarJogadaLocal(tipo, premiacao, resultado);

        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${actualDegree}deg)`;
    }, 4000);
}


document.getElementById('girarUmaVez').addEventListener('click', () => girarRoleta('x1'));
document.getElementById('girarCincoVezes').addEventListener('click', async () => {
    for (let i = 0; i < 5; i++) {
        await girarRoleta('x5');
    }
});


document.addEventListener("DOMContentLoaded", () => {
    carregarHistoricoJogadasLocal();
});
