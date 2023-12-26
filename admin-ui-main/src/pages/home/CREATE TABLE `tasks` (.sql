CREATE TABLE `tasks` (
  `idTasks` int NOT NULL AUTO_INCREMENT,
  `body` longtext,
  `task_date` datetime DEFAULT NULL,
  `title` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`idTasks`)
)