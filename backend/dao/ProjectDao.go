package dao

import (
	"backend/model"
	"backend/repository"
)

var GetPidsByUid = func(pid uint) []uint {
	return repository.GetPidsByUid(pid)
}

var CreateProject = func(project model.Project) uint {
	return repository.CreateProject(project)
}

var GetProjectByPid = func(pid uint) model.Project {
	return repository.GetProjectByPid(pid)
}

var GetProjectWithFilesByPid = func(pid uint) model.Project {
	return repository.GetProjectWithFilesByPid(pid)
}

var SetProject = func(project model.Project) {
	repository.SaveProject(project)
	return
}

var DeleteProject = func(pid uint) {
	repository.DeleteProject(model.Project{
		Pid: pid,
	})
	return
}

var AddProjectToUser = func(pid uint, uid uint) {
	repository.PairUidAndPid(uid, pid)
	return
}

var CreateFile = func(file model.File) uint {
	return repository.CreateFile(file)
}

var GetFileByFid = func(fid uint) model.File {
	return repository.GetFileByFid(fid)
}

var SetFile = func(file model.File) {
	repository.SaveFile(file)
	return
}

var DeleteFile = func(fid uint) {
	repository.DeleteFile(model.File{
		Fid: fid,
	})
	return
}