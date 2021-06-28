CREATE DATABASE IF NOT EXISTS database1;

USE database1;

CREATE TABLE IF NOT EXISTS `evento`(
`id` int(11) not null auto_increment,
`Nombre` varchar(100),
`Descripcion` varchar(200),
`Lugar` varchar(30),
`Color` varchar(20),
`Fecha` date,
`Hora_inicio` time,
`Hora_fin` time,
PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='tabla de Eventos'; 

CREATE TABLE IF NOT EXISTS `lugar`(
`id` int(11) not null auto_increment,
`Lugar` varchar(30),
PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='tabla de Lugares'; 

CREATE TABLE IF NOT EXISTS `color`(
`id` int(11) not null auto_increment,
`Color` varchar(30),
PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='tabla de Colores'; 

INSERT INTO evento (Nombre, Descripcion, Lugar, Color, Fecha, Hora_inicio, Hora_fin)
VALUES ('Prueba','Descripcion de prueba', 'Bogota', 'yellow', '2021-06-25','15:42','16:00');

INSERT INTO color (Color)
VALUES ("yellow");
INSERT INTO color (Color)
VALUES ("blue");
INSERT INTO color (Color)
VALUES ("red");
INSERT INTO color (Color)
VALUES ("green");
INSERT INTO color (Color)
VALUES ("orange");

INSERT INTO lugar (Lugar)
VALUES ("Bogota");
INSERT INTO lugar (Lugar)
VALUES ("Medellin");
INSERT INTO lugar (Lugar)
VALUES ("Cali");
INSERT INTO lugar (Lugar)
VALUES ("Cartagena");
INSERT INTO lugar (Lugar)
VALUES ("Bucaramanga");
INSERT INTO lugar (Lugar)
VALUES ("Tunja");

