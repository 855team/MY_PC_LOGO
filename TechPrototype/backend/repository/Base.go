package repository

import (
	"backend/model"
	"backend/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error
var uri = "test:test@tcp(localhost:3306)/test?charset=utf8mb4&parseTime=True&loc=Local"


func InitDBConn() {
	db, err = gorm.Open(mysql.Open(uri), &gorm.Config{})
	if err != nil {
		panic("Failed when connecting to DB " + uri)
	}

	_ = db.AutoMigrate(&model.UserAuth{})
	_ = db.AutoMigrate(&model.User{})
	_ = db.AutoMigrate(&model.Project{})
	_ = db.AutoMigrate(&model.File{})

	if utils.IsTest {
		testPrepare()
	}
}

func testPrepare() {
	db.Create(&model.User{Uid: 1, Username: "test", Email: "test"})
	db.Create(&model.UserAuth{Uid: 1, Username: "test", Password: "test"})
}