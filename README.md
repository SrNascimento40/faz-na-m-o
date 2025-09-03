# 📱 Central Fight - Aplicativo para Academias de Lutas

Um aplicativo React Native completo para gerenciamento de academias de lutas, desenvolvido com Expo e TypeScript.

## 🎯 Visão Geral

O Central Fight é uma plataforma que permite que academias de lutas gerenciem alunos, mensalidades e presença, enquanto os alunos acompanham seu progresso e realizam pagamentos diretamente pelo app.

## 👤 Perfis de Usuário

### 🥊 Aluno
- Visualiza informações pessoais e do plano
- Realiza pagamentos de mensalidades
- Faz check-in nos treinos (QR Code ou manual)
- Acompanha histórico de treinos e evolução
- Recebe notificações e lembretes
- Participa de eventos e campeonatos

### 🥋 Treinador/Dono da Academia
- Gerencia cadastro dos alunos
- Controla situação financeira da academia
- Acompanha frequência dos alunos
- Visualiza relatórios e estatísticas
- Organiza eventos e campeonatos
- Envia notificações para alunos

## ⚙️ Funcionalidades Implementadas

### 🔐 Autenticação
- [x] Sistema de login com email/senha
- [x] Seleção de tipo de usuário (Aluno/Treinador)
- [x] Persistência de sessão com AsyncStorage
- [x] Logout seguro

### 📱 Para Alunos

#### Tela Principal (Home)
- [x] Dashboard com estatísticas pessoais
- [x] Próximos treinos e eventos
- [x] Status de pagamento
- [x] Pontuação e ranking

#### Pagamentos
- [x] Visualização de mensalidades pendentes e pagas
- [x] Simulação de pagamento via Pix, cartão e boleto
- [x] Histórico de pagamentos
- [x] Notificações de vencimento

#### Check-in
- [x] Scanner QR Code para check-in automático
- [x] Check-in manual
- [x] Horários de treinos do dia
- [x] Histórico de presenças
- [x] Sistema de pontuação

#### Progresso
- [x] Acompanhamento de nível e evolução
- [x] Gráficos de frequência
- [x] Sistema de conquistas
- [x] Metas pessoais

#### Perfil
- [x] Informações pessoais
- [x] Dados do plano e modalidade
- [x] Edição de perfil
- [x] Configurações do app

### 🏋️ Para Treinadores

#### Dashboard
- [x] Visão geral da academia
- [x] Estatísticas de alunos ativos/inadimplentes
- [x] Receita mensal
- [x] Atividades recentes

#### Gestão de Alunos
- [x] Lista completa de alunos
- [x] Busca e filtros
- [x] Detalhes individuais dos alunos
- [x] Histórico de pagamentos e treinos
- [x] Check-in manual para alunos

#### Financeiro
- [x] Dashboard financeiro
- [x] Gráficos de receita
- [x] Pagamentos pendentes
- [x] Relatórios mensais

#### Relatórios
- [x] Visão geral da academia
- [x] Ranking de alunos mais assíduos
- [x] Análise financeira
- [x] Estatísticas de crescimento

### 🌟 Funcionalidades Adicionais

#### Eventos e Campeonatos
- [x] Lista de eventos disponíveis
- [x] Inscrições em campeonatos
- [x] Detalhes de eventos (seminários, graduações)
- [x] Histórico de participações

#### Notificações
- [x] Central de notificações
- [x] Filtros por tipo e status
- [x] Notificações de pagamento
- [x] Lembretes de treino
- [x] Avisos de eventos

#### Configurações
- [x] Configurações do aplicativo
- [x] Preferências de notificação
- [x] Informações da conta
- [x] Suporte e ajuda
- [x] Sobre o aplicativo

#### Scanner QR Code
- [x] Interface de scanner simulada
- [x] Processamento de QR codes
- [x] Feedback visual e sonoro
- [x] Fallback para check-in manual

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Navegação baseada em arquivos
- **AsyncStorage** - Persistência local
- **React Context** - Gerenciamento de estado
- **Expo Vector Icons** - Ícones

## 📁 Estrutura do Projeto

```
CentralFight/
├── app/                          # Telas do aplicativo
│   ├── (tabs)/                   # Navegação por abas
│   │   ├── index.tsx            # Tela principal
│   │   ├── payments.tsx         # Pagamentos (aluno)
│   │   ├── checkin.tsx          # Check-in (aluno)
│   │   ├── progress.tsx         # Progresso (aluno)
│   │   ├── students.tsx         # Alunos (treinador)
│   │   ├── financial.tsx        # Financeiro (treinador)
│   │   ├── reports.tsx          # Relatórios (treinador)
│   │   └── profile.tsx          # Perfil (ambos)
│   ├── auth/
│   │   └── login.tsx            # Tela de login
│   ├── student/
│   │   └── [id].tsx             # Detalhes do aluno
│   ├── events.tsx               # Eventos e campeonatos
│   ├── notifications.tsx        # Central de notificações
│   ├── settings.tsx             # Configurações
│   ├── qr-scanner.tsx          # Scanner QR Code
│   └── _layout.tsx              # Layout raiz
├── components/                   # Componentes reutilizáveis
├── context/                      # Contextos React
│   └── AuthContext.tsx          # Contexto de autenticação
├── data/                        # Dados mockados
│   └── mockData.ts              # Dados de exemplo
├── types/                       # Definições TypeScript
│   └── index.ts                 # Interfaces e tipos
└── constants/                   # Constantes do app
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (para testar no dispositivo)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd CentralFight
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Escaneie o QR Code com o Expo Go ou execute em um emulador.

## 🔑 Credenciais de Teste

### Aluno
- **Email:** aluno@centralfight.com
- **Senha:** 123456

### Treinador
- **Email:** treinador@centralfight.com
- **Senha:** 123456

## 📊 Dados de Exemplo

O aplicativo inclui dados mockados para demonstração:
- 10+ alunos com diferentes status
- Histórico de pagamentos
- Check-ins e presenças
- Eventos e campeonatos
- Notificações variadas

## 🎨 Design e UX

- Interface moderna e intuitiva
- Cores temáticas (vermelho #e74c3c)
- Componentes responsivos
- Feedback visual para ações
- Navegação fluida entre telas

## 📱 Funcionalidades Mobile

- Navegação por gestos
- Modais e overlays
- Refresh pull-to-refresh
- Estados de loading
- Tratamento de erros
- Persistência de dados

## 🔄 Próximas Funcionalidades

- [ ] Integração com backend real
- [ ] Pagamentos reais (Stripe/PagSeguro)
- [ ] Push notifications
- [ ] Chat entre aluno e treinador
- [ ] Agendamento de aulas
- [ ] Integração com redes sociais
- [ ] Modo offline
- [ ] Backup na nuvem

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@centralfight.com
- WhatsApp: (11) 99999-9999

---

**Central Fight** - Transformando a gestão de academias de luta! 🥊🥋
