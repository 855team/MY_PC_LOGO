package service

import (
	"backend/dao"
	"backend/model"
	"backend/utils"
)

func NewProject(params utils.NewProjectParams) (success bool, msg int, data uint) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		success, msg, data = true, utils.ProjectNewSuccess, dao.CreateProject(model.Project{
			Name: params.Name,
		})
		dao.AddProjectToUser(data, uid)
	} else {
		success, msg, data = false, utils.InvalidToken, 0
	}

	return
}

func ModifyProject(params utils.ModifyProjectParams) (success bool, msg int) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		ownedPids := dao.GetPidsByUid(uid)
		if !utils.UintListContains(ownedPids, params.Pid) {
			success, msg = false, utils.ProjectNoPermission
		} else {
			project := dao.GetProjectByPid(params.Pid)
			project.Name = params.Name
			dao.SetProject(project)
			success, msg = true, utils.ProjectModifySuccess
		}
	} else {
		success, msg = false, utils.InvalidToken
	}

	return
}

func GetProject(params utils.GetProjectParams) (success bool, msg int, data utils.GetProjectResponse) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		ownedPids := dao.GetPidsByUid(uid)
		if !utils.UintListContains(ownedPids, params.Pid) {
			success, msg, data = false, utils.ProjectNoPermission, utils.GetProjectResponse{}
		} else {
			project := dao.GetProjectWithFilesByPid(params.Pid)
			success, msg, data = true, utils.ProjectGetSuccess, utils.GetProjectResponse{
				Pid: project.Pid,
				Name: project.Name,
				Files: project.Files,
			}
		}
	} else {
		success, msg, data = false, utils.InvalidToken, utils.GetProjectResponse{}
	}

	return
}

func DeleteProject(params utils.DeleteProjectParams) (success bool, msg int) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		ownedPids := dao.GetPidsByUid(uid)
		if utils.UintListContains(ownedPids, params.Pid) {
			dao.DeleteProject(params.Pid)
			success, msg = true, utils.ProjectDeleteSuccess
		} else {
			success, msg = false, utils.ProjectNoPermission
		}
	} else {
		success, msg = false, utils.InvalidToken
	}

	return
}

func NewFile(params utils.NewFileParams) (success bool, msg int, data uint) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		ownedPids := dao.GetPidsByUid(uid)
		if utils.UintListContains(ownedPids, params.Pid) {
			success, msg, data = true, utils.FileNewSuccess, dao.CreateFile(model.File{
				Pid: params.Pid,
				Name: params.Name,
				Content: params.Content,
			})
		} else {
			success, msg, data = false, utils.ProjectNoPermission, 0
		}

	} else {
		success, msg, data = false, utils.InvalidToken, 0
	}

	return
}

func ModifyFile(params utils.ModifyFileParams) (success bool, msg int) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		ownedPids := dao.GetPidsByUid(uid)
		file := dao.GetFileByFid(params.Fid)
		if !utils.UintListContains(ownedPids, file.Pid) {
			success, msg = false, utils.FileNoPermission
		} else {
			file.Name = params.Name
			file.Content = params.Content
			dao.SetFile(file)
			success, msg = true, utils.FileModifySuccess
		}
	} else {
		success, msg = false, utils.InvalidToken
	}

	return
}

func DeleteFile(params utils.DeleteFileParams) (success bool, msg int) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		ownedPids := dao.GetPidsByUid(uid)
		file := dao.GetFileByFid(params.Fid)
		if !utils.UintListContains(ownedPids, file.Pid) {
			success, msg = false, utils.FileNoPermission
		} else {
			dao.DeleteFile(file.Fid)
			success, msg = true, utils.FileDeleteSuccess
		}
	} else {
		success, msg = false, utils.InvalidToken
	}

	return
}