// Configuração do Google Sheets
const GOOGLE_SHEETS_CONFIG = {
    // URL do Google Apps Script Web App - SUBSTITUA PELA SUA URL
    scriptUrl: 'https://script.google.com/macros/s/AKfycbxrrRqrF-CxMbnJHnbU4tjA5hhGqtP6bXjedm7ea4hLSxfeS2tnHst2v9x_52antrs/exec',
    // ID da planilha do Google Sheets - SUBSTITUA PELO SEU ID
    spreadsheetId: '1lC22ZVc8ghiZhF5OkPsjQJYd8CBeELr7Zl72crgCsEk'
};

// Variáveis globais
let registroCount = 1;
let cadastros = [];
let editingRow = null;

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadDataFromGoogleSheets();
}

function setupEventListeners() {
    // Formulário de cadastro
    const form = document.getElementById('cadastroForm');
    form.addEventListener('submit', handleFormSubmit);

    // Botão limpar
    const limparBtn = document.getElementById('limparBtn');
    limparBtn.addEventListener('click', limparFormulario);

    // Radio buttons de orçamento
    const radioButtons = document.querySelectorAll('input[name="orcamento"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', toggleValorField);
    });

    // Busca
    const toggleSearchBtn = document.getElementById('toggleSearchBtn');
    toggleSearchBtn.addEventListener('click', toggleSearch);

    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', searchServices);

    const clearSearchBtn = document.getElementById('clearSearchBtn');
    clearSearchBtn.addEventListener('click', clearSearch);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchServices();
        }
    });

    // Formatação de telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', formatTelefone);

    // Formatação de valor
    const valorInput = document.getElementById('valor');
    valorInput.addEventListener('input', formatValor);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const formData = getFormData();
        addCadastro(formData);
        saveToGoogleSheets();
        printRecibo(formData);
        limparFormulario();
    }
}

function validateForm() {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const objetos = document.getElementById('objetos').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const diasUteis = document.getElementById('diasUteis').value;

    if (!nome || !telefone || !objetos || !descricao || !diasUteis) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }

    const orcamentoNao = document.getElementById('orcamentoNao').checked;
    const valor = document.getElementById('valor').value.trim();
    
    if (orcamentoNao && !valor) {
        alert('Por favor, informe o valor do serviço.');
        return false;
    }

    return true;
}

function getFormData() {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const objetos = document.getElementById('objetos').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const diasUteis = parseInt(document.getElementById('diasUteis').value);
    const orcamentoSim = document.getElementById('orcamentoSim').checked;
    const valor = orcamentoSim ? 'ORÇAMENTO' : formatarValorMonetario(document.getElementById('valor').value);

    const hoje = new Date();
    const dataEntrada = formatDate(hoje);
    
    const dataRetirada = new Date(hoje);
    dataRetirada.setDate(dataRetirada.getDate() + diasUteis);
    const dataRetiradaFormatted = formatDate(dataRetirada);

    return {
        id: registroCount,
        nome,
        telefone,
        objetos,
        descricao,
        dataEntrada,
        dataRetirada: dataRetiradaFormatted,
        valor,
        pagou: 'Nao pago',
        status: orcamentoSim ? 'EM ORÇAMENTO' : 'EM CONSERTO'
    };
}

function addCadastro(data) {
    cadastros.push(data);
    addRowToTable(data);
    registroCount++;
    sortTableByStatusAndDate();
}

function addRowToTable(data) {
    const tbody = document.getElementById('cadastrosTableBody');
    const row = tbody.insertRow();
    row.setAttribute('data-id', data.id);
    row.setAttribute('data-descricao', data.descricao);

    // Células da tabela
    row.insertCell(0).textContent = data.id;
    createEditableCell(row, 1, data.nome);
    createEditableCell(row, 2, data.telefone);
    createEditableCell(row, 3, data.objetos);
    createEditableCell(row, 4, data.dataEntrada);
    createEditableCell(row, 5, data.dataRetirada);
    createEditableCell(row, 6, data.valor);

    // Coluna Pagou
    const pagouCell = row.insertCell(7);
    createPaymentSelect(pagouCell, data.pagou);

    // Coluna Status
    const statusCell = row.insertCell(8);
    createStatusSelect(statusCell, data.status, row);

    // Coluna Ações
    const actionsCell = row.insertCell(9);
    createActionButtons(actionsCell, row);

    updateRowStyleStatus(row, data.status);
}

