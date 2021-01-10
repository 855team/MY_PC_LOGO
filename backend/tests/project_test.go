package tests

import (
	"backend/dao"
	"backend/model"
	"backend/utils"
	"github.com/kataras/iris/v12"
	"testing"
	"time"
)

func TestNewProject(t *testing.T) {
	bodySuccess := utils.NewProjectParams {
		Token: testToken1,
		Name: "test_newproj_" + time.Now().Format("2006-01-02 15:04:05"),
	}
	bodyGetProject := utils.GetProjectParams {
		Token: testToken1,
		Pid: 1,
	}
	bodyInvalidToken := utils.NewProjectParams {
		Token: "invalid!",
	}
	bodyWrongArgsType := map[string]int {
		"token": 123,
	}
	post(t, "/newproject", bodySuccess, iris.StatusOK, true, utils.ProjectNewSuccess, nil)
	post(t, "/getproject", bodyGetProject, iris.StatusOK, true, utils.ProjectGetSuccess, nil)
	post(t, "/newproject", bodyInvalidToken, iris.StatusOK, false, utils.InvalidToken, nil)
	post(t, "/newproject", bodyWrongArgsType, iris.StatusBadRequest, false, utils.InvalidFormat, nil)
}

func TestGetProject(t *testing.T) {
	bodySuccess := utils.GetProjectParams {
		Token: testToken1,
		Pid: 1,
	}
	bodyInvalidToken := utils.GetProjectParams {
		Token: "invalid!",
	}
	bodyWrongArgsType := map[string]int {
		"token": 123,
	}
	post(t, "/getproject", bodySuccess, iris.StatusOK, true, utils.ProjectGetSuccess, nil)
	post(t, "/getproject", bodyInvalidToken, iris.StatusOK, false, utils.InvalidToken, nil)
	post(t, "/getproject", bodyWrongArgsType, iris.StatusBadRequest, false, utils.InvalidFormat, nil)
}

func TestModifyProject(t *testing.T) {
	bodySuccess := utils.ModifyProjectParams {
		Token: testToken1,
		Pid: 1,
		Name: "test_proj_mod",
	}
	bodyNoPermission := utils.ModifyProjectParams {
		Token: testToken2,
		Pid: 1,
		Name: "test_proj_mod",
	}
	bodyGetProject := utils.GetProjectParams {
		Token: testToken1,
		Pid: 1,
	}
	bodyInvalidToken := utils.ModifyProjectParams {
		Token: "invalid!",
	}
	bodyWrongArgsType := map[string]int {
		"token": 123,
	}
	responseGetProject := map[string]interface{} {
		"pid": 1,
		"name": "test_proj_mod",
	}
	post(t, "/modifyproject", bodySuccess, iris.StatusOK, true, utils.ProjectModifySuccess, nil)
	post(t, "/modifyproject", bodyNoPermission, iris.StatusOK, false, utils.ProjectNoPermission, nil)
	post(t, "/getproject", bodyGetProject, iris.StatusOK, true, utils.ProjectGetSuccess, nil).
		Value("data").Object().ContainsMap(responseGetProject)
	bodySuccess.Name = "test_proj"
	post(t, "/modifyproject", bodySuccess, iris.StatusOK, true, utils.ProjectModifySuccess, nil)
	responseGetProject["name"] = "test_proj"
	post(t, "/getproject", bodyGetProject, iris.StatusOK, true, utils.ProjectGetSuccess, nil).
		Value("data").Object().ContainsMap(responseGetProject)
	post(t, "/modifyproject", bodyInvalidToken, iris.StatusOK, false, utils.InvalidToken, nil)
	post(t, "/modifyproject", bodyWrongArgsType, iris.StatusBadRequest, false, utils.InvalidFormat, nil)
}

