use bjsevbyqxbu27m7yhjmx


create table usuarios(
	id_usuario int unsigned primary key auto_increment, -- 1-pacieten 2- profisisonal - 3-adm/// 0-pendente - 1-ativo - 2 inativo - 3 bloqueado
    tipo_usuario char(1) ,
    status_usuario char(1) not null,
    nome_usuario varchar(70) not null,
    email_usuario varchar(35) not null,
    cpf_usuario char (14) unique not null,
    senha_usuario varchar(70) not null,
    foto_usuario varchar(255)
    
);

INSERT INTO usuarios (tipo_usuario, status_usuario, nome_usuario, email_usuario, cpf_usuario, senha_usuario, foto_usuario)
VALUES
-- Pacientes
('1', '1', 'Ana Souza', 'ana.souza@email.com', '123.456.789-00', 'senhaAna123', 'foto_ana.jpg'),
('1', '1', 'Carlos Lima', 'carlos.lima@email.com', '987.654.321-00', 'senhaCarlos123', 'foto_carlos.jpg'),

-- Especialistas
('2', '1', 'Fernanda Alves', 'fernanda.alves@email.com', '111.222.333-44', 'senhaFernanda123', 'foto_fernanda.jpg'),
('2', '1', 'João Mendes', 'joao.mendes@email.com', '555.666.777-88', 'senhaJoao123', 'foto_joao.jpg'),
('2', '1', 'Paula Ribeiro', 'paula.ribeiro@email.com', '999.888.777-66', 'senhaPaula123', 'foto_paula.jpg'),
('2', '1', ' Ricardo Torres', 'ricardo.torres@email.com', '444.333.222-11', 'senhaRicardo123', 'foto_ricardo.jpg');

select *from usuarios

create table administrador(
	id_adm int unsigned primary key auto_increment,
    id_usuario int unsigned not null,
	FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) -- relacionamento entre os campos chaves (primária e estrangeira)
    
   
);


create table pacientes(
    id_paciente INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dt_nasc_paciente DATE NOT NULL,
    logradouro_paciente varchar(100), 
    num_resid_paciente varchar(6) not null, 
    complemento_paciente varchar(50), 
    bairro_paciente varchar(30),
    cidade_paciente varchar(30),
    uf_paciente char(2),
    cep_paciente char(9) not null, 
    id_usuario int unsigned not null,
	FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) -- relacionamento entre os campos chaves (primária e estrangeira)
	-- TEMPORARIO latitude_paciente decimal(9,6) null,
	-- TEMPORARIO longitude_paciente decimal(9,6) null
);


INSERT INTO pacientes (
    dt_nasc_paciente, logradouro_paciente, num_resid_paciente, complemento_paciente,
    bairro_paciente, cidade_paciente, uf_paciente, cep_paciente, id_usuario
)
VALUES
-- Ana Souza
('1990-05-12', 'Rua das Flores', '123', 'Apto 101', 'Jardim Primavera', 'São Paulo', 'SP', '01234-567', 4),

-- Carlos Lima
('1985-08-22', 'Av. Central', '456', 'Casa', 'Centro', 'Barueri', 'SP', '06543-210', 5);

select *from pacientes

create table informacao_paciente(
	id_info_paciente int unsigned primary key auto_increment,
    diagnostico_paciente varchar(1000),
    medicamento_cont varchar(500),
    alergia varchar(150),
    cirurgia char(1),
    id_paciente int unsigned not null,
    
	FOREIGN KEY (id_paciente) REFERENCES pacientes (id_paciente) -- relacionamento entre os campos chaves (primária e estrangeira)

);

INSERT INTO informacao_paciente (
    diagnostico_paciente, medicamento_cont, alergia, cirurgia, id_paciente
)
VALUES
-- Ana Souza
('Hipertensão arterial controlada', 'Losartana 50mg 1x ao dia', 'Nenhuma', 'N', 5),

-- Carlos Lima
('Diabetes tipo 2', 'Metformina 850mg 2x ao dia', 'Alergia a penicilina', 'S', 5);




create table especialidades(
	id_especialidade int unsigned primary key auto_increment,
    nome_especialidade varchar(40) unique not null,
    tipo_registro varchar(20) not null
    
);


INSERT INTO especialidades (nome_especialidade, tipo_registro)
VALUES
('Clínico Geral', 'CRM'),
('Fisioterapeuta', 'CREFITO'),
('Fonoaudiólogo', 'CREFONO'),
('Nutricionista', 'CRN'),
('Psicólogo', 'CRP'),
('Enfermeiro', 'COREN'),
('Terapeuta Ocupacional', 'CREFITO');




create table especialistas(
	id_especialista int unsigned primary key auto_increment,
   dt_nasc_especialista DATE NOT NULL,
    logradouro_especialista varchar(100), 
    num_resid_especialista varchar(6) not null, 
    complemento_especialista varchar(50), 
    bairro_especialista varchar(30),
    cidade_especialista varchar(30),
    uf_especialista char(2),
    cep_especialista char(9) not null, 
    num_registro_especialista varchar(20) not null,
    
	id_usuario int unsigned not null,
	id_especialidade int unsigned not null,
   
    
	FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario), -- relacionamento entre os campos chaves (primária e estrangeira),
	FOREIGN KEY (id_especialidade) REFERENCES especialidades (id_especialidade) -- relacionamento entre os campos chaves (primária e estrangeira)


);
select *from especialistas

