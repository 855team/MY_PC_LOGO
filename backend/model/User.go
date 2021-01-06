package model

type User struct {
	Uid			uint		`gorm:"primaryKey;AUTOINCREMENT=1" json:"uid"`
	Username	string		`gorm:"uniqueIndex;type:VARCHAR(50) NOT NULL" json:"username"`
	Email		string		`gorm:"type:VARCHAR(50)" json:"email"`
	Turtle		uint		`gorm:"type:TINYINT UNSIGNED;default:1" json:"turtle"`
	Task		uint		`gorm:"type:TINYINT UNSIGNED;default:1" json:"task"`
	Projects	[]Project	`gorm:"many2many:users_projects" json:"projects"`
}

type UserAuth struct {
	Uid			uint		`gorm:"primaryKey;AUTOINCREMENT=1"`
	Username	string		`gorm:"uniqueIndex;type:VARCHAR(50) NOT NULL"`
	Password	string		`gorm:"type:VARCHAR(50) NOT NULL"`
}