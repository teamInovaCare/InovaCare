/*use bmxfca7secp7bnudzhk7;*/



CREATE TABLE usuarios(

    id_usuario INT unsigned PRIMARY KEY AUTO_INCREMENT  NOT NULL,

    tipo_usuario enum('paciente', 'profissional', 'adm') not null default 'paciente',

    status_usuario enum('ativo', 'inativo', 'pendente', 'banido') not null default 'ativo',

    nome_usuario VARCHAR(100) NOT NULL,

    email_usuario VARCHAR(50) NOT NULL UNIQUE,

    senha_usuario varchar(10) NOT NULL,

    cpf_usuario CHAR(11) NOT NULL UNIQUE,

    foto_usuario varchar(255)

);

alter table usuarios
modify column senha_usuario varchar(70) not null;

alter table usuarios
modify column cpf_usuario varchar(14) not null unique;





create table adm(

    id_adm int unsigned PRIMARY KEY AUTO_INCREMENT not null,

    fk_id_usuario  int unsigned not null,

    FOREIGN KEY(fk_id_usuario) references usuarios(id_usuario)

);



CREATE TABLE pacientes(

    id_paciente INT unsigned PRIMARY KEY AUTO_INCREMENT  NOT NULL,

    dt_nasc_paciente DATE NOT NULL,

    logradouro_paciente varchar(200),

    bairro_paciente varchar(50),

    cidade_paciente varchar(50),

    uf_paciente char(2),

    complemento varchar(200),

    cep char(8) not null,

    fk_id_usuario  int unsigned not null,

    foreign key(fk_id_usuario) references usuarios(id_usuario)  

);

alter table pacientes
modify column cep varchar(9);



create table info_paciente(

    id_info_paciente int unsigned primary key AUTO_INCREMENT not null,

    fk_id_paciente int unsigned not null,

    doença text,

    medicamento_cont text,

    alergia text,

    cirurgia text,

   

    FOREIGN key(fk_id_paciente) references pacientes(id_paciente)

);



create table especialidades(

    id_especialidade int unsigned primary key AUTO_INCREMENT not null,

    nome_especialidade varchar(45) not null,

    tipo_registro varchar(8) not null

);



create table especialistas(

    id_especialista int unsigned primary key AUTO_INCREMENT not null,

    fk_id_especialidade int unsigned not null,

    fk_id_usuario int unsigned not null,

    numregistro_especialidade int not null,

    logradouro_especialista varchar(200),

    bairro_especialista varchar(50),

    cidade_especialista varchar(50),

    uf_especialista char(2),

    complemento varchar(200),

    cep_especialista char(8) not null,

    FOREIGN key (fk_id_especialidade) references especialidades(id_especialidade),

    FOREIGN KEY (fk_id_usuario) references usuarios(id_usuario)

);






create table info_especialista(

    info_especialista int unsigned primary key AUTO_INCREMENT not null,

    fk_id_especialista int unsigned not null,

    descricao text,

    FOREIGN KEY(fk_id_especialista) REFERENCES especialistas(id_especialista)

);





 /*

create table LOCALIDADE(

   id_local int unsigned AUTO_INCREMENT primary key not null,

   nome_local varchar(50) unique

);

 

create table ESPECIALISTA_LOCAL(

    fk_id_especialista int not null,

    fk_id_local int not null,

    FOREIGN KEY(fk_id_especialista) references especialistas(id_especialista),

    FOREIGN KEY(fk_id_local) REFERENCES localidade(id_local)

);

 

create table DISPONIBILIDADE(

    id_disponiv int unsigned primary key AUTO_INCREMENT not null,

    fk_id_especialista int not null,

    data_hora datetime not null,

    tipo_atendimento enum('online', 'domiciliar') not null,

    preco_atendimento decimal(10,2) not null,

    taxa_atendimento decimal(10,2) not null,

    FOREIGN KEY(fk_id_especialista) references especialistas(id_especialista)

);

 

create table AGENDAMENTO(

    id_agendamento int unsigned primary key AUTO_INCREMENT not null,

    fk_id_disponibilidade int,

    fk_id_paciente int,

    dt_agendamento date,

    status_agendamento ENUM('pendente', 'confirmado', 'cancelado', 'remarcado') NOT NULL DEFAULT 'pendente',

    motivo_cancelamento text,

    FOREIGN KEY(fk_id_disponibilidade) references disponibilidade(id_disponiv),

    FOREIGN KEY(fk_id_paciente) references pacientes(id_paciente)

);

 

create table PRONTUARIO(

    id_prontuario int unsigned primary key AUTO_INCREMENT not null,

    prontuario text not null,

    dt_hr_prontuario datetime not null,

    fk_id_paciente int not null,

    FOREIGN key(fk_id_paciente) references pacientes(id_paciente)

);

 

create table RECEITA(

    id_receita int unsigned primary key AUTO_INCREMENT not null,

    receita_url varchar(255) not null,

    assinatura_digital varchar(255) ,

    hash_validacao char(64) ,

    dt_receita datetime not null,

    fk_id_paciente int,

    FOREIGN KEY(fk_id_paciente) references pacientes(id_paciente)

);

 

create table EXAME(

    id_exame int unsigned primary key AUTO_INCREMENT not null,

    exame_url varchar(255) not null,

    assinatura_digital varchar(255) ,

    hash_validacao char(64) ,

    dt_exame datetime not null,

    fk_id_paciente int,

    FOREIGN KEY(fk_id_paciente) REFERENCES pacientes(id_paciente)

);

 

create table CONSULTA(

    id_consulta int unsigned primary key not null,

    fk_id_agendamento int,

    fk_id_especialista int,

    dt_hr_consulta datetime,

    fk_id_prontuario int,

    fk_id_receita int,

    fk_id_exame int,

    status_consulta enum('agendada', 'concluida', 'cancelada', 'pront_pendente') not null default 'agendada',

    FOREIGN KEY(fk_id_agendamento) references agendamento(id_agendamento),

    FOREIGN KEY(fk_id_especialista) REFERENCES especialistas(id_especialista),

    FOREIGN KEY(fk_id_prontuario) references prontuario(id_prontuario),

    FOREIGN KEY(fk_id_receita) references receita(id_receita),

    FOREIGN KEY(fk_id_exame) REFERENCES exame(id_exame)

);

 

 

create table AVALIACAO(

    id_avaliacao int unsigned primary key AUTO_INCREMENT not null,

    dt_avaliacao datetime,

    fk_id_usuario_avalia int,

    fk_id_usuario_avaliado int,

    comentario text,

    estrelas INTEGER CHECK (estrelas BETWEEN 1 AND 5),

    FOREIGN key(fk_id_usuario_avalia) references usuarios(id_usuario),

    foreign key(fk_id_usuario_avaliado) references usuarios(id_usuario)

);