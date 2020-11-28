package model

type User struct {
	Uid			uint		`gorm:"primaryKey;AUTOINCREMENT=1"`
	Username	string		`gorm:"uniqueIndex;type:VARCHAR(50) NOT NULL"`
	Email		string		`gorm:"type:VARCHAR(50)"`
	Turtle		uint		`gorm:"type:TINYINT UNSIGNED;default:1"`
	Task		uint		`gorm:"type:TINYINT UNSIGNED;default:1"`
	Projects	[]Project	`gorm:"many2many:users_projects"`
}

type UserAuth struct {
	Uid			uint		`gorm:"primaryKey;AUTOINCREMENT=1"`
	Username	string		`gorm:"uniqueIndex;type:VARCHAR(50) NOT NULL"`
	Password	string		`gorm:"type:VARCHAR(50) NOT NULL"`
}