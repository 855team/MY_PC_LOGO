package model

type Project struct {
	Pid			uint		`gorm:"primaryKey;AUTOINCREMENT=1" json:"pid"`
	Name		string		`gorm:"type:VARCHAR(100)" json:"name"`
	Files		[]File		`gorm:"foreignkey:Pid" json:"-"`
	Users		[]User		`gorm:"many2many:users_projects" json:"-"`
}

type File struct {
	Fid			uint		`gorm:"primaryKey;AUTOINCREMENT=1" json:"fid"`
	Pid			uint		`json:"-" json:"pid"`
	Name		string		`gorm:"type:VARCHAR(100)" json:"name"`
	Content		string		`gorm:"type:MEDIUMBLOB" json:"content"`
}