INSERT INTO especialistas (
    dt_nasc_especialista, logradouro_especialista, num_resid_especialista, complemento_especialista,
    bairro_especialista, cidade_especialista, uf_especialista, cep_especialista, num_registro_especialista,
    id_usuario, id_especialidade
)
VALUES
-- Dra. Fernanda Alves
('1982-03-15', 'Rua Harmonia', '101', 'Sala 5', 'Vila Mariana', 'São Paulo', 'SP', '04012-030', 'CRP123456', 6, 1),

-- Dr. João Mendes
('1975-11-02', 'Av. Paulista', '2020', 'Conj. 12', 'Bela Vista', 'São Paulo', 'SP', '01310-200', 'CRM654321', 7, 1),

-- Dra. Paula Ribeiro
('1990-07-08', 'Rua das Palmeiras', '88', 'Apto 302', 'Centro', 'Campinas', 'SP', '13010-001', 'CRN789456', 8, 1),

-- Dr. Ricardo Torres
('1980-09-25', 'Rua do Sol', '55', 'Casa', 'Jardim América', 'Barueri', 'SP', '06401-123', 'CREFITO321789', 9, 1);


create table informacao_especialista(
	id_info_especialista int unsigned primary key auto_increment,
    linkddin_especialista varchar(255),
    formacao_especialista varchar(1000),
    
    id_especialista int unsigned not null,
    
	FOREIGN KEY (id_especialista) REFERENCES especialistas (id_especialista) -- relacionamento entre os campos chaves (primária e estrangeira)

);

INSERT INTO informacao_especialista (
    linkddin_especialista, formacao_especialista, id_especialista
)
VALUES
-- Dra. Fernanda Alves
('https://www.linkedin.com/in/fernanda-alves', 'Graduação em Medicina pela USP. Residência em Clínica Médica no Hospital das Clínicas.', 1),

-- Dr. João Mendes
('https://www.linkedin.com/in/joao-mendes', 'Graduação em Medicina pela UNIFESP. Especialização em Clínica Geral.', 2),

-- Dra. Paula Ribeiro
('https://www.linkedin.com/in/paula-ribeiro', 'Graduação em Medicina pela UFMG. Pós-graduação em Medicina de Família e Comunidade.', 3),

-- Dr. Ricardo Torres
('https://www.linkedin.com/in/ricardo-torres', 'Graduação em Medicina pela PUC-SP. Mestrado em Clínica Médica.', 4);



create table locais(
   id_local INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
   cidade_local VARCHAR(40) UNIQUE NOT NULL
);

INSERT INTO locais (cidade_local)
VALUES
('São Paulo'),
('Barueri'),
('Guarulhos'),
('Osasco'),
('Santo André'),
('São Bernardo do Campo'),
('Diadema'),
('Mauá'),
('Carapicuíba'),
('Suzano'),
('Mogi das Cruzes'),
('Itaquaquecetuba'),
('Taboão da Serra'),
('Cotia'),
('Embu das Artes'),
('Ferraz de Vasconcelos'),
('Ribeirão Pires'),
('Rio Grande da Serra'),
('Caieiras'),
('Franco da Rocha'),
('Francisco Morato'),
('Itapevi'),
('Jandira'),
('Santana de Parnaíba'),
('Embu-Guaçu'),
('Vargem Grande Paulista'),
('Poá'),
('Arujá'),
('Biritiba Mirim'),
('Salesópolis');


create table especialista_local(
   id_especialista INT UNSIGNED NOT NULL,	-- foreign key
    id_local INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (id_especialista) REFERENCES especialistas (id_especialista), -- relacionamento entre os campos chaves (primária e estrangeira)
    FOREIGN KEY (id_local) REFERENCES locais (id_local) -- relacionamento entre os campos chaves (primária e estrangeira)
);

INSERT INTO especialista_local (id_especialista, id_local)
VALUES
-- Dra. Fernanda Alves atua em São Paulo e Santo André
(1, 1),
(1, 5),

-- Dr. João Mendes atua em Barueri e São Bernardo do Campo
(2, 2),
(2, 6),

-- Dra. Paula Ribeiro atua em Osasco
(3, 4),

-- Dr. Ricardo Torres atua em São Paulo
(4, 1);





