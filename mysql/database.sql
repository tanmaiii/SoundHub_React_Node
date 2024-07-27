CREATE TABLE `playlists` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `user_id` INT,
  `genre_id` INT,
  `private` bool DEFAULT false,
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `image_path` VARCHAR(255),
  `verified` BOOLEAN DEFAULT false,
  `is_admin` BOOLEAN DEFAULT false
);

CREATE TABLE `songs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `user_id` INT,
  `genre_id` INT,
  `image_path` VARCHAR(255) NOT NULL,
  `song_path` VARCHAR(255) NOT NULL,
  `private` bool DEFAULT false,
  `created_at` timestamp DEFAULT (now())
);

CREATE TABLE `genre` (
  `id` INT PRIMARY KEY,
  `name` INT,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);

CREATE TABLE `playlist_songs` (
  `playlist_id` INT,
  `song_id` INT,
  `created_at` DATETIME,
  PRIMARY KEY (`playlist_id`, `song_id`)
);

CREATE TABLE `user_songs` (
  `user_id` INT,
  `song_id` INT,
  `confirm` bool,
  PRIMARY KEY (`user_id`, `song_id`)
);

CREATE TABLE `favourite_playlists` (
  `user_id` INT,
  `playlist_id` INT,
  `created_at` timestamp DEFAULT (now()),
  PRIMARY KEY (`user_id`, `playlist_id`)
);

CREATE TABLE `follows` (
  `follower_user_id` INT,
  `followed_user_id` INT,
  `created_at` timestamp DEFAULT (now()),
  PRIMARY KEY (`follower_user_id`, `followed_user_id`)
);

CREATE TABLE `favourite_songs` (
  `user_id` INT,
  `song_id` INT,
  `created_at` timestamp DEFAULT (now()),
  PRIMARY KEY (`user_id`, `song_id`)
);

ALTER TABLE `playlist_songs` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `playlist_songs` ADD FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`);

ALTER TABLE `favourite_playlists` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `favourite_playlists` ADD FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`);

ALTER TABLE `favourite_songs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `favourite_songs` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `songs` ADD FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);

ALTER TABLE `songs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `follows` ADD FOREIGN KEY (`follower_user_id`) REFERENCES `users` (`id`);

ALTER TABLE `follows` ADD FOREIGN KEY (`followed_user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_songs` ADD FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`);

ALTER TABLE `user_songs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `playlists` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `playlists` ADD FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`);
