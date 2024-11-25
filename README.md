# Lucky Rollete

**Lucky Rollete** é um projeto de um jogo de roleta que permite aos usuários girarem a roleta, ganhar prêmios, fazer depósitos e saques, utilizando um saldo virtual. Este repositório contém o código completo da aplicação, incluindo o front-end, back-end e testes automatizados.

## Visão Geral do Projeto

O **Lucky Rollete** é composto por:
- Uma aplicação front-end em HTML, CSS e JavaScript, onde os usuários interagem com o painel da roleta, gerenciam o saldo e visualizam o histórico de transações.
- Um back-end em Node.js, que utiliza Express.js para criar APIs para autenticação, manipulação de saldo e registro das jogadas.
- Integração com um banco de dados para salvar informações de usuário, histórico de transações e autenticação segura com tokens JWT.
- Testes automatizados para garantir a estabilidade e consistência do código.

## Funcionalidades Principais
- **Cadastro e Login**: Os usuários podem se cadastrar e fazer login utilizando email e senha.
- **Depósito e Saque**: Os usuários podem realizar depósitos e saques para gerenciar seu saldo virtual.
- **Girar a Roleta**: Opção para girar a roleta uma ou cinco vezes, com possibilidade de ganhar prêmios que aumentam o saldo.
- **Histórico de Transações**: Registro de todas as transações realizadas pelo usuário, como depósitos, saques e resultados dos giros.

## Estrutura do Projeto

### Diretórios e Arquivos Principais
- **public/**: Contém os arquivos estáticos como HTML, CSS e JavaScript para a interface do usuário.
  - `login.html`, `painel.html`, `cadastro.html`: Interfaces principais.
  - `login.js`, `painel.js`: Scripts que manipulam a interface do usuário e fazem requisições às APIs.
  - `painel.css`, `login.css`, `cadastro.css`: Estilos CSS.
- **routes/**: Define as rotas da API, tanto para autenticação (login, cadastro) quanto para o gerenciamento do saldo, roleta e transações.
  - `auth.js`: Rota para autenticação do usuário (login e registro).
  - `user.js`: Rotas protegidas para interações com saldo, depósitos e saques.
- **server.js**: Arquivo principal que inicia o servidor e faz a configuração das rotas e middlewares.
- **db.js**: Configuração para se conectar ao banco de dados MySQL.
- **tests/**: Contém os arquivos de testes automatizados para funcionalidades específicas do projeto.
  - `painelFunctions.js`, `testes.js`: Testes simples para funcionalidades chave do projeto.

## Requisitos

Para rodar o projeto, você precisa ter:
- Node.js (v14+ recomendado)
- MySQL (para banco de dados)
- Git (para clonar o repositório)

### Instalação
1. Clone este repositório:
   ```sh
   git clone https://github.com/deividomingues/lucky_rollete.git
   cd lucky_rollete
   ```

2. Instale as dependências do projeto:
   ```sh
   npm install
   ```

3. Configure o banco de dados em `.env`:
   Crie um arquivo `.env` com as credenciais para o banco de dados MySQL e a chave secreta JWT, por exemplo:
   ```
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=lucky_rollete
   SECRET_KEY=sua_chave_secreta
   ```

4. Execute as migrações para criar as tabelas do banco de dados (opcional).

5. Execute o servidor:
   ```sh
   npm start
   ```

6. Abra o navegador e acesse: `http://localhost:3000`

## Como Contribuir

- Faça um fork deste repositório.
- Crie uma nova branch (`git checkout -b feature/MinhaNovaFeature`).
- Faça commit das suas alterações (`git commit -m 'Adicionar minha nova feature'`).
- Faça push para a branch (`git push origin feature/MinhaNovaFeature`).
- Abra um Pull Request.

## Licença
Este projeto é licenciado sob a licença MIT. Sinta-se à vontade para usar e modificar como desejar.

## Contato
Se tiver dúvidas ou sugestões, fique à vontade para abrir uma issue ou entrar em contato pelo GitHub.

---
Obrigado por conferir o projeto **Lucky Rollete**! 🎉 Que a sorte esteja sempre ao seu lado! ✨

