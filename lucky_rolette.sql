
CREATE DATABASE lucky_roulett;
USE lucky_roulette;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    saldo DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('deposito', 'saque') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
DROP TABLE transacoes;
SELECT * FROM transacoes WHERE usuario_id = 3;

SHOW TABLES;
DESCRIBE usuarios;
DESCRIBE transacoes;
INSERT INTO usuarios (nome, email, senha, saldo)
VALUES ('Deivid', 'deivid@example.com', '123456', 100.00);

INSERT INTO transacoes (usuario_id, valor, tipo)
VALUES (1, 50.00, 'deposito');

SELECT * FROM usuarios;
SELECT * FROM transacoes;
SELECT * FROM usuarios WHERE email = 'teste3@gmail.com';

CREATE TABLE historico_jogadas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('x1', 'x5') NOT NULL,
    premiacao ENUM('N/A', 'R$100', 'R$2', 'R$1') DEFAULT 'N/A',
    resultado ENUM('Ganhou', 'Perdeu') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
SELECT * FROM historico_transacoes WHERE usuario_id = 3 ORDER BY data DESC;
CREATE TABLE historico_transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('deposito', 'saque') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


INSERT INTO historico_transacoes (usuario_id, tipo, valor)
VALUES (1, 'deposito', 100.00);
DELETE FROM usuarios WHERE id = 1;
SELECT * FROM historico_transacoes WHERE usuario_id = 1;


DROP TABLE historico_transacoes;
SELECT * FROM historico_jogadas;
