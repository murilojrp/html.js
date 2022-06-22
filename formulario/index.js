const formulario = document.getElementById('formulario');
const tabelaAmiga = document.getElementById('tabelaAmiga');

popularTabelaAoCarregarPagina();
adicionarEventosDosBotoesDeExclusao();

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    let data = $('#formulario').serializeArray();
    let cadastro = arraytToObject(data);

    
    //SET - Setar, definir, salvar
    //GET - Pegar, buscar
    
    //recuperar os registros já cadastrados no banco
    //como no banco ta cadastrado como string, precisamos do JSON.parse()
    //para forçar a ser um objeto/array
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    
    let cpfDuplicado = cadastros
    .map(pessoaCPF => (JSON.parse(pessoaCPF)).cpf) //percorrendo o array de cadastros e formando um novo array só com o código
    .includes(cadastro.cpf); // verifica com o array formado se o código do cadastro novo já está cadastrado
    
    if (cpfDuplicado) {
        alert('Essa pessoa já foi assassinada, favor digitar o CPF de uma pessoa viva.');
        return;
    }
    
    //adiciona o cadastro que esta sendo cadastrado ao array de cadastros ja
    //cadastrados no banco de dados
    //- precisa ser com JSON.stringify() pois o banco apenas aceita string
    cadastros.push(JSON.stringify(cadastro));
    
    //atualizar os cadastros no banco de dados
    //- precisa ser com JSON.stringify() pois o banco apenas aceita string
    localStorage.setItem('cadastros', JSON.stringify(cadastros))
    adicionarCadastroNaTabela(cadastro);
    adicionarEventosDosBotoesDeExclusao();

});

// o parametro "array" deve ser gerado a partir da funcao
// .serializeArray() do jQuerry para funcionar corretamente
function arraytToObject(array){
    let object = {};
    array.forEach(campo => {
        object[campo.name] = campo.value;
    });
    return object;
}

function adicionarCadastroNaTabela(cadastro) {
    //cria um novo elemento <tr><tr> e atribui pra variavel tr
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <tr>

        <td>${cadastro.nomeCompleto}</td>
        <td>${cadastro.cpf}</td>
        <td>${cadastro.cidade}</td>
        <td>${cadastro.telefone}</td>
        <td>
            <button class="btn btn-outline-danger exclusao" data-cadastro="${cadastro.cpf}" data-nome="${cadastro.nomeCompleto}" >
                Excluir
            </button>
        </td>

        </tr>  
    `;
    tabelaAmiga.appendChild(tr);

}

function popularTabelaAoCarregarPagina(){
    let cadastrosDoLocalStorage = JSON.parse(localStorage.getItem('cadastros')) || [];
    cadastrosDoLocalStorage.forEach(cadastro => {
        cadastro = JSON.parse(cadastro);
        adicionarCadastroNaTabela(cadastro);
    });
};

function adicionarEventosDosBotoesDeExclusao() {
    //para garantir, a gente remove os eventos de todos os botoes
    $('.exclusao').toArray().forEach(botaoExclusao => {
        botaoExclusao.removeEventListener('click', (evento) => excluirRegistro(evento))
    });

    //cria os eventos novamente para os botoes
    $('.exclusao').toArray().forEach(botaoExclusao => {
        botaoExclusao.addEventListener('click', (evento) => excluirRegistro(evento))
    });

    function excluirRegistro(evento) {
        let pessoaCPF = evento.target.dataset.cadastro;
        let pessoaNome = evento.target.dataset.nome;
        if (confirm(`Deseja ressuscitar a pessoa ${pessoaNome}?`)) {
            //buscamos todos os cadastros cadastrados
            let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];

            //percorremos o array de cadastros cadastrados e transformamos
            //cada cadastro em um objeto (JSON.parse()) por que a gente precisa
            //acessar as propriedades do cadastro. sem o JSON.parse() o cadastro seria
            //uma string.
            cadastros = cadastros.map(cadastro => JSON.parse(cadastro));

            //findIndex
            // é um laço que percorre todo o array ATÉ QUE a condição seja TRUE
            let index = cadastros.findIndex(cadastro => cadastro.cpf == pessoaCPF);

            //remover do array com base do index retornado anteriormente
            cadastros.splice(index, 1);

            cadastros = cadastros.map(cadastro => JSON.stringify(cadastro));
            localStorage.setItem('cadastros', JSON.stringify(cadastros));
            document.location.reload(true);
        };
    }
} 