function createEditableCell(row, cellIndex, value) {
    const cell = row.insertCell(cellIndex);
    cell.textContent = value;
    cell.setAttribute('data-original', value);
}

function createPaymentSelect(cell, currentValue) {
    const select = document.createElement('select');
    const options = ['Nao pago', 'Sinal', 'Pago'];
    
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
    
    select.value = currentValue;
    
    const bullet = document.createElement('span');
    bullet.className = 'pay-bullet';
    
    function updatePayBullet(value) {
        switch(value) {
            case 'Nao pago':
                bullet.style.backgroundColor = '#ff0000';
                break;
            case 'Sinal':
                bullet.style.backgroundColor = '#ffff00';
                break;
            case 'Pago':
                bullet.style.backgroundColor = '#00ff00';
                break;
            default:
                bullet.style.backgroundColor = 'transparent';
        }
    }
    
    select.addEventListener('change', function() {
        updatePayBullet(this.value);
        saveToGoogleSheets();
    });
    
    updatePayBullet(currentValue);
    
    cell.appendChild(select);
    cell.appendChild(bullet);
}

function createStatusSelect(cell, currentValue, row) {
    const select = document.createElement('select');
    const options = ['EM ORÇAMENTO', 'EM CONSERTO', 'CONCLUIDO'];
    
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
    
    select.value = currentValue;
    select.setAttribute('data-prev', currentValue);
    
    select.addEventListener('change', function() {
        const paymentSelect = row.cells[7].querySelector('select');
        
        if (this.value === 'CONCLUIDO' && paymentSelect.value !== 'Pago') {
            alert('O cliente precisa pagar para concluir a ordem de serviço.');
            this.value = this.getAttribute('data-prev');
            return;
        }
        
        if (confirm(`Deseja realmente alterar o status para ${this.value}?`)) {
            this.setAttribute('data-prev', this.value);
            updateRowStyleStatus(row, this.value);
            sortTableByStatusAndDate();
            saveToGoogleSheets();
        } else {
            this.value = this.getAttribute('data-prev');
        }
    });
    
    cell.appendChild(select);
}

function createActionButtons(cell, row) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'action-buttons';
    
    // Botão Editar
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn-edit';
    editBtn.addEventListener('click', () => toggleEdit(row, editBtn));
    
    // Botão Excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.className = 'btn-delete';
    deleteBtn.addEventListener('click', () => deleteRow(row));
    
    // Botão Imprimir
    const printBtn = document.createElement('button');
    printBtn.textContent = 'Imprimir';
    printBtn.className = 'btn-print';
    printBtn.addEventListener('click', () => printRowRecibo(row));
    
    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);
    buttonsContainer.appendChild(printBtn);
    
    cell.appendChild(buttonsContainer);
}

function toggleEdit(row, editBtn) {
    if (editingRow && editingRow !== row) {
        alert('Termine a edição da linha atual antes de editar outra.');
        return;
    }
    
    if (editBtn.textContent === 'Editar') {
        startEdit(row, editBtn);
    } else {
        finishEdit(row, editBtn);
    }
}

function startEdit(row, editBtn) {
    editingRow = row;
    editBtn.textContent = 'Salvar';
    
    // Torna as células editáveis (colunas 1-6)
    for (let i = 1; i <= 6; i++) {
        makeCellEditable(row.cells[i]);
    }
}

function finishEdit(row, editBtn) {
    editingRow = null;
    editBtn.textContent = 'Editar';
    
    // Finaliza a edição das células
    for (let i = 1; i <= 6; i++) {
        finalizeCellEdit(row.cells[i]);
    }
    
    saveToGoogleSheets();
}

function makeCellEditable(cell) {
    const value = cell.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.className = 'editing-input';
    cell.textContent = '';
    cell.appendChild(input);
}

function finalizeCellEdit(cell) {
    const input = cell.querySelector('input');
    if (input) {
        cell.textContent = input.value;
    }
}

function deleteRow(row) {
    if (confirm('Deseja realmente excluir este registro?')) {
        const id = parseInt(row.getAttribute('data-id'));
        cadastros = cadastros.filter(c => c.id !== id);
        row.remove();
        saveToGoogleSheets();
    }
}

function updateRowStyleStatus(row, status) {
    if (status === 'CONCLUIDO') {
        row.classList.add('linha-concluida');
    } else {
        row.classList.remove('linha-concluida');
    }
}

