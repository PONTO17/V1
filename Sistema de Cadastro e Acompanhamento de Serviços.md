# Sistema de Cadastro e Acompanhamento de Serviços

Um sistema completo para cadastro, acompanhamento e gestão de serviços com integração automática ao Google Sheets.

## 🚀 Funcionalidades

### ✅ Cadastro de Serviços
- Formulário completo com validação
- Campos: Nome, Telefone, Objetos, Descrição, Dias úteis, Valor
- Opção de orçamento (oculta campo valor automaticamente)
- Formatação automática de telefone e valor monetário
- Cálculo automático de data de retirada

### ✅ Gestão de Dados
- Listagem em tabela organizada
- Edição inline de todos os campos
- Sistema de status (EM ORÇAMENTO, EM CONSERTO, CONCLUIDO)
- Controle de pagamento (Não pago, Sinal, Pago)
- Indicadores visuais coloridos para status
- Ordenação automática por status e data

### ✅ Funcionalidades Avançadas
- Busca por nome, telefone ou objeto
- Exclusão de registros com confirmação
- Impressão de recibos individuais
- Área de impressão formatada
- Cálculo automático de garantia (90 dias)

### ✅ Integração Google Sheets
- Salvamento automático na planilha
- Carregamento automático ao abrir o sistema
- Sincronização em tempo real
- Formatação condicional na planilha
- Backup automático de todos os dados

### ✅ Interface Moderna
- Design responsivo (desktop e mobile)
- Cores e gradientes modernos
- Animações e transições suaves
- Indicadores de carregamento
- Interface intuitiva e profissional

## 📁 Estrutura do Projeto

```
cadastro-servicos/
├── index.html                    # Interface principal
├── styles.css                    # Estilos e responsividade
├── script.js                     # Lógica da aplicação
├── google-apps-script.js         # Script para Google Apps Script
├── INSTRUCOES_GOOGLE_SHEETS.md   # Guia de configuração
├── RELATORIO_TESTES.md           # Relatório de testes
└── README.md                     # Este arquivo
```

## 🛠️ Instalação e Configuração

### Passo 1: Configurar Google Sheets
1. Siga as instruções detalhadas em `INSTRUCOES_GOOGLE_SHEETS.md`
2. Crie uma planilha no Google Sheets
3. Configure o Google Apps Script
4. Obtenha a URL do Web App

### Passo 2: Configurar o Sistema
1. Abra o arquivo `script.js`
2. Substitua `SEU_SCRIPT_ID_AQUI` pela URL do seu Google Apps Script
3. Substitua `SEU_SPREADSHEET_ID_AQUI` pelo ID da sua planilha

### Passo 3: Usar o Sistema
1. Abra o arquivo `index.html` no navegador
2. Comece a cadastrar serviços
3. Os dados serão salvos automaticamente no Google Sheets

## 💻 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Lógica da aplicação
- **Google Apps Script**: Integração com Google Sheets
- **Google Sheets API**: Armazenamento de dados

## 🎨 Características do Design

- **Cores**: Gradiente azul/roxo (#667eea → #764ba2)
- **Tipografia**: Arial, sans-serif
- **Layout**: Responsivo com breakpoints para mobile
- **Componentes**: Cards, botões modernos, tabelas estilizadas
- **Animações**: Transições suaves e hover effects

## 📊 Estrutura da Planilha

A planilha do Google Sheets terá as seguintes colunas:
- **ID**: Número sequencial
- **Nome**: Nome do cliente
- **Telefone**: Telefone formatado
- **Objetos**: Equipamentos/objetos
- **Descrição**: Descrição do serviço
- **Data Entrada**: Data de entrada
- **Data Retirada**: Data prevista de retirada
- **Valor**: Valor do serviço
- **Pagou**: Status de pagamento
- **Status**: Status do serviço

## 🔧 Funcionalidades Técnicas

### Validações
- Campos obrigatórios
- Formatação de telefone: (xx) xxxxx-xxxx
- Formatação de valor: xx,xx
- Validação de status vs pagamento

### Automações
- Cálculo automático de datas
- Salvamento automático no Google Sheets
- Carregamento automático de dados
- Ordenação por status e data
- Formatação condicional

### Responsividade
- Layout adaptável para mobile
- Tabela com scroll horizontal
- Botões empilhados em telas pequenas
- Formulário otimizado para touch

## 🖨️ Sistema de Impressão

O sistema inclui uma área de impressão formatada com:
- Cabeçalho da empresa (PONTO 17)
- Dados do cliente e serviço
- Informações de valor e datas
- Cálculo automático de garantia
- Termo de responsabilidade
- Espaços para assinaturas

## 🔒 Segurança e Privacidade

- Dados armazenados no Google Sheets do usuário
- Acesso controlado via Google Apps Script
- Validações client-side e server-side
- Confirmações para ações destrutivas

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Sistemas**: Windows, macOS, Linux, iOS, Android

## 🆘 Suporte e Solução de Problemas

Consulte o arquivo `INSTRUCOES_GOOGLE_SHEETS.md` para:
- Configuração passo a passo
- Solução de problemas comuns
- Dicas de uso
- Permissões necessárias

## 📈 Relatório de Testes

Consulte `RELATORIO_TESTES.md` para ver:
- Testes realizados
- Funcionalidades validadas
- Status de cada componente
- Próximos passos

## 🎯 Próximas Melhorias

- [ ] Backup automático local
- [ ] Exportação para PDF
- [ ] Notificações por email
- [ ] Dashboard de estatísticas
- [ ] Integração com WhatsApp
- [ ] Sistema de usuários

## 📞 Contato

Sistema desenvolvido para gestão profissional de serviços com foco em:
- Facilidade de uso
- Integração automática
- Design moderno
- Funcionalidades completas

---

**Versão**: 1.0  
**Data**: 29/07/2025  
**Status**: Pronto para produção

