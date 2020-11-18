package model

type Project struct {
	Pid			uint		`gorm:"primaryKey;AUTOINCREMENT=1"`
	Name		string		`gorm:"type:VARCHAR(30)"`
	Files		[]File		`gorm:"foreignkey:Pid" json:"-"`
	Users		[]User		`gorm:"many2many:users_projects" json:"-"`
}

type File struct {
	Fid			uint		`gorm:"primaryKey;AUTOINCREMENT=1"`
	Pid			uint		`json:"-"`
	Name		string		`gorm:"type:VARCHAR(30)"`
	Content		string		`gorm:"type:MEDIUMBLOB"`
}