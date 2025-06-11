/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 5.7.33 : Database - kuliah_soa
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`kuliah_soa` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `kuliah_soa`;

/*Table structure for table `buku` */

DROP TABLE IF EXISTS `buku`;

CREATE TABLE `buku` (
  `buku_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `buku_nama` varchar(255) DEFAULT NULL,
  `buku_tahun_terbit` int(4) DEFAULT NULL,
  `kategori_id` bigint(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`buku_id`),
  UNIQUE KEY `buku_buku_id_uindex` (`buku_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

/*Data for the table `buku` */

insert  into `buku`(`buku_id`,`buku_nama`,`buku_tahun_terbit`,`kategori_id`,`createdAt`,`updatedAt`,`deletedAt`) values 
(1,'Jojo',2022,1,NULL,NULL,NULL),
(2,'Harry Potter',2021,2,NULL,NULL,NULL),
(3,'Percy Jackson',2020,3,NULL,NULL,NULL),
(4,'Sherlock Holmes',2019,1,NULL,NULL,NULL),
(5,'The Lord of the Rings',2018,2,NULL,NULL,NULL),
(6,'Game of Thrones',2017,3,NULL,NULL,NULL),
(7,'House Of Dragon',2016,1,NULL,NULL,NULL),
(8,'Murder on the Orient Express',2015,2,NULL,NULL,NULL),
(9,'Attack on Titan',2015,3,NULL,NULL,NULL),
(10,'Death Note',2010,1,NULL,NULL,NULL),
(11,'Death on the Nile',2007,2,NULL,NULL,NULL),
(12,'The ABC Murders',2005,3,NULL,NULL,NULL);

/*Table structure for table `kategori_buku` */

DROP TABLE IF EXISTS `kategori_buku`;

CREATE TABLE `kategori_buku` (
  `kategori_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `kategori_nama` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`kategori_id`),
  UNIQUE KEY `kategori_buku_kategori_id_uindex` (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `kategori_buku` */

insert  into `kategori_buku`(`kategori_id`,`kategori_nama`,`createdAt`,`updatedAt`,`deletedAt`) values 
(1,'Action',NULL,NULL,NULL),
(2,'Comedy',NULL,NULL,NULL),
(3,'Romance',NULL,NULL,NULL);

/*Table structure for table `pengguna` */

DROP TABLE IF EXISTS `pengguna`;

CREATE TABLE `pengguna` (
  `pengguna_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pengguna_nama` varchar(255) DEFAULT NULL,
  `pengguna_jk` enum('pria','wanita') DEFAULT NULL,
  `pengguna_password` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `api_key` text,
  `refresh_token` text,
  `roles` text,
  PRIMARY KEY (`pengguna_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `pengguna` */

insert  into `pengguna`(`pengguna_id`,`pengguna_nama`,`pengguna_jk`,`pengguna_password`,`createdAt`,`updatedAt`,`deletedAt`,`api_key`,`refresh_token`,`roles`) values 
(1,'esther','wanita','$2b$10$w8.JYGmnZeI9uMu.X3b9wOvrauZp0NBeKnXONn31wJg.vZyvEs9oa',NULL,NULL,NULL,NULL,NULL,NULL),
(2,'evan','pria','$2b$10$w8.JYGmnZeI9uMu.X3b9wOvrauZp0NBeKnXONn31wJg.vZyvEs9oa',NULL,NULL,NULL,NULL,NULL,NULL),
(3,'mimi','pria','$2b$10$w8.JYGmnZeI9uMu.X3b9wOvrauZp0NBeKnXONn31wJg.vZyvEs9oa',NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `toko` */

DROP TABLE IF EXISTS `toko`;

CREATE TABLE `toko` (
  `toko_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `toko_nama` varchar(255) DEFAULT NULL,
  `pengguna_id` bigint(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`toko_id`),
  UNIQUE KEY `toko_toko_id_uindex` (`toko_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `toko` */

insert  into `toko`(`toko_id`,`toko_nama`,`pengguna_id`,`createdAt`,`updatedAt`,`deletedAt`) values 
(1,'Sumber Pinter',1,NULL,NULL,NULL),
(2,'Pokoke Lulus',2,NULL,NULL,NULL),
(3,'Buku Dimasak Diminum',3,NULL,NULL,NULL);

/*Table structure for table `toko_buku` */

DROP TABLE IF EXISTS `toko_buku`;

CREATE TABLE `toko_buku` (
  `tb_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `toko_id` bigint(20) DEFAULT NULL,
  `buku_id` bigint(20) DEFAULT NULL,
  `tb_stok` bigint(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`tb_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Data for the table `toko_buku` */

insert  into `toko_buku`(`tb_id`,`toko_id`,`buku_id`,`tb_stok`,`createdAt`,`updatedAt`,`deletedAt`) values 
(1,1,1,11,NULL,NULL,NULL),
(2,1,3,13,NULL,NULL,NULL),
(3,1,5,15,NULL,NULL,NULL),
(4,2,2,22,NULL,NULL,NULL),
(5,2,4,24,NULL,NULL,NULL),
(6,2,6,26,NULL,NULL,NULL),
(7,3,1,31,NULL,NULL,NULL),
(8,3,5,35,NULL,NULL,NULL),
(9,3,2,32,NULL,NULL,NULL),
(10,3,4,34,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
