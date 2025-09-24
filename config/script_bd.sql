create table usuarios(
    ID_USUARIO INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    TIPO_USUARIO CHAR(1) NOT NULL,
    STATUS_USUARIO CHAR(1) NOT NULL,
    NOME_USUARIO VARCHAR(70) NOT NULL,
    EMAIL_USUARIO VARCHAR(35) UNIQUE NOT NULL,
    CPF_USUARIO CHAR(11) UNIQUE NOT NULL,
    SENHA_USUARIO CHAR(6) NOT NULL,
    FOTO_USUARIO VARCHAR(255)
);

create table ADMINISTRADOR(
    ID_ADM INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ID_USUARIO INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS (ID_USUARIO) -- relacionamento entre os campos chaves (primária e estrangeira)
);

create table pacientes(
    id_paciente INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dt_nasc_paciente DATE NOT NULL,
    logradouro_paciente varchar(100), /*endereço - rua- avenida*/
    num_resid_paciente varchar(6) not null, /*num do tipo A123 se for apartamento*/
    complemento_paciente varchar(50), /*ALTERAR NOMENCLATURA NO BACK*/
    bairro_paciente varchar(30),
    cidade_paciente varchar(30),
    uf_paciente char(2),
    cep_paciente char(8) not null, /*ALTERAR NO BACK A NOMENCLATURA*/
    ID_USUARIO INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS (ID_USUARIO) -- relacionamento entre os campos chaves (primária e estrangeira)
	-- TEMPORARIO latitude_paciente decimal(9,6) null,
	-- TEMPORARIO longitude_paciente decimal(9,6) null
);

create table informacao_paciente(
    ID_INFO_PACIENTE INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    DIAGNOSTICO_PACIENTE varchar(1000),
    medicamento_cont varchar(500),
    alergia varchar(150),
    cirurgia CHAR(1),
    ID_PACIENTE INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTES (ID_PACIENTE) -- relacionamento entre os campos chaves (primária e estrangeira)
);


create table especialidades(
    ID_ESPECIALIDADE INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    NOME_ESPECIALIDADE VARCHAR(40) UNIQUE NOT NULL,
    TIPO_REGISTRO VARCHAR(8) UNIQUE NOT NULL
);


create table especialistas(
    ID_ESPECIALISTA INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    DT_NASC_ESPECIALISTA DATE NOT NULL,
    LOGRADOURO_ESPECIALISTA varchar(100), /*endereço - rua- avenida*/
    NUM_RES_ESPECIALISTA varchar(6) not null, /*num do tipo A123 se for apartamento*/
    COMPLEMENTO_ESPECIALISTA varchar(50), /*ALTERAR NOMENCLATURA NO BACK*/
    BAIRRO_ESPECIALISTA varchar(30),
    CIDADE_ESPECIALISTA varchar(30),
    UF_ESPECIALISTA char(2),
    CEP_ESPECIALISTA char(8) not null, /*ALTERAR NO BACK A NOMENCLATURA*/
    ID_ESPECIALIDADE INT UNSIGNED NOT NULL,	-- foreign key
    ID_USUARIO INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_USUARIO) REFERENCES USUARIOS (ID_USUARIO), -- relacionamento entre os campos chaves (primária e estrangeira)
    FOREIGN KEY (ID_ESPECIALIDADE) REFERENCES ESPECIALIDADES (ID_ESPECIALIDADE) -- relacionamento entre os campos chaves (primária e estrangeira)
	-- TEMPORARIO latitude_ESPECIALISTA decimal(9,6) null,
	-- TEMPORARIO longitude_ESPECIALISTA decimal(9,6) null
);


create table locais(
   ID_LOCAL INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
   CIDADE_LOCAL VARCHAR(40) UNIQUE NOT NULL
);


create table especialista_local(
    ID_ESPECIALISTA INT UNSIGNED NOT NULL,	-- foreign key
    ID_LOCAL INT UNSIGNED NOT NULL,	-- foreign key
    FOREIGN KEY (ID_ESPECIALISTA) REFERENCES ESPECIALISTAS (ID_ESPECIALISTA), -- relacionamento entre os campos chaves (primária e estrangeira)
    FOREIGN KEY (ID_LOCAL) REFERENCES LOCAIS (ID_LOCAL) -- relacionamento entre os campos chaves (primária e estrangeira)
);


create table disponibilidade_especialista(
   ID_AGENDA INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,	
   DIA_SEMANA INT NOT NULL,
   ID_ESPECIALISTA INT UNSIGNED NOT NULL,	-- foreign key
   HR_INICIO TIME NOT NULL,
   HR_FIM TIME NOT NULL,
   TIPO_ATENDIMENTO CHAR(1) NOT NULL,
  -- INTERVALO 
   DURACAO_CONSULTA INT NOT NULL,
   PRECO_BASE_ATUAL DECIMAL(6,2) NOT NULL,
   PRECO_BASE_ANTERIOR DECIMAL(6,2) NOT NULL,
   DT_ATUALIZACAO_PRECO_BASE DATE NOT NULL,
   TAXA_LOCOMOCAO_ATUAL DECIMAL(5,2),
   TAXA_LOCOMOCAO_ANTERIOR DECIMAL(5,2),
   DT_ATUALIZACAO_TAXA_LOCOMOCAO DATE NOT NULL,
   FOREIGN KEY (ID_ESPECIALISTA) REFERENCES ESPECIALISTAS (ID_ESPECIALISTA) -- relacionamento entre os campos chaves (primária e estrangeira)
);

create table pausa(
   ID_PAUSA INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
   ID_AGENDA INT UNSIGNED NOT NULL,	-- foreign key
   HR_INICIO_PAUSA TIME NOT NULL,
   HR_FIM_PAUSA TIME NOT NULL,
   FOREIGN KEY (ID_AGENDA) REFERENCES agenda_especialista (ID_AGENDA) -- relacionamento entre os campos chaves (primária e estrangeira)
);

create table agenda_paciente(
   ID_AGENDA_PACIENTE INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
   ID_AGENDA INT UNSIGNED NOT NULL,	-- foreign key
   ID_PACIENTE INT UNSIGNED NOT NULL,	-- foreign key   
   DT_CONSULTA DATE NOT NULL,
   HR_CONSULTA TIME NOT NULL,
   -- distancia_km decimal(10,2),
   TAXA_TOTAL_LOCOMOCAO DECIMAL(5,2),
   VALOR_TOTAL_CONSULTA DECIMAL(6,2) NOT NULL,
   STATUS_AGENDAMENTO CHAR(1) NOT NULL,
   CANCELAMENTO_PACIENTE CHAR(1),
   JUSTIFICATIVA_CANCELAMENTO_ESPECIALISTA VARCHAR(200),
   FOREIGN KEY (ID_AGENDA) REFERENCES agenda_especialista (ID_AGENDA) -- relacionamento entre os campos chaves (primária e estrangeira)
   FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTES (ID_PACIENTE) -- relacionamento entre os campos chaves (primária e estrangeira)
);

create table prontuario(
   ID_PRONTUARIO INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  
   DESC_PRONTUARIO VARCHAR(1000) NOT NULL
   DT_EMISSAO_PRONTUARIO DATETIME NOT NULL
   ID_PACIENTE INT UNSIGNED NOT NULL,	-- foreign key   
   FOREIGN KEY (ID_PACIENTE) REFERENCES PACIENTES (ID_PACIENTE) -- relacionamento entre os campos chaves (primária e estrangeira)
);