function sortTableByStatusAndDate() {
    const tbody = document.getElementById('cadastrosTableBody');
    const rows = Array.from(tbody.rows);
    
    rows.sort((a, b) => {
        const statusA = a.cells[8].querySelector('select').value;
        const statusB = b.cells[8].querySelector('select').value;
        
        const statusOrder = { 'EM ORÇAMENTO': 1, 'EM CONSERTO': 2, 'CONCLUIDO': 3 };
        
        if (statusOrder[statusA] !== statusOrder[statusB]) {
            return statusOrder[statusA] - statusOrder[statusB];
        }
        
        const dateA = parseDate(a.cells[4].textContent);
        const dateB = parseDate(b.cells[4].textContent);
        return dateA - dateB;
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

function toggleValorField() {
    const orcamentoSim = document.getElementById('orcamentoSim').checked;
    const valorGroup = document.getElementById('valorGroup');
    valorGroup.style.display = orcamentoSim ? 'none' : 'block';
}

function toggleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    searchContainer.classList.toggle('hidden');
}

function searchServices() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.getElementById('cadastrosTableBody').rows;
    
    for (let row of rows) {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    const rows = document.getElementById('cadastrosTableBody').rows;
    for (let row of rows) {
        row.style.display = '';
    }
}

function limparFormulario() {
    document.getElementById('cadastroForm').reset();
    document.getElementById('orcamentoNao').checked = true;
    toggleValorField();
}

function printRecibo(data) {
    fillPrintArea(data);
    window.print();
}

function printRowRecibo(row) {
    const data = {
        id: row.cells[0].textContent,
        nome: row.cells[1].textContent,
        telefone: row.cells[2].textContent,
        objetos: row.cells[3].textContent,
        descricao: row.getAttribute('data-descricao'),
        dataEntrada: row.cells[4].textContent,
        dataRetirada: row.cells[5].textContent,
        valor: row.cells[6].textContent
    };
    
    fillPrintArea(data);
    window.print();
}

function fillPrintArea(data) {
    document.getElementById('printId').textContent = data.id;
    document.getElementById('printNome').textContent = data.nome;
    document.getElementById('printTelefone').textContent = data.telefone;
    document.getElementById('printObjetos').textContent = data.objetos;
    document.getElementById('printDescricao').textContent = data.descricao;
    document.getElementById('printValor').textContent = data.valor;
    document.getElementById('printDataEntrada').textContent = data.dataEntrada;
    document.getElementById('printDataRetirada').textContent = data.dataRetirada;
    
    // Calcular garantia (90 dias após a data de retirada)
    const dataRetirada = parseDate(data.dataRetirada);
    const garantia = new Date(dataRetirada);
    garantia.setDate(garantia.getDate() + 90);
    document.getElementById('printGarantia').textContent = formatDate(garantia);
}

// Funções utilitárias
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function parseDate(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(0);
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function formatTelefone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        if (value.length < 14) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
    }
    e.target.value = value;
}

function formatValor(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    e.target.value = value;
}

function formatarValorMonetario(valorStr) {
    const num = parseFloat(valorStr.replace(',', '.').replace(/\./g, ''));
    if (isNaN(num)) return '___';
    return (num / 100).toFixed(2).replace('.', ',');
}

function showLoading() {
    document.getElementById('loadingIndicator').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingIndicator').classList.add('hidden');
}

// Funções do Google Sheets com melhor tratamento de CORS
async function saveToGoogleSheets() {
    if (!GOOGLE_SHEETS_CONFIG.scriptUrl || GOOGLE_SHEETS_CONFIG.scriptUrl.includes('SEU_SCRIPT_ID_AQUI')) {
        console.warn('URL do Google Apps Script não configurada');
        return;
    }
    
    try {
        showLoading();
        
        const data = {
            action: 'save',
            cadastros: getCurrentTableData()
        };
        
        // Usando fetch com modo no-cors para contornar problemas de CORS
        const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Com no-cors, não podemos ler a resposta, mas se chegou até aqui, provavelmente funcionou
        console.log('Dados enviados para o Google Sheets');
        
        // Aguarda um pouco e tenta carregar os dados para verificar se salvou
        setTimeout(() => {
            loadDataFromGoogleSheets();
        }, 2000);
        
    } catch (error) {
        console.error('Erro na comunicação com Google Sheets:', error);
        
        // Tenta uma abordagem alternativa usando JSONP
        try {
            await saveToGoogleSheetsJSONP(getCurrentTableData());
        } catch (jsonpError) {
            console.error('Erro também com JSONP:', jsonpError);
            alert('Erro na comunicação com Google Sheets. Verifique sua conexão e configuração.');
        }
    } finally {
        hideLoading();
    }
}

async function loadDataFromGoogleSheets() {
    if (!GOOGLE_SHEETS_CONFIG.scriptUrl || GOOGLE_SHEETS_CONFIG.scriptUrl.includes('SEU_SCRIPT_ID_AQUI')) {
        console.warn('URL do Google Apps Script não configurada');
        return;
    }
    
    try {
        showLoading();
        
        // Tenta primeiro com fetch normal
        try {
            const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl + '?action=load');
            const result = await response.json();
            
            if (result.success && result.data) {
                cadastros = result.data;
                populateTableFromData(result.data);
                
                // Atualiza o contador para o próximo ID
                if (result.data.length > 0) {
                    const maxId = Math.max(...result.data.map(c => c.id));
                    registroCount = maxId + 1;
                }
                
                console.log('Dados carregados do Google Sheets com sucesso');
            } else {
                console.log('Nenhum dado encontrado no Google Sheets');
            }
        } catch (fetchError) {
            console.log('Fetch normal falhou, tentando JSONP...');
            await loadDataFromGoogleSheetsJSONP();
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados do Google Sheets:', error);
        // Não mostra alert aqui para não incomodar o usuário no carregamento inicial
    } finally {
        hideLoading();
    }
}

// Função alternativa usando JSONP para contornar CORS
function saveToGoogleSheetsJSONP(data) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'saveCallback_' + Date.now();
        
        window[callbackName] = function(response) {
            document.head.removeChild(script);
            delete window[callbackName];
            resolve(response);
        };
        
        const params = new URLSearchParams({
            action: 'save',
            data: JSON.stringify(data),
            callback: callbackName
        });
        
        script.src = GOOGLE_SHEETS_CONFIG.scriptUrl + '?' + params.toString();
        script.onerror = () => {
            document.head.removeChild(script);
            delete window[callbackName];
            reject(new Error('JSONP request failed'));
        };
        
        document.head.appendChild(script);
        
        // Timeout após 10 segundos
        setTimeout(() => {
            if (window[callbackName]) {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('JSONP request timeout'));
            }
        }, 10000);
    });
}