create table disponibilidade_especialista (
	id_disponibilidade_especialista int unsigned primary key auto_increment,
    dia_semana int not null,
    hr_inicio time not null,
    hr_fim time not null,
    tipo_atendimento char(1) not null, -- 1- online - 2 domiciliar
    duracao_consulta int not null,
    preco_base decimal (6,2) not null,
    taxa_locomocao DECIMAL(5,2),
    id_especialista int unsigned not null,
    
	FOREIGN KEY (id_especialista) REFERENCES especialistas (id_especialista) -- relacionamento entre os campos chaves (primária e estrangeira)

 );
 
 INSERT INTO disponibilidade_especialista (
    dia_semana, hr_inicio, hr_fim, tipo_atendimento, duracao_consulta,
    preco_base, taxa_locomocao, id_especialista
)
VALUES
-- Dra. Fernanda Alves
(2, '09:00:00', '12:00:00', '1', 30, 150.00, NULL, 1), -- Terça-feira, online
(5, '14:00:00', '17:00:00', '2', 45, 200.00, 30.00, 1), -- Sexta-feira, domiciliar

-- Dr. João Mendes
(1, '08:00:00', '11:00:00', '2', 45, 180.00, 25.00, 2), -- Segunda-feira, domiciliar
(4, '13:00:00', '16:00:00', '1', 30, 140.00, NULL, 2), -- Quinta-feira, online

-- Dra. Paula Ribeiro
(3, '10:00:00', '13:00:00', '1', 30, 160.00, NULL, 3), -- Quarta-feira, online
(6, '15:00:00', '18:00:00', '2', 45, 210.00, 35.00, 3), -- Sábado, domiciliar

-- Dr. Ricardo Torres
(2, '08:30:00', '11:30:00', '2', 45, 190.00, 20.00, 4), -- Terça-feira, domiciliar
(5, '13:30:00', '16:30:00', '1', 30, 130.00, NULL, 4); -- Sexta-feira, online

 
 


create table pausa(
   id_pausa INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
   id_disponibilidade_especialista INT UNSIGNED NOT NULL,	-- foreign key
   hr_inicio_pausa TIME NOT NULL,
   hr_fim_pausa TIME NOT NULL,
   FOREIGN KEY (id_disponibilidade_especialista) REFERENCES disponibilidade_especialista (id_disponibilidade_especialista) -- relacionamento entre os campos chaves (primária e estrangeira)
);

INSERT INTO disponibilidade_especialista (
    dia_semana, hr_inicio, hr_fim, tipo_atendimento, duracao_consulta,
    preco_base, taxa_locomocao, id_especialista
)
VALUES
-- Dra. Fernanda Alves
(2, '09:00:00', '12:00:00', '1', 30, 150.00, NULL, 1), -- Terça-feira, online
(5, '14:00:00', '17:00:00', '2', 45, 200.00, 30.00, 1), -- Sexta-feira, domiciliar

-- Dr. João Mendes
(1, '08:00:00', '11:00:00', '2', 45, 180.00, 25.00, 2), -- Segunda-feira, domiciliar
(4, '13:00:00', '16:00:00', '1', 30, 140.00, NULL, 2), -- Quinta-feira, online

-- Dra. Paula Ribeiro
(3, '10:00:00', '13:00:00', '1', 30, 160.00, NULL, 3), -- Quarta-feira, online
(6, '15:00:00', '18:00:00', '2', 45, 210.00, 35.00, 3), -- Sábado, domiciliar

-- Dr. Ricardo Torres
(2, '08:30:00', '11:30:00', '2', 45, 190.00, 20.00, 4), -- Terça-feira, domiciliar
(5, '13:30:00', '16:30:00', '1', 30, 130.00, NULL, 4); -- Sexta-feira, online


/*INSERTS FORAM REALIZADOS ATÉ ESSE PONTO*/

create table agenda_paciente(
   id_agenda_paciente INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
   id_disponibilidade_especialista INT UNSIGNED NOT NULL,	-- foreign key
   id_paciente INT UNSIGNED NOT NULL,	-- foreign key   
   dt_consulta DATE NOT NULL,
   hr_consulta TIME NOT NULL,
   link_consulta varchar(255),
   -- distancia_km decimal(10,2),
   preco_base decimal (6,2) not null,
   taxa_locomocao DECIMAL(5,2),
   valor_total_consulta decimal(6,2) not null,
   status_agendamento char(1) not null, -- 0-pendente ou 1-concluída e 2-cancelada
   cancelamento_paciente char(1),
   justificativa_cancelamento_especialista varchar(200),
   
   FOREIGN KEY (id_disponibilidade_especialista) REFERENCES disponibilidade_especialista (id_disponibilidade_especialista), -- relacionamento entre os campos chaves (primária e estrangeira)
   FOREIGN KEY (id_paciente) REFERENCES pacientes (id_paciente) -- relacionamento entre os campos chaves (primária e estrangeira)
);




create table prontuario(
  id_prontuario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
   desc_prontuario VARCHAR(1000) NOT NULL,
   dt_emissao_prontuario DATETIME NOT NULL,
   id_paciente INT UNSIGNED NOT NULL,	-- foreign key  
   id_agenda_paciente int unsigned not null,
   
   FOREIGN KEY (id_paciente) REFERENCES pacientes (id_paciente), -- relacionamento entre os campos chaves (primária e estrangeira)
   foreign key (id_agenda_paciente) references agenda_paciente(id_agenda_paciente)
);


show tables

-- executada