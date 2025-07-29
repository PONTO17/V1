// Google Apps Script para integração com Google Sheets
// Este código deve ser copiado para o Google Apps Script

// ID da planilha do Google Sheets - SUBSTITUA PELO SEU ID
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI';
const SHEET_NAME = 'Cadastros';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'save':
        return saveData(data.cadastros);
      case 'load':
        return loadData();
      default:
        return createResponse(false, 'Ação não reconhecida');
    }
  } catch (error) {
    console.error('Erro no doPost:', error);
    return createResponse(false, 'Erro interno: ' + error.message);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'load') {
      return loadData();
    }
    
    return createResponse(false, 'Ação não reconhecida');
  } catch (error) {
    console.error('Erro no doGet:', error);
    return createResponse(false, 'Erro interno: ' + error.message);
  }
}

function saveData(cadastros) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Cria a aba se não existir
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Adiciona cabeçalhos
      const headers = [
        'ID', 'Nome', 'Telefone', 'Objetos', 'Descrição', 
        'Data Entrada', 'Data Retirada', 'Valor', 'Pagou', 'Status'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formata cabeçalhos
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#667eea');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // Limpa dados existentes (mantém cabeçalhos)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 10).clearContent();
    }
    
    // Adiciona novos dados
    if (cadastros && cadastros.length > 0) {
      const data = cadastros.map(cadastro => [
        cadastro.id,
        cadastro.nome,
        cadastro.telefone,
        cadastro.objetos,
        cadastro.descricao,
        cadastro.dataEntrada,
        cadastro.dataRetirada,
        cadastro.valor,
        cadastro.pagou,
        cadastro.status
      ]);
      
      sheet.getRange(2, 1, data.length, 10).setValues(data);
      
      // Formata dados
      const dataRange = sheet.getRange(2, 1, data.length, 10);
      dataRange.setHorizontalAlignment('center');
      
      // Aplica formatação condicional para status
      formatStatusColumn(sheet, data.length);
    }
    
    // Ajusta largura das colunas
    sheet.autoResizeColumns(1, 10);
    
    return createResponse(true, 'Dados salvos com sucesso');
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return createResponse(false, 'Erro ao salvar: ' + error.message);
  }
}

function loadData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createResponse(true, 'Planilha vazia', []);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return createResponse(true, 'Nenhum dado encontrado', []);
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
    
    const cadastros = data.map(row => ({
      id: row[0],
      nome: row[1],
      telefone: row[2],
      objetos: row[3],
      descricao: row[4],
      dataEntrada: formatDateFromSheet(row[5]),
      dataRetirada: formatDateFromSheet(row[6]),
      valor: row[7],
      pagou: row[8],
      status: row[9]
    })).filter(cadastro => cadastro.id); // Remove linhas vazias
    
    return createResponse(true, 'Dados carregados com sucesso', cadastros);
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return createResponse(false, 'Erro ao carregar: ' + error.message);
  }
}

function formatStatusColumn(sheet, dataLength) {
  try {
    // Formatação condicional para status CONCLUIDO
    const statusRange = sheet.getRange(2, 10, dataLength, 1);
    
    // Remove regras existentes
    sheet.clearConditionalFormatRules();
    
    // Regra para CONCLUIDO
    const rule1 = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('CONCLUIDO')
      .setBackground('#d4edda')
      .setRanges([sheet.getRange(2, 1, dataLength, 10)])
      .build();
    
    // Regra para EM ORÇAMENTO
    const rule2 = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('EM ORÇAMENTO')
      .setBackground('#fff3cd')
      .setRanges([sheet.getRange(2, 1, dataLength, 10)])
      .build();
    
    // Regra para EM CONSERTO
    const rule3 = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('EM CONSERTO')
      .setBackground('#cce5ff')
      .setRanges([sheet.getRange(2, 1, dataLength, 10)])
      .build();
    
    sheet.setConditionalFormatRules([rule1, rule2, rule3]);
    
  } catch (error) {
    console.error('Erro ao formatar status:', error);
  }
}

function formatDateFromSheet(dateValue) {
  if (!dateValue) return '';
  
  if (typeof dateValue === 'string') {
    return dateValue;
  }
  
  if (dateValue instanceof Date) {
    const day = String(dateValue.getDate()).padStart(2, '0');
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const year = dateValue.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  return String(dateValue);
}

function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Função para testar a integração
function testIntegration() {
  console.log('Testando integração...');
  
  const testData = [{
    id: 1,
    nome: 'Teste Cliente',
    telefone: '(11) 99999-9999',
    objetos: 'Relógio teste',
    descricao: 'Teste de descrição',
    dataEntrada: '29/07/2025',
    dataRetirada: '02/08/2025',
    valor: '50,00',
    pagou: 'Nao pago',
    status: 'EM CONSERTO'
  }];
  
  const saveResult = saveData(testData);
  console.log('Resultado do save:', saveResult.getContent());
  
  const loadResult = loadData();
  console.log('Resultado do load:', loadResult.getContent());
}

