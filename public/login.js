
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Certifique-se de que os valores estão sendo capturados corretamente
    const email = document.querySelector('input[name="email"]').value.trim();
    const senha = document.querySelector('input[name="senha"]').value;
    console.log('Email:', email);  // Verifique se o email está correto
    console.log('Senha:', senha);  // Verifique se a senha está correta

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })  // Certifique-se de que envia os valores corretos
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Erro desconhecido.');
            return;
        }

        const data = await response.json();
        console.log('Token recebido:', data.token);
        localStorage.setItem('token', data.token);  // Salva o token no localStorage
        alert('Login bem-sucedido!');
        window.location.href = '/painel.html';  // Redireciona para o painel
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    }
});

