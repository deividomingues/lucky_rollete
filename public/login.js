
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.querySelector('input[name="email"]').value.trim();
    const senha = document.querySelector('input[name="senha"]').value;
    console.log('Email:', email);  
    console.log('Senha:', senha);  

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Erro desconhecido.');
            return;
        }

        const data = await response.json();
        console.log('Token recebido:', data.token);
        localStorage.setItem('token', data.token);  
        alert('Login bem-sucedido!');
        window.location.href = '/painel.html';  
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    }
});

