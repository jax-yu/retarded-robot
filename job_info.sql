SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for job_info
-- ----------------------------
DROP TABLE IF EXISTS `job_info`;
CREATE TABLE `job_info` (
  `id` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL COMMENT '地市',
  `job_content` varchar(255) NOT NULL COMMENT '工作内容',
  `age_start` int(255) NOT NULL COMMENT '年龄开始',
  `age_end` int(255) NOT NULL COMMENT '年龄结束',
  `sex` varchar(255) NOT NULL COMMENT '年龄，男、女、不限',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '数据创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
