# InovaCare

Plataforma de assistência médica e terapêutica nas modalidades **online** e **domiciliar**, desenvolvida como Trabalho de Conclusão de Curso do Técnico em Informática para Internet do ITB Brasílio Flores de Azevedo.

---

## 📌 Contexto e Problema

Mais de **100 milhões de brasileiros** enfrentam dificuldades de acesso aos serviços de saúde, principalmente:

- Longas filas de espera no SUS;
- Altos custos de planos de saúde privados (especialmente para idosos);
- Dificuldade de locomoção até unidades de saúde.

Com o envelhecimento populacional (idosos já representam **10,9%** da população brasileira), a demanda por atendimento acessível e humanizado cresce ainda mais.

---

## 💡 Solução Proposta

A **InovaCare** conecta **pacientes** a **profissionais da saúde** (médicos, psicólogos, fonoaudiólogos, etc.) por meio de uma plataforma web que permite:

- Agendamento de consultas **online** ou **domiciliares**;
- Pagamento integrado via **Mercado Pago**;
- Disponibilização de **prontuários, receitas e pedidos de exames**;
- Avaliação e feedback sobre os profissionais.

O modelo de negócio baseia-se em uma **taxa de intermediação de 15% a 20%** sobre o valor da consulta, cobrada do profissional.

---

## 🎯 Público-Alvo

- **Faixa etária:** 30 a 60 anos (população em idade mediana) e idosos;
- **Classe social:** C (renda familiar entre R$ 2.005 e R$ 8.640);
- **Região:** Grande São Paulo (cerca de 1,05 milhão de pessoas com esse perfil).

---

## ⚙️ Funcionalidades Principais

### 👤 Paciente
- Cadastro e login com verificação por e-mail;
- Busca e filtro de profissionais por especialidade, modalidade de atendimento, localização;
- Visualização de perfis e agendamento de consultas;
- Pagamento online;
- Acesso a histórico de consultas, receitas, exames e prontuários;
- Avaliação de profissionais.

### 👨‍⚕️ Profissional de Saúde
- Cadastro e configuração de perfil (especialidade, preços, modalidades, áreas de atuação);
- Gerenciamento de agenda (dias, horários, pausas);
- Visualização de consultas agendadas e passadas;
- Registro de prontuários, receitas e pedidos de exames;
- Recebimento de pagamentos (após a consulta).

### 🛠️ Administração (Equipe InovaCare)
- Gerenciamento de usuários, especialidades e avaliações;
- Monitoramento de consultas e pagamentos;
- Aplicação de taxas sobre as consultas;
- Suspensão de contas, se necessário.

---

## 🧰 Tecnologias Utilizadas

| Área          | Tecnologias |
|---------------|-------------|
| **Front-End** | HTML, CSS, JavaScript, jQuery, AJAX, EJS (templates) |
| **Back-End**  | Node.js, Express, Multer |
| **Banco de Dados** | MySQL |
| **Pagamento** | Mercado Pago (gateway) |
| **Modelagem** | BrModelo (conceitual/lógico), MySQL Workbench (físico) |
| **Ferramentas** | Git, GitHub |

---

## 🗂️ Modelagem de Dados

O banco de dados foi projetado com as principais entidades:

- `usuarios` (tipo: paciente, profissional, administrador)
- `pacientes`, `especialistas`
- `especialidades`
- `disponibilidade_especialista`
- `agenda_paciente` (consultas)
- `prontuario`, `receita`, `exame`
- `avaliacoes`

Os modelos conceitual, lógico e físico estão detalhados no documento original.

---

## 🚀 Como Executar 

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/inovacare.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados MySQL com o script disponível em `database.sql`.

4. Crie um arquivo `.env` com as variáveis de ambiente (porta, credenciais do banco, chave do Mercado Pago etc.).

5. Inicie o servidor:
   ```bash
   node app.js
   ```

6. Acesse `http://localhost:3000` no navegador.

---

## 👥 Equipe

- Arthur Cezar Tenorio da Silva  
- Erick Barbosa Lima de Paiva  
- Gabrielle Salustiano Putini  
- Hebert Weky Filinto da Silva  
- Lohany Martins da Silva  
- Luisa Marques dos Santos  
- Nicole Souza Matos  
- Rayssa Silva Rodrigues  

**Orientador:** Prof. Paulo Barcellos  
**Instituição:** ITB Brasílio Flores de Azevedo – Barueri/SP, 2025

---

## 📄 Documentação Completa

O relatório completo com todas as análises, diagramas, regras de negócio e capturas de tela está disponível no arquivo [`DOC-20251127-WA0283..pdf`](DOC-20251127-WA0283..pdf) (ou no link fornecido).

---

## 🔮 Próximos Passos (Sugestões)

- Desenvolver um **aplicativo mobile** para ampliar o alcance;
- Integrar com **planos de saúde populares** e sistemas públicos;
- Adicionar **telemonitoramento** de pacientes crônicos;
- Utilizar **inteligência artificial** para personalizar recomendações.

---

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos. Consulte os autores para uso comercial.

---

**InovaCare – tecnologia a serviço da saúde e humanização.** ❤️
