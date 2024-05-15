-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: teach_for_social_good
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `DetonationQuestions`
--

DROP TABLE IF EXISTS `DetonationQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DetonationQuestions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `detonationSessionId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `detonationSessionId` (`detonationSessionId`),
  CONSTRAINT `DetonationQuestions_ibfk_1` FOREIGN KEY (`detonationSessionId`) REFERENCES `DetonationSessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DetonationQuestions`
--

LOCK TABLES `DetonationQuestions` WRITE;
/*!40000 ALTER TABLE `DetonationQuestions` DISABLE KEYS */;
/*!40000 ALTER TABLE `DetonationQuestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DetonationSessions`
--

DROP TABLE IF EXISTS `DetonationSessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DetonationSessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionOrderedModuleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionOrderedModuleId` (`sessionOrderedModuleId`),
  CONSTRAINT `DetonationSessions_ibfk_1` FOREIGN KEY (`sessionOrderedModuleId`) REFERENCES `SessionOrderedModules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DetonationSessions`
--

LOCK TABLES `DetonationSessions` WRITE;
/*!40000 ALTER TABLE `DetonationSessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `DetonationSessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EvaluationQuizMultiRadioQuestions`
--

DROP TABLE IF EXISTS `EvaluationQuizMultiRadioQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EvaluationQuizMultiRadioQuestions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluationQuizMultiRadioId` int DEFAULT NULL,
  `question` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluationQuizMultiRadioId` (`evaluationQuizMultiRadioId`),
  CONSTRAINT `EvaluationQuizMultiRadioQuestions_ibfk_1` FOREIGN KEY (`evaluationQuizMultiRadioId`) REFERENCES `EvaluationQuizMultiRadios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EvaluationQuizMultiRadioQuestions`
--

LOCK TABLES `EvaluationQuizMultiRadioQuestions` WRITE;
/*!40000 ALTER TABLE `EvaluationQuizMultiRadioQuestions` DISABLE KEYS */;
/*!40000 ALTER TABLE `EvaluationQuizMultiRadioQuestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EvaluationQuizMultiRadios`
--

DROP TABLE IF EXISTS `EvaluationQuizMultiRadios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EvaluationQuizMultiRadios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluationQuizOrderId` int DEFAULT NULL,
  `mainQuestion` varchar(255) NOT NULL,
  `nOptions` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluationQuizOrderId` (`evaluationQuizOrderId`),
  CONSTRAINT `EvaluationQuizMultiRadios_ibfk_1` FOREIGN KEY (`evaluationQuizOrderId`) REFERENCES `EvaluationQuizOrders` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EvaluationQuizMultiRadios`
--

LOCK TABLES `EvaluationQuizMultiRadios` WRITE;
/*!40000 ALTER TABLE `EvaluationQuizMultiRadios` DISABLE KEYS */;
/*!40000 ALTER TABLE `EvaluationQuizMultiRadios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EvaluationQuizMultipleAnswers`
--

DROP TABLE IF EXISTS `EvaluationQuizMultipleAnswers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EvaluationQuizMultipleAnswers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluationQuizOrderId` int DEFAULT NULL,
  `question` varchar(255) NOT NULL,
  `nAnswers` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluationQuizOrderId` (`evaluationQuizOrderId`),
  CONSTRAINT `EvaluationQuizMultipleAnswers_ibfk_1` FOREIGN KEY (`evaluationQuizOrderId`) REFERENCES `EvaluationQuizOrders` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EvaluationQuizMultipleAnswers`
--

LOCK TABLES `EvaluationQuizMultipleAnswers` WRITE;
/*!40000 ALTER TABLE `EvaluationQuizMultipleAnswers` DISABLE KEYS */;
/*!40000 ALTER TABLE `EvaluationQuizMultipleAnswers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EvaluationQuizOrders`
--

DROP TABLE IF EXISTS `EvaluationQuizOrders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EvaluationQuizOrders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluationQuizId` int DEFAULT NULL,
  `order` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluationQuizId` (`evaluationQuizId`),
  CONSTRAINT `EvaluationQuizOrders_ibfk_1` FOREIGN KEY (`evaluationQuizId`) REFERENCES `EvaluationQuizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EvaluationQuizOrders`
--

LOCK TABLES `EvaluationQuizOrders` WRITE;
/*!40000 ALTER TABLE `EvaluationQuizOrders` DISABLE KEYS */;
/*!40000 ALTER TABLE `EvaluationQuizOrders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EvaluationQuizQuestions`
--

DROP TABLE IF EXISTS `EvaluationQuizQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EvaluationQuizQuestions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluationQuizOrderId` int DEFAULT NULL,
  `question` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluationQuizOrderId` (`evaluationQuizOrderId`),
  CONSTRAINT `EvaluationQuizQuestions_ibfk_1` FOREIGN KEY (`evaluationQuizOrderId`) REFERENCES `EvaluationQuizOrders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EvaluationQuizQuestions`
--

LOCK TABLES `EvaluationQuizQuestions` WRITE;
/*!40000 ALTER TABLE `EvaluationQuizQuestions` DISABLE KEYS */;
/*!40000 ALTER TABLE `EvaluationQuizQuestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EvaluationQuizSingleRadios`
--

DROP TABLE IF EXISTS `EvaluationQuizSingleRadios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EvaluationQuizSingleRadios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evaluationQuizOrderId` int DEFAULT NULL,
  `question` varchar(255) NOT NULL,
  `nOptions` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluationQuizOrderId` (`evaluationQuizOrderId`),
  CONSTRAINT `EvaluationQuizSingleRadios_ibfk_1` FOREIGN KEY (`evaluationQuizOrderId`) REFERENCES `EvaluationQuizOrders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EvaluationQuizSingleRadios`
--

LOCK TABLES `EvaluationQuizSingleRadios` WRITE;
/*!40000 ALTER TABLE `EvaluationQuizSingleRadios` DISABLE KEYS */;
/*!40000 ALTER TABLE `EvaluationQuizSingleRadios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EvaluationQuizzes`
--

DROP TABLE IF EXISTS `EvaluationQuizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EvaluationQuizzes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionOrderedModuleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionOrderedModuleId` (`sessionOrderedModuleId`),
  CONSTRAINT `EvaluationQuizzes_ibfk_1` FOREIGN KEY (`sessionOrderedModuleId`) REFERENCES `SessionOrderedModules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EvaluationQuizzes`
--

LOCK TABLES `EvaluationQuizzes` WRITE;
/*!40000 ALTER TABLE `EvaluationQuizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `EvaluationQuizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ForumGroups`
--

DROP TABLE IF EXISTS `ForumGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ForumGroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumGroups`
--

LOCK TABLES `ForumGroups` WRITE;
/*!40000 ALTER TABLE `ForumGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `ForumGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ForumHistoryModules`
--

DROP TABLE IF EXISTS `ForumHistoryModules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ForumHistoryModules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionOrderedModuleId` int DEFAULT NULL,
  `linkedStep` int DEFAULT '-1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionOrderedModuleId` (`sessionOrderedModuleId`),
  CONSTRAINT `ForumHistoryModules_ibfk_1` FOREIGN KEY (`sessionOrderedModuleId`) REFERENCES `SessionOrderedModules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumHistoryModules`
--

LOCK TABLES `ForumHistoryModules` WRITE;
/*!40000 ALTER TABLE `ForumHistoryModules` DISABLE KEYS */;
/*!40000 ALTER TABLE `ForumHistoryModules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ForumMessages`
--

DROP TABLE IF EXISTS `ForumMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ForumMessages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userModuleResultId` int DEFAULT NULL,
  `userId` int NOT NULL,
  `step` int DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `messageNumber` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userModuleResultId` (`userModuleResultId`),
  KEY `userId` (`userId`),
  CONSTRAINT `ForumMessages_ibfk_3` FOREIGN KEY (`userModuleResultId`) REFERENCES `UserModuleResults` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ForumMessages_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumMessages`
--

LOCK TABLES `ForumMessages` WRITE;
/*!40000 ALTER TABLE `ForumMessages` DISABLE KEYS */;
/*!40000 ALTER TABLE `ForumMessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GeneralResourceContents`
--

DROP TABLE IF EXISTS `GeneralResourceContents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GeneralResourceContents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `generalResourceId` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `contentNumber` int NOT NULL,
  `isFile` tinyint(1) NOT NULL DEFAULT '0',
  `file` longblob,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `generalResourceId` (`generalResourceId`),
  CONSTRAINT `GeneralResourceContents_ibfk_1` FOREIGN KEY (`generalResourceId`) REFERENCES `GeneralResources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GeneralResourceContents`
--

LOCK TABLES `GeneralResourceContents` WRITE;
/*!40000 ALTER TABLE `GeneralResourceContents` DISABLE KEYS */;
/*!40000 ALTER TABLE `GeneralResourceContents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GeneralResources`
--

DROP TABLE IF EXISTS `GeneralResources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GeneralResources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingPackId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `resourceNumber` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingPackId` (`trainingPackId`),
  CONSTRAINT `GeneralResources_ibfk_1` FOREIGN KEY (`trainingPackId`) REFERENCES `TrainingPacks` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GeneralResources`
--

LOCK TABLES `GeneralResources` WRITE;
/*!40000 ALTER TABLE `GeneralResources` DISABLE KEYS */;
/*!40000 ALTER TABLE `GeneralResources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GlobalFeedbackSubTopics`
--

DROP TABLE IF EXISTS `GlobalFeedbackSubTopics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GlobalFeedbackSubTopics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `topic` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `globalFeedbackTopicId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `globalFeedbackTopicId` (`globalFeedbackTopicId`),
  CONSTRAINT `GlobalFeedbackSubTopics_ibfk_1` FOREIGN KEY (`globalFeedbackTopicId`) REFERENCES `GlobalFeedbackTopics` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GlobalFeedbackSubTopics`
--

LOCK TABLES `GlobalFeedbackSubTopics` WRITE;
/*!40000 ALTER TABLE `GlobalFeedbackSubTopics` DISABLE KEYS */;
/*!40000 ALTER TABLE `GlobalFeedbackSubTopics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GlobalFeedbackTopics`
--

DROP TABLE IF EXISTS `GlobalFeedbackTopics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GlobalFeedbackTopics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mainTopic` varchar(255) NOT NULL,
  `descriptionTopic` tinyint(1) DEFAULT NULL,
  `sessionOrderedModuleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionOrderedModuleId` (`sessionOrderedModuleId`),
  CONSTRAINT `GlobalFeedbackTopics_ibfk_1` FOREIGN KEY (`sessionOrderedModuleId`) REFERENCES `SessionOrderedModules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GlobalFeedbackTopics`
--

LOCK TABLES `GlobalFeedbackTopics` WRITE;
/*!40000 ALTER TABLE `GlobalFeedbackTopics` DISABLE KEYS */;
/*!40000 ALTER TABLE `GlobalFeedbackTopics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GlobalForumGroups`
--

DROP TABLE IF EXISTS `GlobalForumGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GlobalForumGroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolSessionGroupId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `groupOrder` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `schoolSessionGroupId` (`schoolSessionGroupId`),
  KEY `userId` (`userId`),
  CONSTRAINT `GlobalForumGroups_ibfk_3` FOREIGN KEY (`schoolSessionGroupId`) REFERENCES `SchoolSessionGroups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `GlobalForumGroups_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GlobalForumGroups`
--

LOCK TABLES `GlobalForumGroups` WRITE;
/*!40000 ALTER TABLE `GlobalForumGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `GlobalForumGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IndividualQuizFeedbackModules`
--

DROP TABLE IF EXISTS `IndividualQuizFeedbackModules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IndividualQuizFeedbackModules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionOrderedModuleId` int DEFAULT NULL,
  `linkedStep` int DEFAULT '-1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionOrderedModuleId` (`sessionOrderedModuleId`),
  CONSTRAINT `IndividualQuizFeedbackModules_ibfk_1` FOREIGN KEY (`sessionOrderedModuleId`) REFERENCES `SessionOrderedModules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IndividualQuizFeedbackModules`
--

LOCK TABLES `IndividualQuizFeedbackModules` WRITE;
/*!40000 ALTER TABLE `IndividualQuizFeedbackModules` DISABLE KEYS */;
/*!40000 ALTER TABLE `IndividualQuizFeedbackModules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IndividualSessionQuizQuestions`
--

DROP TABLE IF EXISTS `IndividualSessionQuizQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IndividualSessionQuizQuestions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `feedback` text NOT NULL,
  `correctAnswer` tinyint(1) NOT NULL,
  `individualSessionQuizId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `individualSessionQuizId` (`individualSessionQuizId`),
  CONSTRAINT `IndividualSessionQuizQuestions_ibfk_1` FOREIGN KEY (`individualSessionQuizId`) REFERENCES `IndividualSessionQuizzes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IndividualSessionQuizQuestions`
--

LOCK TABLES `IndividualSessionQuizQuestions` WRITE;
/*!40000 ALTER TABLE `IndividualSessionQuizQuestions` DISABLE KEYS */;
/*!40000 ALTER TABLE `IndividualSessionQuizQuestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IndividualSessionQuizzes`
--

DROP TABLE IF EXISTS `IndividualSessionQuizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IndividualSessionQuizzes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionOrderedModuleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionOrderedModuleId` (`sessionOrderedModuleId`),
  CONSTRAINT `IndividualSessionQuizzes_ibfk_1` FOREIGN KEY (`sessionOrderedModuleId`) REFERENCES `SessionOrderedModules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IndividualSessionQuizzes`
--

LOCK TABLES `IndividualSessionQuizzes` WRITE;
/*!40000 ALTER TABLE `IndividualSessionQuizzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `IndividualSessionQuizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InfoModuleElements`
--

DROP TABLE IF EXISTS `InfoModuleElements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InfoModuleElements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text,
  `line` tinyint(1) DEFAULT NULL,
  `box` tinyint(1) DEFAULT NULL,
  `order` int NOT NULL,
  `infoModuleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `infoModuleId` (`infoModuleId`),
  CONSTRAINT `InfoModuleElements_ibfk_1` FOREIGN KEY (`infoModuleId`) REFERENCES `InfoModules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InfoModuleElements`
--

LOCK TABLES `InfoModuleElements` WRITE;
/*!40000 ALTER TABLE `InfoModuleElements` DISABLE KEYS */;
/*!40000 ALTER TABLE `InfoModuleElements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `InfoModules`
--

DROP TABLE IF EXISTS `InfoModules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `InfoModules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionOrderedModuleId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionOrderedModuleId` (`sessionOrderedModuleId`),
  CONSTRAINT `InfoModules_ibfk_1` FOREIGN KEY (`sessionOrderedModuleId`) REFERENCES `SessionOrderedModules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `InfoModules`
--

LOCK TABLES `InfoModules` WRITE;
/*!40000 ALTER TABLE `InfoModules` DISABLE KEYS */;
/*!40000 ALTER TABLE `InfoModules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PackTemplateModules`
--

DROP TABLE IF EXISTS `PackTemplateModules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PackTemplateModules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingPackId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingPackId` (`trainingPackId`),
  CONSTRAINT `PackTemplateModules_ibfk_1` FOREIGN KEY (`trainingPackId`) REFERENCES `TrainingPacks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PackTemplateModules`
--

LOCK TABLES `PackTemplateModules` WRITE;
/*!40000 ALTER TABLE `PackTemplateModules` DISABLE KEYS */;
/*!40000 ALTER TABLE `PackTemplateModules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageInfoElements`
--

DROP TABLE IF EXISTS `PageInfoElements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageInfoElements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) DEFAULT NULL,
  `line` tinyint(1) DEFAULT NULL,
  `box` tinyint(1) DEFAULT NULL,
  `order` int NOT NULL,
  `pageInfoId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pageInfoId` (`pageInfoId`),
  CONSTRAINT `PageInfoElements_ibfk_1` FOREIGN KEY (`pageInfoId`) REFERENCES `PageInfos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageInfoElements`
--

LOCK TABLES `PageInfoElements` WRITE;
/*!40000 ALTER TABLE `PageInfoElements` DISABLE KEYS */;
/*!40000 ALTER TABLE `PageInfoElements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PageInfos`
--

DROP TABLE IF EXISTS `PageInfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PageInfos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingPackId` int DEFAULT NULL,
  `order` int DEFAULT NULL,
  `pageName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingPackId` (`trainingPackId`),
  CONSTRAINT `PageInfos_ibfk_1` FOREIGN KEY (`trainingPackId`) REFERENCES `TrainingPacks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PageInfos`
--

LOCK TABLES `PageInfos` WRITE;
/*!40000 ALTER TABLE `PageInfos` DISABLE KEYS */;
/*!40000 ALTER TABLE `PageInfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'user','2024-10-09 16:37:29','2024-10-09 16:37:29'),(2,'moderator','2024-10-09 16:37:29','2024-10-09 16:37:29'),(3,'admin','2024-10-09 16:37:29','2024-10-09 16:37:29');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SchoolGroups`
--

DROP TABLE IF EXISTS `SchoolGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SchoolGroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SchoolGroups`
--

LOCK TABLES `SchoolGroups` WRITE;
/*!40000 ALTER TABLE `SchoolGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `SchoolGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SchoolSessionGroups`
--

DROP TABLE IF EXISTS `SchoolSessionGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SchoolSessionGroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingPackId` int DEFAULT NULL,
  `schoolGroupId` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `notes` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingPackId` (`trainingPackId`),
  KEY `schoolGroupId` (`schoolGroupId`),
  CONSTRAINT `SchoolSessionGroups_ibfk_3` FOREIGN KEY (`trainingPackId`) REFERENCES `TrainingPacks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SchoolSessionGroups_ibfk_4` FOREIGN KEY (`schoolGroupId`) REFERENCES `SchoolGroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SchoolSessionGroups`
--

LOCK TABLES `SchoolSessionGroups` WRITE;
/*!40000 ALTER TABLE `SchoolSessionGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `SchoolSessionGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SessionGroups`
--

DROP TABLE IF EXISTS `SessionGroups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SessionGroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingSessionNameId` int DEFAULT NULL,
  `schoolSessionGroupId` int DEFAULT NULL,
  `finishTime` datetime DEFAULT NULL,
  `phaseNumber` int DEFAULT '0',
  `name` varchar(255) DEFAULT NULL,
  `repeated` int DEFAULT '0',
  `currentStep` int DEFAULT NULL,
  `finished` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingSessionNameId` (`trainingSessionNameId`),
  KEY `schoolSessionGroupId` (`schoolSessionGroupId`),
  CONSTRAINT `SessionGroups_ibfk_3` FOREIGN KEY (`trainingSessionNameId`) REFERENCES `TrainingSessionNames` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `SessionGroups_ibfk_4` FOREIGN KEY (`schoolSessionGroupId`) REFERENCES `SchoolSessionGroups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SessionGroups`
--

LOCK TABLES `SessionGroups` WRITE;
/*!40000 ALTER TABLE `SessionGroups` DISABLE KEYS */;
/*!40000 ALTER TABLE `SessionGroups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SessionOrderedModules`
--

DROP TABLE IF EXISTS `SessionOrderedModules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SessionOrderedModules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingSessionStepId` int DEFAULT NULL,
  `packTemplateModuleId` int DEFAULT NULL,
  `order` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingSessionStepId` (`trainingSessionStepId`),
  KEY `packTemplateModuleId` (`packTemplateModuleId`),
  CONSTRAINT `SessionOrderedModules_ibfk_3` FOREIGN KEY (`trainingSessionStepId`) REFERENCES `TrainingSessionSteps` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SessionOrderedModules_ibfk_4` FOREIGN KEY (`packTemplateModuleId`) REFERENCES `PackTemplateModules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SessionOrderedModules`
--

LOCK TABLES `SessionOrderedModules` WRITE;
/*!40000 ALTER TABLE `SessionOrderedModules` DISABLE KEYS */;
/*!40000 ALTER TABLE `SessionOrderedModules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SessionResources`
--

DROP TABLE IF EXISTS `SessionResources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SessionResources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `resourceNumber` int NOT NULL,
  `file` longblob,
  `trainingSessionNameId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingSessionNameId` (`trainingSessionNameId`),
  CONSTRAINT `SessionResources_ibfk_1` FOREIGN KEY (`trainingSessionNameId`) REFERENCES `TrainingSessionNames` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SessionResources`
--

LOCK TABLES `SessionResources` WRITE;
/*!40000 ALTER TABLE `SessionResources` DISABLE KEYS */;
/*!40000 ALTER TABLE `SessionResources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TrainingPacks`
--

DROP TABLE IF EXISTS `TrainingPacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrainingPacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TrainingPacks`
--

LOCK TABLES `TrainingPacks` WRITE;
/*!40000 ALTER TABLE `TrainingPacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `TrainingPacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TrainingSessionNames`
--

DROP TABLE IF EXISTS `TrainingSessionNames`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrainingSessionNames` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingPackId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `sessionTime` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingPackId` (`trainingPackId`),
  CONSTRAINT `TrainingSessionNames_ibfk_1` FOREIGN KEY (`trainingPackId`) REFERENCES `TrainingPacks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TrainingSessionNames`
--

LOCK TABLES `TrainingSessionNames` WRITE;
/*!40000 ALTER TABLE `TrainingSessionNames` DISABLE KEYS */;
/*!40000 ALTER TABLE `TrainingSessionNames` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TrainingSessionRestrictions`
--

DROP TABLE IF EXISTS `TrainingSessionRestrictions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrainingSessionRestrictions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingSessionNameId` int NOT NULL,
  `step` int NOT NULL,
  `minutes` int NOT NULL,
  `description` text NOT NULL,
  `order` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingSessionNameId` (`trainingSessionNameId`),
  CONSTRAINT `TrainingSessionRestrictions_ibfk_1` FOREIGN KEY (`trainingSessionNameId`) REFERENCES `TrainingSessionNames` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TrainingSessionRestrictions`
--

LOCK TABLES `TrainingSessionRestrictions` WRITE;
/*!40000 ALTER TABLE `TrainingSessionRestrictions` DISABLE KEYS */;
/*!40000 ALTER TABLE `TrainingSessionRestrictions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TrainingSessionSteps`
--

DROP TABLE IF EXISTS `TrainingSessionSteps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrainingSessionSteps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainingSessionNameId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `order` int NOT NULL,
  `split` tinyint(1) DEFAULT '0',
  `optional` tinyint(1) DEFAULT '0',
  `timerStep` tinyint(1) DEFAULT '0',
  `timeToPhase` int DEFAULT '0',
  `sessionResources` tinyint(1) DEFAULT '0',
  `generalResources` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainingSessionNameId` (`trainingSessionNameId`),
  CONSTRAINT `TrainingSessionSteps_ibfk_1` FOREIGN KEY (`trainingSessionNameId`) REFERENCES `TrainingSessionNames` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TrainingSessionSteps`
--

LOCK TABLES `TrainingSessionSteps` WRITE;
/*!40000 ALTER TABLE `TrainingSessionSteps` DISABLE KEYS */;
/*!40000 ALTER TABLE `TrainingSessionSteps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserEvaluationQuizResults`
--

DROP TABLE IF EXISTS `UserEvaluationQuizResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserEvaluationQuizResults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userModuleResultId` int DEFAULT NULL,
  `questionNumber` int NOT NULL,
  `questionSubNumber` int DEFAULT NULL,
  `answer` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userModuleResultId` (`userModuleResultId`),
  CONSTRAINT `UserEvaluationQuizResults_ibfk_1` FOREIGN KEY (`userModuleResultId`) REFERENCES `UserModuleResults` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserEvaluationQuizResults`
--

LOCK TABLES `UserEvaluationQuizResults` WRITE;
/*!40000 ALTER TABLE `UserEvaluationQuizResults` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserEvaluationQuizResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserIndividualQuizResults`
--

DROP TABLE IF EXISTS `UserIndividualQuizResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserIndividualQuizResults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userModuleResultId` int DEFAULT NULL,
  `questionNumber` int NOT NULL,
  `answer` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userModuleResultId` (`userModuleResultId`),
  CONSTRAINT `UserIndividualQuizResults_ibfk_1` FOREIGN KEY (`userModuleResultId`) REFERENCES `UserModuleResults` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserIndividualQuizResults`
--

LOCK TABLES `UserIndividualQuizResults` WRITE;
/*!40000 ALTER TABLE `UserIndividualQuizResults` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserIndividualQuizResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserModuleResults`
--

DROP TABLE IF EXISTS `UserModuleResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserModuleResults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userSessionResultId` int DEFAULT NULL,
  `order` int DEFAULT NULL,
  `fullMessages` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userSessionResultId` (`userSessionResultId`),
  CONSTRAINT `UserModuleResults_ibfk_1` FOREIGN KEY (`userSessionResultId`) REFERENCES `UserSessionResults` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserModuleResults`
--

LOCK TABLES `UserModuleResults` WRITE;
/*!40000 ALTER TABLE `UserModuleResults` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserModuleResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserResourceClickResults`
--

DROP TABLE IF EXISTS `UserResourceClickResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserResourceClickResults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userSessionResultId` int NOT NULL,
  `resourceNumber` int NOT NULL,
  `resourceSubNumber` int DEFAULT NULL,
  `isSessionResource` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userSessionResultId` (`userSessionResultId`),
  CONSTRAINT `UserResourceClickResults_ibfk_1` FOREIGN KEY (`userSessionResultId`) REFERENCES `UserSessionResults` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserResourceClickResults`
--

LOCK TABLES `UserResourceClickResults` WRITE;
/*!40000 ALTER TABLE `UserResourceClickResults` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserResourceClickResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserResults`
--

DROP TABLE IF EXISTS `UserResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserResults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserResults`
--

LOCK TABLES `UserResults` WRITE;
/*!40000 ALTER TABLE `UserResults` DISABLE KEYS */;
INSERT INTO `UserResults` VALUES (1,'2024-10-09 16:37:29','2024-10-09 16:37:29');
/*!40000 ALTER TABLE `UserResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserSessionResults`
--

DROP TABLE IF EXISTS `UserSessionResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserSessionResults` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userResultId` int NOT NULL,
  `sessionGroupId` int DEFAULT NULL,
  `forumGroupId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userResultId` (`userResultId`),
  KEY `sessionGroupId` (`sessionGroupId`),
  KEY `forumGroupId` (`forumGroupId`),
  CONSTRAINT `UserSessionResults_ibfk_4` FOREIGN KEY (`userResultId`) REFERENCES `UserResults` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserSessionResults_ibfk_5` FOREIGN KEY (`sessionGroupId`) REFERENCES `SessionGroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserSessionResults_ibfk_6` FOREIGN KEY (`forumGroupId`) REFERENCES `ForumGroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserSessionResults`
--

LOCK TABLES `UserSessionResults` WRITE;
/*!40000 ALTER TABLE `UserSessionResults` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserSessionResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserSessions`
--

DROP TABLE IF EXISTS `UserSessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserSessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionGroupId` int NOT NULL,
  `forumGroupId` int DEFAULT NULL,
  `currentStep` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessionGroupId` (`sessionGroupId`),
  KEY `forumGroupId` (`forumGroupId`),
  CONSTRAINT `UserSessions_ibfk_3` FOREIGN KEY (`sessionGroupId`) REFERENCES `SessionGroups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `UserSessions_ibfk_4` FOREIGN KEY (`forumGroupId`) REFERENCES `ForumGroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserSessions`
--

LOCK TABLES `UserSessions` WRITE;
/*!40000 ALTER TABLE `UserSessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserSessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `school` varchar(255) DEFAULT 'No School',
  `code` varchar(255) DEFAULT 'No Code',
  `roleId` int NOT NULL,
  `userResultId` int DEFAULT NULL,
  `schoolGroupId` int DEFAULT NULL,
  `userSessionId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_unique` (`username`),
  UNIQUE KEY `email_unique` (`email`),
  KEY `roleId` (`roleId`),
  KEY `userResultId` (`userResultId`),
  KEY `schoolGroupId` (`schoolGroupId`),
  KEY `userSessionId` (`userSessionId`),
  CONSTRAINT `Users_ibfk_5` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Users_ibfk_6` FOREIGN KEY (`userResultId`) REFERENCES `UserResults` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Users_ibfk_7` FOREIGN KEY (`schoolGroupId`) REFERENCES `SchoolGroups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Users_ibfk_8` FOREIGN KEY (`userSessionId`) REFERENCES `UserSessions` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'admin','admin','$2a$08$Hlr773ZE9XWgESTWt8GZNOeORZDGj5sF1e6FGn0i/c8wOTh.M6KMS','No School','No Code',2,1,NULL,NULL,'2024-10-09 16:37:29','2024-10-09 16:37:29');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-09 17:38:39
