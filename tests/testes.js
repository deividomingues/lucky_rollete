const { 
  atualizarSaldoUsuario, 
  registrarJogadaLocal, 
  mockLocalStorage, 
  inicializarLocalStorage, 
  carregarInfoUsuario, 
  girarRoleta 
} = require('./painelFunctions');

const { JSDOM } = require('jsdom');

inicializarLocalStorage();

function setupMockDOM() {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
      <body>
          <div id="usuarioNome"></div>
          <div id="saldo"><span></span></div>
          <div id="wheel"></div>
          <div id="resultado"></div>
      </body>
      </html>
  `);
  global.document = dom.window.document;
  global.window = dom.window;
}

function resetTestEnvironment() {
  mockLocalStorage.clear();
  setupMockDOM();
}

function runTest(name, testFn) {
  try {
      resetTestEnvironment();
      testFn();
      console.log(`Teste ${name} passou!`);
  } catch (error) {
      console.error(`Teste ${name} falhou:`, error.message);
  }
}

function testAtualizarSaldoUsuario() {
  atualizarSaldoUsuario(150);
  const saldo = parseFloat(mockLocalStorage.getItem("saldo"));
  if (saldo !== 150) {
      throw new Error(`Saldo esperado: 150, mas foi ${saldo}`);
  }
}

function testRegistrarJogadaLocal() {
  registrarJogadaLocal("x1", "R$2", "Ganhou");
  const jogadas = JSON.parse(mockLocalStorage.getItem("historico_jogadas"));
  if (!jogadas || jogadas.length === 0 || jogadas[0].premiacao !== "R$2") {
      throw new Error(`Histórico de jogadas não está correto: ${JSON.stringify(jogadas)}`);
  }
}

function testSaldoInicial() {
  mockLocalStorage.clear();
  let saldo = parseFloat(mockLocalStorage.getItem('saldo')) || 100;
  if (saldo !== 100) {
      throw new Error(`Saldo inicial esperado: 100, mas foi ${saldo}`);
  }
}

function testDebitarSaldo() {
  atualizarSaldoUsuario(100);
  const custoJogo = 5;
  atualizarSaldoUsuario(100 - custoJogo);
  const saldoAtual = parseFloat(mockLocalStorage.getItem("saldo"));
  if (saldoAtual !== 95) {
      throw new Error(`Saldo esperado após debitar R$5: 95, mas foi ${saldoAtual}`);
  }
}

function testRegistrarMultiplasJogadas() {
  mockLocalStorage.clear();
  registrarJogadaLocal("x1", "R$5", "Ganhou");
  registrarJogadaLocal("x1", "N/A", "Perdeu");
  const jogadas = JSON.parse(mockLocalStorage.getItem("historico_jogadas"));
  if (jogadas.length !== 2) {
      throw new Error(`Histórico de jogadas esperado: 2 entradas, mas foi ${jogadas.length}`);
  }
  if (jogadas[1].resultado !== "Perdeu") {
      throw new Error(`Resultado esperado da segunda jogada: Perdeu, mas foi ${jogadas[1].resultado}`);
  }
}

function testCarregarInfoUsuario() {
  localStorage.setItem('nome', 'Usuário Teste');
  localStorage.setItem('saldo', '150');

  carregarInfoUsuario();

  const nomeNoDOM = document.getElementById('usuarioNome').textContent;
  const saldoNoDOM = document.getElementById('saldo').querySelector('span').textContent;

  if (nomeNoDOM !== 'Bem-vindo, Usuário Teste' || saldoNoDOM !== '150') {
      throw new Error('Falha ao carregar informações do usuário.');
  }
}

function testGirarRoleta() {
  localStorage.setItem('saldo', '100');

  girarRoleta('x1');

  const saldoDebitado = parseFloat(localStorage.getItem('saldo'));
  if (saldoDebitado !== 95) {
      throw new Error('Saldo não foi debitado corretamente após girar a roleta.');
  }
}

runTest("Atualizar Saldo do Usuário", testAtualizarSaldoUsuario);
runTest("Registrar Jogada Local", testRegistrarJogadaLocal);
runTest("Saldo Inicial", testSaldoInicial);
runTest("Debitar Saldo", testDebitarSaldo);
runTest("Registrar Múltiplas Jogadas", testRegistrarMultiplasJogadas);
runTest("Carregar Info do Usuário", testCarregarInfoUsuario);
runTest("Girar Roleta", testGirarRoleta);

console.log("Todos os testes concluídos!");
