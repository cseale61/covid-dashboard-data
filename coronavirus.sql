DROP DATABASE IF EXISTS `coronavirus`;

CREATE DATABASE `coronavirus`;
USE `coronavirus`;

CREATE TABLE `covid19_history_by_state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` char(2) DEFAULT NULL,
  `date` varchar(10) DEFAULT NULL,
  `month_year` char(8) DEFAULT NULL,
  `totalTestResults` int(11) DEFAULT NULL,
  `positive` int(11) DEFAULT NULL,
  `positiveIncrease` int(11) DEFAULT NULL,
  `hospitalizedCurrently` int(11) DEFAULT NULL,
  `hospitalizedIncrease` int(11) DEFAULT NULL,
  `hospitalizedCumulative` int(11) DEFAULT NULL,
  `inIcuCurrently` int(11) DEFAULT NULL,
  `inIcuCumulative` int(11) DEFAULT NULL,
  `onVentilatorCurrently` int(11) DEFAULT NULL,
  `onVentilatorCumulative` int(11) DEFAULT NULL,
  `death` int(11) DEFAULT NULL,
  `deathIncrease` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state_id` char(2) DEFAULT NULL,
  `state_name` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


--
-- Dumping data for table `states`
--

INSERT INTO `states` VALUES (1,'AK','Alaska'),(2,'AL','Alabama'),(3,'AR','Arkansas'),(4,'AZ','Arizona'),(5,'CA','California'),(6,'CO','Colorado'),(7,'CT','Connecticut'),(8,'DC','District of Columbia'),(9,'DE','Delaware'),(10,'FL','Florida'),(11,'GA','Georgia'),(12,'HI','Hawaii'),(13,'IA','Iowa'),(14,'ID','Idaho'),(15,'IL','Illinois'),(16,'IN','Indiana'),(17,'KS','Kansas'),(18,'KY','Kentucky'),(19,'LA','Louisiana'),(20,'MA','Massachusetts'),(21,'MD','Maryland'),(22,'ME','Maine'),(23,'MI','Michigan'),(24,'MN','Minnesota'),(25,'MO','Missouri'),(26,'MS','Mississippi'),(27,'MT','Montana'),(28,'NC','North Carolina'),(29,'ND','North Dakota'),(30,'NE','Nebraska'),(31,'NH','New Hampshire'),(32,'NJ','New Jersey'),(33,'NM','New Mexico'),(34,'NV','Nevada'),(35,'NY','New York'),(36,'OH','Ohio'),(37,'OK','Oklahoma'),(38,'OR','Oregon'),(39,'PA','Pennsylvania'),(40,'PR','Puerto Rico'),(41,'RI','Rhode Island'),(42,'SC','South Carolina'),(43,'SD','South Dakota'),(44,'TN','Tennessee'),(45,'TX','Texas'),(46,'UT','Utah'),(47,'VA','Virginia'),(48,'VT','Vermont'),(49,'WA','Washington'),(50,'WI','Wisconsin'),(51,'WV','West Virginia'),(52,'WY','Wyoming');

--
-- Table structure for table `us_covid_totals`
--

CREATE TABLE `us_covid_totals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(10) DEFAULT NULL,
  `month_year` char(8) DEFAULT NULL,
  `totalTestResults` int(11) DEFAULT NULL,
  `positive` int(11) DEFAULT NULL,
  `positiveIncrease` int(11) DEFAULT NULL,
  `hospitalizedCurrently` int(11) DEFAULT NULL,
  `hospitalizedIncrease` int(11) DEFAULT NULL,
  `hospitalizedCumulative` int(11) DEFAULT NULL,
  `inIcuCurrently` int(11) DEFAULT NULL,
  `inIcuCumulative` int(11) DEFAULT NULL,
  `onVentilatorCurrently` int(11) DEFAULT NULL,
  `onVentilatorCumulative` int(11) DEFAULT NULL,
  `death` int(11) DEFAULT NULL,
  `deathIncrease` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
