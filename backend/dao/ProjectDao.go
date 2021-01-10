package dao

import (
	"backend/model"
	"backend/repository"
)

func GetPidsByUid(pid uint) []uint {
	return repository.GetPidsByUid(pid)
}

func CreateProject(project model.Project) uint {
	return repository.CreateProject(project)
}

func GetProjectByPid(pid uint) model.Project {
	return repository.GetProjectByPid(pid)
}

func GetProjectWithFilesByPid(pid uint) model.Project {
	return repository.GetProjectWithFilesByPid(pid)
}

func SetProject(project model.Project) {
	repository.SaveProject(project)
	return
}

func DeleteProject(pid uint) {
	repository.DeleteProject(model.Project{
		Pid: pid,
	})
	return
}

func AddProjectToUser(pid uint, uid uint) {
	repository.PairUidAndPid(uid, pid)
	return
}

func CreateFile(file model.File) uint {
	return repository.CreateFile(file)
}

func GetFileByFid(fid uint) model.File {
	return repository.GetFileByFid(fid)
}

func SetFile(file model.File) {
	repository.SaveFile(file)
	return
}

func DeleteFile(fid uint) {
	repository.DeleteFile(model.File{
		Fid: fid,
	})
	return
}