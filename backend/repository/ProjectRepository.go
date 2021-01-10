package repository

import (
	"backend/model"
	"gorm.io/gorm/clause"
)

func CreateProject(project model.Project) uint {
	db.Create(&project)
	return project.Pid
}

func GetProjectByPid(pid uint) (ret model.Project) {
	db.First(&ret, "pid = ?", pid)
	return
}

func GetProjectWithFilesByPid(pid uint) (ret model.Project) {
	db.Preload("Files").First(&ret, "pid = ?", pid)
	return
}

func SaveProject(project model.Project) {
	db.Save(&project)
	return
}

func DeleteProject(project model.Project) {
	db.Select(clause.Associations).Delete(&project)
	return
}

func GetFileByFid(fid uint) (ret model.File) {
	db.First(&ret, "fid = ?", fid)
	return
}

func CreateFile(file model.File) uint {
	db.Create(&file)
	return file.Fid
}

func SaveFile(file model.File) {
	db.Save(&file)
	return
}

func DeleteFile(file model.File) {
	db.Delete(&file)
	return
}