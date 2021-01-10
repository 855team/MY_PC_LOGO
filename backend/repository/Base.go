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
	db.Create(&model.User{Uid: 2, Username: "test1", Email: "test1"})
	db.Create(&model.User{Uid: 3, Username: "test2", Email: "test2"})
	db.Create(&model.User{Uid: 4, Username: "tests-noemail"})

	db.Create(&model.UserAuth{Uid: 1, Username: "test", Password: "test"})
	db.Create(&model.UserAuth{Uid: 2, Username: "test1", Password: "test1"})
	db.Create(&model.UserAuth{Uid: 3, Username: "test2", Password: "test2"})
	db.Create(&model.UserAuth{Uid: 4, Username: "tests-noemail", Password: "tests-noemail"})

	db.Create(&model.Project{Pid: 1, Name: "test_proj"})
	db.Table("users_projects").Create(&map[string]interface{} {
		"user_uid": 1,
		"project_pid": 1,
	})
	db.Create(&model.File{Fid: 1, Pid: 1, Name: "test_file", Content: "test_file"})
}