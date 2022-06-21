const formulario = document.getElementById('formulario');
const tabelaAmiga = document.getElementById('tabelaAmiga');

popularTabelaAoCarregarPagina();

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    let data = $('#formulario').serializeArray();
    let cadastro = arraytToObject(data);

    adicionarCadastroNaTabela(cadastro);

    //SET - Setar, definir, salvar
    //GET - Pegar, buscar

    //recuperar os registros já cadastrados no banco
    //como no banco ta cadastrado como string, precisamos do JSON.parse()
    //para forçar a ser um objeto/array
    let cadastros = JSON.parse(localStorage.getItem('cadastros')) || [];
    
    //adiciona o produto que esta sendo cadastrado ao array de produtos ja
    //cadastrados no banco de dados
    //- precisa ser com JSON.stringify() pois o banco apenas aceita string
    cadastros.push(JSON.stringify(cadastro));

    //atualizar os produtos no banco de dados
    //- precisa ser com JSON.stringify() pois o banco apenas aceita string
    localStorage.setItem('cadastros', JSON.stringify(cadastros))
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

        <td>${cadastro.email}</td>
        <td>${cadastro.cpf}</td>
        <td>${cadastro.cidade}</td>
        <td>${cadastro.telefone}</td>

        </tr>  
    `;
    tabelaAmiga.appendChild(tr);

}

function popularTabelaAoCarregarPagina(){
    let produtosDoLocalStorage = JSON.parse(localStorage.getItem('cadastros')) || [];
    produtosDoLocalStorage.forEach(cadastro => {
    cadastro = JSON.parse(cadastro);
        adicionarCadastroNaTabela(cadastro);
});
};