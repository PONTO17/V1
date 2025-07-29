# Instruções para Configurar o Google Sheets

## Passo 1: Criar uma Planilha no Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em "Criar uma nova planilha"
3. Renomeie a planilha para "Sistema de Cadastro de Serviços"
4. Copie o ID da planilha da URL (a parte entre `/d/` e `/edit`)
   - Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789/edit`
   - O ID seria: `1ABC123DEF456GHI789`

## Passo 2: Configurar o Google Apps Script

1. Na planilha, vá em **Extensões** > **Apps Script**
2. Apague todo o código padrão do arquivo `Code.gs`
3. Copie e cole todo o conteúdo do arquivo `google-apps-script.js`
4. Na linha que contém `const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI';`, substitua `SEU_SPREADSHEET_ID_AQUI` pelo ID da sua planilha
5. Salve o projeto (Ctrl+S)
6. Clique em **Implantar** > **Nova implantação**
7. Clique no ícone de engrenagem ao lado de "Tipo" e selecione **Aplicativo da Web**
8. Configure:
   - **Descrição**: Sistema de Cadastro de Serviços
   - **Executar como**: Eu (seu email)
   - **Quem tem acesso**: Qualquer pessoa
9. Clique em **Implantar**
10. Copie a **URL do aplicativo da Web** que será gerada

## Passo 3: Configurar o Sistema

1. Abra o arquivo `script.js`
2. Na linha que contém `scriptUrl: 'https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec'`, substitua `SEU_SCRIPT_ID_AQUI` pela URL completa que você copiou no passo anterior
3. Na linha que contém `spreadsheetId: 'SEU_SPREADSHEET_ID_AQUI'`, substitua `SEU_SPREADSHEET_ID_AQUI` pelo ID da sua planilha

## Passo 4: Testar a Integração

1. No Google Apps Script, execute a função `testIntegration()` para verificar se tudo está funcionando
2. Abra o arquivo `index.html` no navegador
3. Faça um cadastro de teste
4. Verifique se os dados aparecem na planilha do Google Sheets

## Estrutura da Planilha

A planilha terá automaticamente as seguintes colunas:
- **ID**: Número sequencial do cadastro
- **Nome**: Nome do cliente
- **Telefone**: Telefone do cliente
- **Objetos**: Objetos/equipamentos
- **Descrição**: Descrição do serviço
- **Data Entrada**: Data de entrada do serviço
- **Data Retirada**: Data prevista de retirada
- **Valor**: Valor do serviço
- **Pagou**: Status de pagamento (Nao pago, Sinal, Pago)
- **Status**: Status do serviço (EM ORÇAMENTO, EM CONSERTO, CONCLUIDO)

## Funcionalidades Automáticas

- **Formatação Condicional**: Linhas com status "CONCLUIDO" ficam verdes
- **Sincronização Automática**: Toda alteração no sistema é salva automaticamente na planilha
- **Carregamento Automático**: Ao abrir o sistema, os dados são carregados da planilha

## Permissões Necessárias

Quando executar pela primeira vez, o Google Apps Script solicitará permissões para:
- Acessar suas planilhas do Google
- Conectar-se a serviços externos

Aceite todas as permissões para que o sistema funcione corretamente.

## Solução de Problemas

### Erro "Script function not found"
- Verifique se o código foi colado corretamente no Google Apps Script
- Certifique-se de que salvou o projeto

### Erro "Permission denied"
- Execute a função `testIntegration()` no Google Apps Script para autorizar as permissões
- Verifique se a planilha está acessível

### Dados não aparecem na planilha
- Verifique se o ID da planilha está correto no código
- Verifique se a URL do Apps Script está correta no arquivo `script.js`
- Abra o console do navegador (F12) para ver mensagens de erro

### Erro de CORS
- Certifique-se de que a implantação do Apps Script está configurada para "Qualquer pessoa" ter acesso
- Verifique se a URL está correta e completa

