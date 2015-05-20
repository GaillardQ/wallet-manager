DROP TABLE IF EXIST param;
DROP TABLE IF EXISTS clearance;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS media;

CREATE TABLE IF NOT EXISTS `user` 
(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`mail` varchar(45) NOT NULL,
	`pass` varchar(45) NOT NULL,
	PRIMARY KEY (`id`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `param` 
(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`p` varchar(45) NOT NULL,
	`value` varchar(45) NOT NULL,
	`user_id` int(11) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `fk_param_user_idx` (`user_id`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `param`
ADD CONSTRAINT `fk_param_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE TABLE IF NOT EXISTS `clearance` 
(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`month` DATE NOT NULL,
	`value` DOUBLE NOT NULL,
	`user_id` int(11) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `fk_clearance_user_idx` (`user_id`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE `clearance`
ADD CONSTRAINT `fk_clearance_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

CREATE TABLE IF NOT EXISTS `media` 
(
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`value` VARCHAR(45) NOT NULL,
	PRIMARY KEY (`id`)
)
 ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
 
CREATE TABLE IF NOT EXISTS `payment` 
(
	`id` int(11) NOT NULL AUTO_INCREMENT, 
	`user_id` int(11),
	`paid_at` DATE NOT NULL,
	`value` DOUBLE NOT NULL,
	`media_id` int(11),
	`motive` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`),
	KEY `fk_payment_media_idx` (`media_id`),
	KEY `fk_payment_user_idx` (`user_id`)
)
 ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
 
ALTER TABLE `payment`
ADD CONSTRAINT `fk_payment_media` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
  
INSERT INTO `media` (value) VALUES ('CB'), ('Chèque'), ('Virement');