function loadDataFromGoogleSheetsJSONP() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'loadCallback_' + Date.now();
        
        window[callbackName] = function(response) {
            document.head.removeChild(script);
            delete window[callbackName];
            
            if (response.success && response.data) {
                cadastros = response.data;
                populateTableFromData(response.data);
                
                if (response.data.length > 0) {
                    const maxId = Math.max(...response.data.map(c => c.id));
                    registroCount = maxId + 1;
                }
                
                console.log('Dados carregados via JSONP com sucesso');
            }
            
            resolve(response);
        };
        
        const params = new URLSearchParams({
            action: 'load',
            callback: callbackName
        });
        
        script.src = GOOGLE_SHEETS_CONFIG.scriptUrl + '?' + params.toString();
        script.onerror = () => {
            document.head.removeChild(script);
            delete window[callbackName];
            reject(new Error('JSONP request failed'));
        };
        
        document.head.appendChild(script);
        
        // Timeout após 10 segundos
        setTimeout(() => {
            if (window[callbackName]) {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('JSONP request timeout'));
            }
        }, 10000);
    });
}

function getCurrentTableData() {
    const tbody = document.getElementById('cadastrosTableBody');
    const rows = Array.from(tbody.rows);
    
    return rows.map(row => {
        const paymentSelect = row.cells[7].querySelector('select');
        const statusSelect = row.cells[8].querySelector('select');
        
        return {
            id: parseInt(row.cells[0].textContent),
            nome: row.cells[1].textContent,
            telefone: row.cells[2].textContent,
            objetos: row.cells[3].textContent,
            descricao: row.getAttribute('data-descricao') || '',
            dataEntrada: row.cells[4].textContent,
            dataRetirada: row.cells[5].textContent,
            valor: row.cells[6].textContent,
            pagou: paymentSelect ? paymentSelect.value : 'Nao pago',
            status: statusSelect ? statusSelect.value : 'EM CONSERTO'
        };
    });
}

function populateTableFromData(data) {
    const tbody = document.getElementById('cadastrosTableBody');
    tbody.innerHTML = ''; // Limpa a tabela
    
    data.forEach(cadastro => {
        addRowToTable(cadastro);
    });
    
    sortTableByStatusAndDate();
}

