
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
                const error = await response.json();
                throw new Error(error.error || 'Erro ao fazer login.');
            }
    
            const result = await response.json();
            sessionStorage.setItem('token', result.token); 
            sessionStorage.setItem('nome', result.nome); 
            alert('Login realizado com sucesso!');
            window.location.href = '/painel.html'; 
        } catch (error) {
            console.error('Erro ao fazer login:', error.message);
            alert(error.message);
        }
    }
    
);