func TestDeleteProject(t *testing.T) {
	bodySuccess := utils.DeleteProjectParams {
		Token: testToken1,
		Pid: 1,
	}
	bodyNoPermission := utils.DeleteProjectParams {
		Token: testToken2,
		Pid: 1,
	}
	bodyGetProject := utils.GetProjectParams {
		Token: testToken1,
		Pid: 1,
	}
	bodyInvalidToken := utils.DeleteProjectParams {
		Token: "invalid!",
	}
	bodyWrongArgsType := map[string]int {
		"token": 123,
	}
	post(t, "/deleteproject", bodySuccess, iris.StatusOK, true, utils.ProjectDeleteSuccess, nil)
	post(t, "/deleteproject", bodyNoPermission, iris.StatusOK, false, utils.ProjectNoPermission, nil)
	post(t, "/getproject", bodyGetProject, iris.StatusOK, false, utils.ProjectNoPermission, nil)
	post(t, "/deleteproject", bodyInvalidToken, iris.StatusOK, false, utils.InvalidToken, nil)
	post(t, "/deleteproject", bodyWrongArgsType, iris.StatusBadRequest, false, utils.InvalidFormat, nil)

	dao.CreateProject(model.Project{Pid: 1, Name: "test_proj"})
	dao.AddProjectToUser(1, 1)
	dao.CreateFile(model.File{Fid: 1, Pid: 1, Name: "test_file", Content: "test_file"})
}

func TestNewFile(t *testing.T) {
	bodySuccess := utils.NewFileParams {
		Token: testToken1,
		Pid: 1,
		Name: "test_file_" + time.Now().Format("2006-01-02 15:04:05"),
		Content: "test_file",
	}
	bodyProjNoPermission := utils.NewFileParams {
		Token: testToken1,
		Pid: 0,
		Name: "test_file_" + time.Now().Format("2006-01-02 15:04:05"),
		Content: "test_file",
	}
	bodyInvalidToken := utils.NewFileParams {
		Token: "invalid!",
	}
	bodyWrongArgsType := map[string]int {
		"token": 123,
	}
	post(t, "/newfile", bodySuccess, iris.StatusOK, true, utils.FileNewSuccess, nil)
	post(t, "/newfile", bodyProjNoPermission, iris.StatusOK, false, utils.ProjectNoPermission, nil)
	post(t, "/newfile", bodyInvalidToken, iris.StatusOK, false, utils.InvalidToken, nil)
	post(t, "/newfile", bodyWrongArgsType, iris.StatusBadRequest, false, utils.InvalidFormat, nil)
}

func TestModifyFile(t *testing.T) {
	bodySuccess := utils.ModifyFileParams {
		Token: testToken1,
		Fid: 1,
		Name: "test_file_" + time.Now().Format("2006-01-02 15:04:05"),
		Content: "test_file",
	}
	bodyFileNoPermission := utils.ModifyFileParams {
		Token: testToken1,
		Fid: 0,
		Name: "test_file_" + time.Now().Format("2006-01-02 15:04:05"),
		Content: "test_file",
	}
	bodyInvalidToken := utils.ModifyFileParams {
		Token: "invalid!",
	}
	bodyWrongArgsType := map[string]int {
		"token": 123,
	}
	post(t, "/modifyfile", bodySuccess, iris.StatusOK, true, utils.FileModifySuccess, nil)
	post(t, "/modifyfile", bodyFileNoPermission, iris.StatusOK, false, utils.FileNoPermission, nil)
	post(t, "/modifyfile", bodyInvalidToken, iris.StatusOK, false, utils.InvalidToken, nil)
	post(t, "/modifyfile", bodyWrongArgsType, iris.StatusBadRequest, false, utils.InvalidFormat, nil)
}

func TestDeleteFile(t *testing.T) {
	bodySuccess := utils.DeleteFileParams {
		Token: testToken1,
		Fid: 1,
	}
	bodyFileNoPermission := utils.ModifyFileParams {
		Token: testToken1,
		Fid: 0,
	}
	bodyInvalidToken := utils.ModifyFileParams {
		Token: "invalid!",
	}
	bodyWrongArgsType := map[string]int {
		"token": 123,
	}
	post(t, "/deletefile", bodySuccess, iris.StatusOK, true, utils.FileDeleteSuccess, nil)
	post(t, "/deletefile", bodyFileNoPermission, iris.StatusOK, false, utils.FileNoPermission, nil)
	post(t, "/deletefile", bodyInvalidToken, iris.StatusOK, false, utils.InvalidToken, nil)
	post(t, "/deletefile", bodyWrongArgsType, iris.StatusBadRequest, false, utils.InvalidFormat, nil)

	dao.CreateFile(model.File{Fid: 1, Pid: 1, Name: "test_file", Content: "test_file"})
}